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

   // Extract lastKey from query parameters (for pagination)
   const { searchParams } = new URL(req.url);
   const lastKey = searchParams.get('lastKey') ? JSON.parse(searchParams.get('lastKey')) : undefined;
   const tags = searchParams.get('tags') ? JSON.parse(searchParams.get('tags')) : undefined;

   try {
      console.log('Fetching recommendations for user:', userId);
      const preferredTags = tags || [];

      if (preferredTags.length === 0) {
         return NextResponse.json({ articles: [] }, { status: 200 });
      }

      // Construct filter expression and fetch recommended articles based on user tags
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
         ExclusiveStartKey: lastKey, // Use the last evaluated key for pagination
      });

      const articlesData = await dynamoDbClient.send(articlesCommand);

      // Format and return the articles
      const articles = articlesData.Items.map((item) => ({
         article_id: item.id.S,
         title: item.title.S,
         content: item.summary.S,
         tags: item.tags.L ? item.tags.L.map((tag) => tag.S) : [],
         image_url: item.imageUrl.S,
         author: item.author.S,
         published_date: item.publishDate.N,
         url: item.url.S,
      }));

      return NextResponse.json({ 
         articles, 
         lastKey: articlesData.LastEvaluatedKey || null // Return LastEvaluatedKey for further pagination
      }, { status: 200 });

   } catch (error) {
      console.error('Error fetching recommendations:', error);
      return NextResponse.json({ error: 'Error fetching recommendations' }, { status: 500 });
   }
});
