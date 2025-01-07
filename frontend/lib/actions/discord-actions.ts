import { useUserStore } from "@/lib/contexts/zustand/user-store";
import { DiscordRole } from "@/lib/types/discord-role";

// Utility to retrieve the token
const getToken = (): string | null => {
  const token = useUserStore.getState().token;
  
  // Check if token is a valid string, otherwise return null
  if (typeof token === 'string' && token) {
    return token;
  }

  // Fallback to retrieving token from localStorage if it's not available in the store
  if (typeof window !== "undefined") {
    return localStorage.getItem("discordToken");
  }

  return null;
};

// Fetch roles for a given guild
export const fetchRoles = async (
  guildId: string
): Promise<{ roles: DiscordRole[]; blinkShareRolePosition: number }> => {
  const token = getToken();

  if (!token) {
    console.error("No authorization token found.");
    return { roles: [], blinkShareRolePosition: -1 };
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error("API base URL is missing.");
    return { roles: [], blinkShareRolePosition: -1 };
  }

  try {
    const response = await fetch(
      `${apiBaseUrl}/discord/guilds/${guildId}/roles`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch roles for guild ${guildId}: ${response.status} - ${response.statusText}`,
        errorText
      );
      return { roles: [], blinkShareRolePosition: -1 };
    }

    const data = await response.json();

    if (!Array.isArray(data.roles)) {
      console.error("Invalid response format: 'roles' is not an array.");
      return { roles: [], blinkShareRolePosition: -1 };
    }

    return {
      roles: data.roles,
      blinkShareRolePosition: data.blinkShareRolePosition ?? -1,
    };
  } catch (error) {
    console.error(`Error fetching roles for guild ${guildId}`, error);
    return { roles: [], blinkShareRolePosition: -1 };
  }
};

// Create an embedded wallet for a Discord user
export const createEmbeddedWallet = async (
  accessToken: string,
  discordUserId: string,
  address: string
): Promise<{ success: boolean; error?: string }> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error("API base URL is missing.");
    return { success: false, error: "API base URL is not configured." };
  }

  try {
    const payload = { discordUserId, address };
    const response = await fetch(
      `${apiBaseUrl}/discord/embedded-wallet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Failed to create embedded wallet: ${response.status} - ${response.statusText}`,
        errorData
      );
      return { success: false, error: errorData.error || "Unknown error occurred." };
    }

    return { success: true };
  } catch (error) {
    console.error(`Error creating embedded wallet`, error);
    return { success: false, error: `${error}` };
  }
};
