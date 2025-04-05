// app/api/recommendation/route.js

import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { NextResponse } from 'next/server';

// Initialize DynamoDB client
const dynamoDbClient = new DynamoDBClient(process.env.AWS_REGION);

// Simple in-memory cache with TTL (5 minutes)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Extract query parameters from request
 */
function extractQueryParams(req) {
  const { searchParams } = new URL(req.url);
  return {
    lastKey: searchParams.get('lastKey') ? JSON.parse(searchParams.get('lastKey')) : undefined,
    tags: searchParams.get('tags') ? JSON.parse(searchParams.get('tags')) : [],
    limit: parseInt(searchParams.get('limit') || '10', 10)
  };
}

/**
 * Build DynamoDB scan parameters with optimized settings
 */
function buildScanParams(preferredTags, lastKey, limit) {
  // Create filter expression for tag matching
  const filterExpression = preferredTags.map((_, idx) => `contains(tags, :tag${idx})`).join(' OR ');
  const expressionAttributeValues = preferredTags.reduce((acc, tag, idx) => {
    acc[`:tag${idx}`] = { S: tag };
    return acc;
  }, {});

  return {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    Limit: Math.min(limit * 2, 20), // Fetch more to allow for better ranking
    ExclusiveStartKey: lastKey,
    ConsistentRead: false, // Eventually consistent read for better performance
    ReturnConsumedCapacity: 'NONE'
  };
}

/**
 * Process and rank articles from DynamoDB by tag relevance
 */
function processArticles(items, preferredTags, limit) {
  const uniqueArticles = new Map();

  items.forEach((item) => {
    const articleId = item.id.S;
    if (!uniqueArticles.has(articleId)) {
      // Extract article tags
      const articleTags = item.tags.S ? JSON.parse(item.tags.S).map(tag => tag.S) : [];
      // Calculate relevance score (how many preferred tags match)
      const matchingTags = articleTags.filter(tag => preferredTags.includes(tag));
      const relevanceScore = matchingTags.length;
      
      uniqueArticles.set(articleId, {
        article_id: articleId,
        title: item.title.S,
        content: item.summary.S,
        tags: matchingTags, // Only include matched tags
        image_url: item.imageUrl.S,
        author: item.author.S,
        published_date: item.publishDate.S,
        url: item.url.S,
        relevanceScore // Added for sorting
      });
    }
    
  });

  // Sort by relevance score, then add some randomness within same score
  const sortedArticles = Array.from(uniqueArticles.values())
    .sort((a, b) => {
      if (b.relevanceScore === a.relevanceScore) {
        return Math.random() - 0.5; // Randomize within same score
      }
      return b.relevanceScore - a.relevanceScore; // Higher scores first
    })
    .slice(0, limit); // Limit to requested number
  
  // Remove the relevanceScore property before returning
  return sortedArticles.map(article => {
    const { relevanceScore, ...cleanArticle } = article;
    return cleanArticle;
  });
}

/**
 * Check if response is in cache and still valid
 */
function getCachedResponse(cacheKey) {
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
    // Clear expired cache entry
    cache.delete(cacheKey);
  }
  return null;
}

export const GET = withApiAuthRequired(async function handler(req) {
  try {
    // Validate authentication
    const session = await getSession(req);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 });
    }
    const userId = session.user.sub;

    // Get query parameters
    const { lastKey, tags, limit } = extractQueryParams(req);
    const preferredTags = tags || [];
    
    console.log('Fetching recommendations for user:', userId);
    
    // Return empty array if no tags provided
    if (preferredTags.length === 0) {
      return NextResponse.json({ articles: [] }, { status: 200 });
    }

    // Check cache first (only if not paginating)
    const cacheKey = !lastKey ? `${userId}-${JSON.stringify(preferredTags.sort())}-${limit}` : null;
    if (cacheKey) {
      const cachedData = getCachedResponse(cacheKey);
      if (cachedData) {
        console.log('Serving recommendations from cache');
        return NextResponse.json(cachedData, { status: 200 });
      }
    }

    // Query DynamoDB
    const scanParams = buildScanParams(preferredTags, lastKey, limit);
    const articlesCommand = new ScanCommand(scanParams);
    const articlesData = await dynamoDbClient.send(articlesCommand);

    // Process articles with improved ranking
    const rankedArticles = processArticles(articlesData.Items, preferredTags, limit);

    // Create response
    const response = {
      articles: rankedArticles,
      lastKey: articlesData.LastEvaluatedKey || null,
    };

    // Cache the response if not paginating
    if (cacheKey) {
      cache.set(cacheKey, { 
        data: response, 
        timestamp: Date.now() 
      });
    }

    // Return formatted response
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    
    // Handle different error types
    if (error.name === 'ValidationException') {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.message },
        { status: 400 }
      );
    } else if (error.name === 'ProvisionedThroughputExceededException') {
      return NextResponse.json(
        { error: 'Rate limit exceeded, please try again later', details: error.message },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error fetching recommendations', details: error.message },
      { status: 500 }
    );
  }
});
