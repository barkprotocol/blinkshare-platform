import { useUserStore } from "@/lib/contexts/zustand/user-store";
import { DiscordRole } from "@/lib/types";

interface RolesResponse {
  roles: DiscordRole[];
  blinkShareRolePosition: number;
  [key: string]: any;
}

// Fetch roles for a given guild
export const fetchRoles = async (guildId: string): Promise<RolesResponse> => {
  const token =
    useUserStore.getState().token || localStorage.getItem("discordToken");

  if (!token) {
    console.error("No authorization token found.");
    return { roles: [], blinkShareRolePosition: -1 };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${guildId}/roles`,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RolesResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching roles for guild ${guildId}:`, error);
    return { roles: [], blinkShareRolePosition: -1 };
  }
};

interface EmbeddedWalletResponse {
  success: boolean;
  error?: string;
}

// Create an embedded wallet for a Discord user
export const createEmbeddedWallet = async (
  accessToken: string,
  discordUserId: string,
  address: string
): Promise<EmbeddedWalletResponse> => {
  if (!accessToken || !discordUserId || !address) {
    return { success: false, error: "Missing required parameters" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/embedded-wallet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ discordUserId, address }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`Error creating embedded wallet for user ${discordUserId}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

