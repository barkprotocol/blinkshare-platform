import axios from 'axios';
import qs from 'querystring';
import env from '../services/env';

export const discordApi = axios.create({ baseURL: 'https://discord.com/api/v10' });

interface DiscordAccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
}

export async function getDiscordAccessToken(code: string): Promise<DiscordAccessTokenResponse> {
  try {
    const { data } = await discordApi.post(
      '/oauth2/token',
      qs.stringify({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: env.DISCORD_REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return data; // Return the access token response
  } catch (err) {
    console.error(`Error during Discord OAuth token exchange: ${err}`);
    throw new Error('Failed to exchange code for access token');
  }
}

interface DiscordEmbed {
  color: number;
  title: string;
  description: string;
  timestamp: string;
}

export async function sendDiscordLogMessage(channelId: string, title: string, description: string): Promise<void> {
  try {
    const embed: DiscordEmbed = {
      color: 0x61d1aa, // Set embed color
      title,
      description,
      timestamp: new Date().toISOString(),
    };

    await discordApi.post(
      `/channels/${channelId}/messages`,
      { embeds: [embed] },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );
  } catch (err) {
    console.error(`Error sending log message to Discord: ${err}`);
    if (axios.isAxiosError(err)) {
      console.error(`Response error: ${err.response?.data}`);
    }
  }
}
