const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testConnection() {
  try {
    const result = await client.config.credentials();
    console.log('Credentials are valid:', result);
  } catch (error) {
    console.error('Failed to load credentials:', error);
  }
}

testConnection();