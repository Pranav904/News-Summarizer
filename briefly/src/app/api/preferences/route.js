import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

// Auth0 Management API configuration
const domain = process.env.AUTH0_ISSUER_BASE_URL.replace('https://', '');
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;

// Helper function to get Auth0 Management API token
async function getManagementApiToken() {
  const response = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
      grant_type: 'client_credentials'
    })
  });

  const data = await response.json();
  return data.access_token;
}

// Handle the POST request to save preferences
export const POST = withApiAuthRequired(async (req) => {
  const session = await getSession(req);

  if (!session) {
    return new Response(JSON.stringify({ error: 'User is not authenticated' }), { status: 401 });
  }

  const userId = session.user.sub;
  const { preferences } = await req.json();

  console.log('Saving preferences for user:', userId, preferences);

  if (!Array.isArray(preferences)) {
    return new Response(JSON.stringify({ error: 'Preferences must be an array' }), { status: 400 });
  }

  try {
    // Get Auth0 Management API token
    const token = await getManagementApiToken();
    
    // Update user metadata with preferences
    const response = await fetch(`https://${domain}/api/v2/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_metadata: {
          preferences: preferences
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

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

  console.log('Fetching preferences for user:', userId);

  try {
    // Get Auth0 Management API token
    const token = await getManagementApiToken();
    
    // Fetch user data including metadata
    const response = await fetch(`https://${domain}/api/v2/users/${userId}?fields=user_metadata`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const userData = await response.json();
    const preferences = userData.user_metadata?.preferences || [];

    return new Response(JSON.stringify({ preferences }), { status: 200 });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return new Response(JSON.stringify({ error: 'Could not fetch preferences' }), { status: 500 });
  }
});
