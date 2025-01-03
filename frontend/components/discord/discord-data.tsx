import React, { useEffect, useState } from 'react';
import { DISCORD_API_BASE_URL } from '@/lib/constants';

const fetchDiscordData = async () => {
  const response = await fetch(`${DISCORD_API_BASE_URL}/discord-endpoint`);
  const data = await response.json();
  return data;
};

const DiscordDataComponent = () => {
  const [discordData, setDiscordData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDiscordData();
      setDiscordData(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      {discordData ? (
        <pre>{JSON.stringify(discordData, null, 2)}</pre>
      ) : (
        <p>Loading Discord data...</p>
      )}
    </div>
  );
};

export default DiscordDataComponent;
