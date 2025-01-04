import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

// Default GET handler
export const GET = async () => {
  // Check if the environment variable is defined
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!apiBaseUrl) {
    return new Response(
      JSON.stringify({ error: 'API Base URL is not defined in environment variables.' }),
      { status: 500, headers: ACTIONS_CORS_HEADERS }
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
