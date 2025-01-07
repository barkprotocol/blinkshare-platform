export const fetchGuildData = async (serverId: string, token: string) => {
    const guildResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const channelsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverId}/channels`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
    const guild = await guildResponse.json();
    const channels = await channelsResponse.json();
  
    return { guild, channels };
  };
  