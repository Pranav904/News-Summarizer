import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

// Auth0 Management API configuration
const domain = process.env.AUTH0_ISSUER_BASE_URL.replace('https://', '');
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;

// Helper function to get Auth0 Management API token
async function getManagementApiToken() {
  try {
    const response = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: `https://${domain}/api/v2/`,
        grant_type: 'client_credentials',
        // Add required scopes for user operations
        scope: 'read:users update:users'
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(e => 'Unable to read error response');
      console.error('Failed to get Auth0 token:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json().catch(error => {
      console.error('Failed to parse token response:', error);
      throw error;
    });
    
    return data.access_token;
  } catch (error) {
    console.error('Error in getManagementApiToken:', error);
    throw error;
  }
}

// Handle the POST request to save preferences
export const POST = withApiAuthRequired(async (req) => {
  try {
    const session = await getSession(req);

    if (!session) {
      console.warn('POST /api/preferences: No session found');
      return new Response(JSON.stringify({ error: 'User is not authenticated' }), { status: 401 });
    }

    const userId = session.user.sub;
    
    const body = await req.json().catch(error => {
      console.error('POST /api/preferences: Failed to parse request body:', error);
      throw new Error('Invalid JSON in request body');
    });
    
    const { preferences } = body;

    if (!Array.isArray(preferences)) {
      return new Response(JSON.stringify({ error: 'Preferences must be an array' }), { status: 400 });
    }

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
      const errorData = await response.text().catch(e => 'Unable to read error response');
      console.error('POST /api/preferences: Auth0 API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorData
      });
      throw new Error(`Auth0 API error: ${response.status} ${response.statusText}`);
    }

    return new Response(JSON.stringify({ message: 'Preferences saved' }), { status: 200 });
  } catch (error) {
    console.error('POST /api/preferences: Error saving preferences:', {
      message: error.message,
      stack: error.stack
    });
    return new Response(JSON.stringify({ error: 'Could not save preferences' }), { status: 500 });
  }
});

// Handle the GET request to retrieve preferences
export const GET = withApiAuthRequired(async (req) => {
  try {
    const session = await getSession(req);

    if (!session) {
      console.warn('GET /api/preferences: No session found');
      return new Response(JSON.stringify({ error: 'User is not authenticated' }), { status: 401 });
    }

    const userId = session.user.sub;
    
    // Use encoded user ID in the request URL
    const encodedUserId = encodeURIComponent(userId);
    const userUrl = `https://${domain}/api/v2/users/${encodedUserId}?fields=user_metadata`;

    // Get Auth0 Management API token
    const token = await getManagementApiToken();
    
    // Fetch user data including metadata
    const response = await fetch(userUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(e => 'Unable to read error response');
      console.error('GET /api/preferences: Auth0 API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Auth0 API error: ${response.status} ${response.statusText}`);
    }

    try {
      const userData = await response.json();
      
      const preferences = userData.user_metadata?.preferences || [];

      return new Response(JSON.stringify({ preferences }), { status: 200 });
    } catch (parseError) {
      console.error('GET /api/preferences: Error parsing response JSON:', {
        message: parseError.message,
        stack: parseError.stack
      });
      
      // Try to get the raw response to help debug
      const rawResponse = await response.text().catch(e => 'Could not read response body');
      console.error('GET /api/preferences: Raw response body:', rawResponse);
      
      throw new Error(`Failed to parse Auth0 API response: ${parseError.message}`);
    }
  } catch (error) {
    console.error('GET /api/preferences: Error fetching preferences:', {
      message: error.message,
      stack: error.stack
    });
    return new Response(JSON.stringify({ error: 'Could not fetch preferences' }), { status: 500 });
  }
});
