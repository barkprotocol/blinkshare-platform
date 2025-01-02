import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getAllGuilds, saveNewAccessToken as saveAccessToken } from '../database/database';
import env from '../services/env';
import { discordApi, getDiscordAccessToken } from '../services/oauth';
import { AccessToken } from '../database/entities/access-token';
import { encryptText, decryptText } from '../services/encrypt';

export const loginRouter = express.Router();

/**
 * Returns a Discord OAuth URL for logging in
 * @param {boolean} owner - If the login is done by a server owner or member, based on client-side context. Leave empty if not owner.
 * If it is an owner, the login scope is guilds, for members it is guilds.join
 * @returns { url: string }
 */
loginRouter.get('/', (req: Request, res: Response) => {
  const clientId = env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(env.DISCORD_REDIRECT_URI);
  const isJoin = req.query.owner ? '' : '.join';
  return res.json({
    url: `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify+guilds${isJoin}`,
  });
});

/**
 * Refreshes the access token using the refresh token
 * @param {string} refreshToken - The refresh token obtained during OAuth
 * @returns {Promise<string>} - The new access token
 */
const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const response = await discordApi.post('/oauth2/token', null, {
    params: {
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
  });
  return response.data.access_token;
};

/**
 * Callback after an owner has logged in. Returns a JWT token with the user's id, username, and guild IDs they are owner/admin of
 * @param {string} code - Query param with OAuth grant code provided after completing discord OAuth flow
 * @returns { token: string, userId: string, username: string, guilds: Guild[]}
 */
loginRouter.get('/callback', async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const { access_token, refresh_token, expires_in } = await getDiscordAccessToken(code);

    console.info(`Login access token obtained, fetching user profile and guild data...`);

    const { data: user } = await discordApi.get('/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Save the access token along with the refresh token for future use
    const expiresAt = new Date(Date.now() + expires_in * 1000);
    await saveAccessToken(
      new AccessToken({
        discordUserId: user.id,
        code,
        token: encryptText(access_token),
        refreshToken: encryptText(refresh_token),
        expiresAt,
      }),
    );

    if (!req.query.owner) {
      // No need to return response, redirect user to blink page
      return res.redirect('/blink'); // Or any page you want to redirect the user to
    }

    // Fetch the user's guilds
    const getGuilds = async (Authorization: string) => {
      const { data: guilds } = await discordApi.get('/users/@me/guilds', {
        headers: { Authorization },
      });
      return guilds;
    };

    // Guilds where the user is a member/owner
    const userGuilds = await getGuilds(`Bearer ${access_token}`);
    // Guilds the bot was invited into
    const botGuilds = await getGuilds(`Bot ${env.DISCORD_BOT_TOKEN}`);

    // Filter guilds where the user is the owner or admin
    const ownerOrAdminGuilds = userGuilds.filter((guild: any) => guild.owner || (guild.permissions & 0x8) === 0x8);
    const guildIds = ownerOrAdminGuilds.map((guild: any) => guild.id);

    console.info(`Successfully fetched user guilds, ${ownerOrAdminGuilds.length} in total.`);

    // Generate a JWT token for authentication
    const userId = user.id;
    const username = user.username;
    const token = jwt.sign({ userId, username, guildIds }, env.JWT_SECRET, { expiresIn: '1d' });

    const allGuilds = await getAllGuilds();

    // Return the token, user data and filtered guilds with info if bot is in and if created in DB
    return res.json({
      token,
      userId,
      username,
      guilds: ownerOrAdminGuilds.map(({ id, name, icon }) => ({
        id,
        name,
        image: icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png` : null,
        hasBot: botGuilds.some((g) => g.id === id),
        created: allGuilds.some((g) => g.id === id),
      })),
    });
  } catch (err) {
    const error = `Error during OAuth callback: ${err instanceof Error ? err.message : err}`;
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
