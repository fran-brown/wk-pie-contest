// This is server-side Node.js code
exports.handler = async (event, context) => {
  
  // Get the secret API key from an environment variable
  const apiKey = process.env.GIVEBUTTER_API_KEY;
  const campaignId = '516562'; // Your campaign ID
  
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is not set in Netlify." })
    };
  }

  let allTeams = [];
  // Start with the first page of the API endpoint
  let nextUrl = `https://api.givebutter.com/v1/campaigns/${campaignId}/teams`;
  
  try {
    // Loop to get all pages of data (handles pagination)
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Givebutter API Error (${response.status}): ${errorText}`);
      }

      const pageData = await response.json();
      allTeams = allTeams.concat(pageData.data);
      // Get the URL for the next page, if it exists
      nextUrl = pageData.links ? pageData.links.next : null;
    }

    // Success! Return all teams to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ data: allTeams })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};