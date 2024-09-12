const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

// Initialize DynamoDB client with credentials from .env
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

app.prepare().then(() => {
  const server = express();

  server.get('/api/articles', async (req, res) => {
    try {
      const { lastEvaluatedKey } = req.query;

      const params = {
        TableName: TABLE_NAME,
        Limit: 5,
        ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined,
      };

      const command = new ScanCommand(params);
      const data = await docClient.send(command);

      res.json({
        articles: data.Items,
        lastEvaluatedKey: data.LastEvaluatedKey ? JSON.stringify(data.LastEvaluatedKey) : null,
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: 'An error occurred while fetching articles' });
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});