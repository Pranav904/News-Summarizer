import { getSession } from '@auth0/nextjs-auth0';
import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export default async function handler(req, res) {
  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  const userId = session.user.sub; // This is the Auth0 user ID

  if (req.method === 'POST') {
    const { preferences } = req.body;

    try {
      // Insert or update the user's preferences in DynamoDB
      const params = {
        TableName: TABLE_NAME,
        Item: {
          userId,
          preferences,
        },
      };

      await dynamoDb.put(params).promise();
      res.status(200).json({ message: 'Preferences saved' });
    } catch (err) {
      res.status(500).json({ error: 'Could not save preferences' });
    }
  } else if (req.method === 'GET') {
    try {
      // Get the user's preferences from DynamoDB
      const params = {
        TableName: TABLE_NAME,
        Key: { userId },
      };

      const result = await dynamoDb.get(params).promise();
      if (result.Item) {
        res.status(200).json(result.Item);
      } else {
        res.status(200).json({ preferences: [] });
      }
    } catch (err) {
      res.status(500).json({ error: 'Could not fetch preferences' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
