import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

// Handle the POST request to save preferences
export const POST = withApiAuthRequired(async (req) => {
  const session = await getSession(req);

  if (!session) {
    return new Response(JSON.stringify({ error: 'User is not authenticated' }), { status: 401 });
  }

  const userId = session.user.sub; // User's unique identifier
  const { preferences } = await req.json(); // Expecting an array of preferences

  if (!Array.isArray(preferences)) {
    return new Response(JSON.stringify({ error: 'Preferences must be an array' }), { status: 400 });
  }

  try {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        user_id: { S: userId }, // Partition key
        preferences: { SS: preferences }, // String Set for preferences
      },
    };

    const command = new PutItemCommand(params);
    await dynamoDbClient.send(command);

    return new Response(JSON.stringify({ message: 'Preferences saved' }), { status: 200 });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return new Response(JSON.stringify({ error: 'Could not save preferences' }), { status: 500 });
  }
});

// Handle the GET request to retrieve preferences
export const GET = withApiAuthRequired(async (req) => {
  const session = await getSession(req);

  if (!session) {
    return new Response(JSON.stringify({ error: 'User is not authenticated' }), { status: 401 });
  }

  const userId = session.user.sub;

  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { user_id: { S: userId } }, // Using user_id as the key to fetch preferences
    };

    const command = new GetItemCommand(params);
    const result = await dynamoDbClient.send(command); // Fetching the item from DynamoDB

    // Check if the item exists
    if (result.Item) {
      const preferences = result.Item.preferences.SS || []; // Fetch preferences as an array
      return new Response(JSON.stringify({ preferences }), { status: 200 });
    } else {
      // Return empty array if preferences do not exist
      return new Response(JSON.stringify({ preferences: [] }), { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return new Response(JSON.stringify({ error: 'Could not fetch preferences' }), { status: 500 });
  }
});
