import { useUserStore } from "@/lib/contexts/zustand/user-store";
import { DiscordRole } from "@/lib/types";

// Fetch roles for a given guild
export const fetchRoles = async (
  guildId: string
): Promise<{
  [x: string]: number; roles: DiscordRole[]; blinkShareRolePosition: number 
}> => {
  const token =
    useUserStore.getState().token || localStorage.getItem("discordToken");

  if (!token) {
    console.error("No authorization token found.");
    return { roles: [], blinkShareRolePosition: -1 };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${guildId}/roles`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch roles for guild ${guildId}: ${response.statusText}`
      );
      return { roles: [], blinkShareRolePosition: -1 };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching roles for guild ${guildId}:`, error);
    return { roles: [], blinkShareRolePosition: -1 };
  }
};

// Create an embedded wallet for a Discord user
export const createEmbeddedWallet = async (
  accessToken: string,
  discordUserId: string,
  address: string
): Promise<{ success: boolean; error?: string }> => {
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
      console.error(
        `Failed to create embedded wallet for user ${discordUserId}: ${response.statusText}`,
        errorData
      );
      return { success: false, error: errorData.error };
    }

    return { success: true };
  } catch (error) {
    console.error(`Error creating embedded wallet for user ${discordUserId}:`, error);
    return { success: false, error: `${error}` };
  }
};
