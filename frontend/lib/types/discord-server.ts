// Interface for the Discord server configuration
export interface DiscordServer {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

// Function to generate the Discord OAuth login URL
export const GetDiscordLoginUrl = (discordServer: DiscordServer): string => {
    // Base URL for Discord OAuth2 authorization
    const baseUrl = "https://discord.com/oauth2/authorize";
    
    // Construct URLSearchParams to include query parameters
    const params = new URLSearchParams({
        client_id: discordServer.clientId,
        redirect_uri: discordServer.redirectUri,
        response_type: "code",
        scope: "identify email", // Modify scope as needed for additional permissions
        state: generateRandomState(), // A random state for CSRF protection (Optional but recommended)
    });

    return `${baseUrl}?${params.toString()}`;
};

// Helper function to generate a random state for CSRF protection
const generateRandomState = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Function to handle the Discord callback after OAuth login
export const HandleDiscordCallback = async (code: string, discordServer: DiscordServer) => {
    const tokenUrl = "https://discord.com/api/oauth2/token";
    
    // Prepare the data to exchange the authorization code for an access token
    const data = new URLSearchParams({
        client_id: discordServer.clientId,
        client_secret: discordServer.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: discordServer.redirectUri,
    });

    try {
        // Send a POST request to Discord's token endpoint
        const response = await fetch(tokenUrl, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        // Check if the response was successful
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Discord OAuth2 callback failed: ${errorDetails.error_description || "Unknown error"}`);
        }

        // Extract the access token from the response
        const { access_token } = await response.json();

        return access_token;
    } catch (error) {
        console.error("Error during Discord OAuth callback:", error);
        throw error;
    }
};
