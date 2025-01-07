import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

// Default GET handler
export const GET = async () => {
  // Check if the environment variable is defined
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!apiBaseUrl) {
    console.error("API Base URL is not defined in environment variables.");
    return new Response(
      JSON.stringify({ error: 'API Base URL is not defined in environment variables.' }),
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }

  // Optionally validate the API base URL format
  try {
    new URL(apiBaseUrl); // Will throw if invalid
  } catch (error) {
    console.error("Invalid API Base URL format:", apiBaseUrl);
    return new Response(
      JSON.stringify({ error: 'API Base URL is invalid.' }),
      { status: 400, headers: ACTIONS_CORS_HEADERS }
    );
  }

  // Prepare the payload with dynamic API base URL
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/**",
        apiPath: `${apiBaseUrl}/blinks/**`,
      },
    ],
  };

  // Return the JSON response with CORS headers
  return new Response(JSON.stringify(payload), { headers: ACTIONS_CORS_HEADERS });
};

// Reuse GET handler for OPTIONS request
export const OPTIONS = GET;
