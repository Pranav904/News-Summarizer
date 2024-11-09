// app/api/recommendation/route.js

import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { NextResponse } from 'next/server';

// Initialize DynamoDB client
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });

export const GET = withApiAuthRequired(async function handler(req) {
   const session = await getSession(req);

   if (!session || !session.user) {
      return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 });
   }

   const userId = session.user.sub;

   // Extract lastKey and tags from query parameters (for pagination and tag preferences)
   const { searchParams } = new URL(req.url);
   const lastKey = searchParams.get('lastKey') ? JSON.parse(searchParams.get('lastKey')) : undefined;
   const tags = searchParams.get('tags') ? JSON.parse(searchParams.get('tags')) : undefined;

   try {
      console.log('Fetching recommendations for user:', userId);
      const preferredTags = tags || [];

      if (preferredTags.length === 0) {
         return NextResponse.json({ articles: [] }, { status: 200 });
      }

      // Construct the filter expression for DynamoDB scan based on user preferred tags
      const filterExpression = preferredTags.map((_, idx) => `contains(tags, :tag${idx})`).join(' OR ');
      const expressionAttributeValues = preferredTags.reduce((acc, tag, idx) => {
         acc[`:tag${idx}`] = { S: tag };
         return acc;
      }, {});

      const articlesCommand = new ScanCommand({
         TableName: 'ArticleSummaries',
         FilterExpression: filterExpression,
         ExpressionAttributeValues: expressionAttributeValues,
         Limit: 10,
         ExclusiveStartKey: lastKey, // Pagination
      });

      const articlesData = await dynamoDbClient.send(articlesCommand);

      // Format and filter articles to remove irrelevant tags
      const uniqueArticles = new Map(); // Use a map to filter out duplicates by article_id

      articlesData.Items.forEach((item) => {
         const articleId = item.id.S;

         if (!uniqueArticles.has(articleId)) {
            // Filter tags to include only those in the user's preferredTags
            const filteredTags = item.tags.L
               ? item.tags.L.map((tag) => tag.S).filter((tag) => preferredTags.includes(tag))
               : [];

            uniqueArticles.set(articleId, {
               article_id: articleId,
               title: item.title.S,
               content: item.summary.S,
               tags: filteredTags, // Only include preferred tags
               image_url: item.imageUrl.S,
               author: item.author.S,
               published_date: item.publishDate.N,
               url: item.url.S,
            });
         }
      });

      return NextResponse.json({ 
         articles: Array.from(uniqueArticles.values()), // Convert map to array
         lastKey: articlesData.LastEvaluatedKey || null, // Return LastEvaluatedKey for pagination
      }, { status: 200 });

   } catch (error) {
      console.error('Error fetching recommendations:', error);
      return NextResponse.json({ error: 'Error fetching recommendations' }, { status: 500 });
   }
});
