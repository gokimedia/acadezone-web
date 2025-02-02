export default async function handler(req, res) {
  const { code } = req.query;

  // Environment variable validation
  const { NEXT_PUBLIC_LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET } = process.env;
  if (!NEXT_PUBLIC_LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Missing LinkedIn API credentials' });
  }

  try {
    // LinkedIn OAuth Token API call
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/api/linkedin' // Change this for production
      })
    });

    // Handle API errors
    if (!tokenResponse.ok) {
      const errorDetails = await tokenResponse.text();
      console.error('LinkedIn API error:', errorDetails);
      return res.status(tokenResponse.status).json({ error: 'Failed to retrieve access token' });
    }

    const data = await tokenResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Unhandled error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
