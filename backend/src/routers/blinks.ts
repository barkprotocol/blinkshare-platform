import express, { Request, Response } from 'express';
import { Action } from '@solana/actions-spec';
import { generateSendTransaction, isTxConfirmed } from '../services/transaction';
import env from '../services/env';
import { findAccessTokenByCode, findGuildById, saveRolePurchase } from '../database/database';
import { discordApi, sendDiscordLogMessage } from '../services/oauth';
import { createPostResponse } from '@solana/actions';
import { BlinksightsClient } from 'blinksights-sdk';
import { decryptText } from '../services/encrypt';
import { RolePurchase } from '../database/entities/role-purchase';

export const blinksRouter = express.Router();

const BASE_URL = env.APP_BASE_URL;
const blinkSights = new BlinksightsClient(env.BLINKSIGHTS_API_KEY);

const generalAction = {
  title: 'Use BlinkShare',
  label: 'Go to blinkshare.fun',
  type: 'action',
  links: {
    actions: [
      {
        type: 'external-link',
        href: `${BASE_URL}/blinks/link`,
        label: 'Go to blinkshare.fun',
      },
    ],
  },
  icon: `https://blinkshare.fun/images/banner_square.png`,
  description: 'Create shareable links that enable Solana interactions directly within your Discord Server',
  error: { message: 'Go to blinkshare.fun to get started' },
} as Action<'action'>;

blinksRouter.post('/link/:serverId?', (req: Request, res: Response) => {
  const { serverId } = req.params;
  const externalLink = serverId ? `https://blinkshare.fun/${serverId}` : 'https://blinkshare.fun';
  res.json({
    type: 'external-link',
    externalLink,
  });
});

blinksRouter.get('/', (req: Request, res: Response) => res.json(generalAction));

blinksRouter.get('/:guildId', async (req: Request, res: Response) => {
  const { guildId } = req.params;

  // Validate the guildId format
  if (!/^\d{17,19}$/.test(guildId)) {
    return res.json(generalAction);
  }

  const guild = await findGuildById(guildId);
  if (!guild) {
    return res.json({
      type: 'completed',
      links: { actions: [] },
      title: 'Not found',
      icon: 'https://agentestudio.com/uploads/post/image/69/main_how_to_design_404_page.png',
      description: 'Discord server not found',
    });
  }

  console.info(`Sending action for guild ${guildId}`);

  const { code, showRoles } = req.query;

  const guildBlinkData = {
    title: guild.name,
    description: `${guild.description}${guild.website ? `\n\n Website: ${guild.website}` : ''}${guild.limitedTimeRoles ? `\n\n Roles are valid for ${guild.limitedTimeQuantity} ${guild.limitedTimeUnit}` : ''}`,
    icon: guild.iconUrl,
  };

  if (!code && !showRoles) {
    return res.json({
      ...guildBlinkData,
      label: `Go to blinkshare.fun`,
      type: 'action',
      links: {
        actions: [
          {
            type: 'external-link',
            href: `${BASE_URL}/blinks/link/${guildId}`,
            label: `Go to blinkshare.fun`,
          },
        ],
      },
    } as Action<'action'>);
  }

  const payload: Action<'action'> = {
    type: 'action',
    label: null,
    ...guildBlinkData,
    disabled: !code,
    links: {
      actions: guild.roles.map(({ id, name, amount }) => ({
        type: 'post',
        label: `${name} (${amount} ${guild.useUsdc ? 'USDC' : 'SOL'})`,
        href: `${BASE_URL}/blinks/${guildId}/buy?roleId=${id}&code=${code}`,
      })),
    },
  };

  try {
    const response = await blinkSights.createActionGetResponseV1(req.url, payload);
    return res.json(response);
  } catch (error) {
    console.error(`Error generating response for guild ${guildId}:`, error);
    return res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

blinksRouter.post('/:guildId/buy', async (req: Request, res: Response) => {
  const { code, roleId } = req.query as { code: string; roleId: string };
  const { guildId } = req.params;

  if (!guildId || !roleId || !code) {
    return res.status(400).json({
      error: `Invalid role purchase data: guildId=${guildId}, roleId=${roleId}`,
    });
  }

  const guild = await findGuildById(guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });

  const role = guild.roles.find((r) => r.id === roleId);
  if (!role) return res.status(404).json({ error: 'Role not found' });

  const { account, isDiscordBot } = req.body;

  if (!isDiscordBot) {
    const accessToken = await findAccessTokenByCode(code);
    if (!accessToken) return res.status(403).json({ error: 'Unauthorized: access_token not found.' });
  }

  console.info(`Generating transaction for guild ${guildId} and role ${roleId}`);
  try {
    const trackingInstruction = await blinkSights.getActionIdentityInstructionV2(account, req.url);
    const transaction = await generateSendTransaction(account, role.amount, guild, trackingInstruction);

    // Run in async, no need to await
    blinkSights.trackActionV2(account, req.url);

    return res.json(
      await createPostResponse({
        fields: {
          type: 'transaction',
          transaction,
          message: `Buy role ${role.name} for ${role.amount} ${guild.useUsdc ? 'USDC' : 'SOL'}`,
          links: {
            next: {
              type: 'post',
              href: `${BASE_URL}/blinks/${guildId}/confirm?roleId=${role.id}&code=${code}`,
            },
          },
        },
      }),
    );
  } catch (error) {
    console.error('Error generating transaction:', error);
    return res.status(400).send({ message: 'Error generating transaction' });
  }
});

blinksRouter.post('/:guildId/confirm', async (req: Request, res: Response) => {
  const { code, roleId } = req.query as { code: string; roleId: string };
  const { guildId } = req.params;

  if (!guildId || !roleId || !code) {
    return res.status(400).json({
      error: `Invalid role purchase data: guildId=${guildId}, roleId=${roleId}`,
    });
  }

  const guild = await findGuildById(guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });

  const role = guild.roles.find((r) => r.id === roleId);
  if (!role) return res.status(404).json({ error: 'Role not found' });

  const signature = req.body.signature;
  if (!(await isTxConfirmed(signature))) {
    return res.status(403).json({
      error: `Transaction ${signature} was not confirmed`,
    });
  }

  try {
    const { token } = await findAccessTokenByCode(code);
    const access_token = decryptText(token);
    console.info(`Guild join access token obtained, adding member to the server with roles...`);

    const { data: user } = await discordApi.get('/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    await discordApi.put(
      `/guilds/${guildId}/members/${user.id}`,
      { access_token, roles: [roleId] },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );

    console.info(`Successfully added user ${user.username} to guild ${guild.name} with role ${role.name}`);

    const rolePurchase = new RolePurchase({ discordUserId: user.id, guild, role, signature }).setExpiresAt();
    await saveRolePurchase(rolePurchase);

    sendDiscordLogMessage(
      '1324299574336290866',
      'Role Purchase',
      `**User:** <@${user.id}>\n**Role:** ${role.name}\n**Server:** ${guild.name}`,
    ).catch((err) => console.error(`Error sending role purchase log message: ${err}`));

    if (guild.notificationChannelId) {
      sendDiscordLogMessage(
        guild.notificationChannelId,
        'Role Purchase',
        `**User:** <@${user.id}>\n**Role:** ${role.name}\n**Server:** ${guild.name}`,
      ).catch((err) => console.error(`Error sending role purchase log message to notification channel: ${err}`));
    }

    return res.json({
      title: guild.name,
      icon: guild.iconUrl,
      description: `https://solscan.io/tx/${signature}`,
      label: `Role ${role.name} obtained`,
      type: 'completed',
    });
  } catch (error) {
    console.error('Error while adding member to guild:', error);
    res.json({
      title: guild.name,
      icon: guild.iconUrl,
      description: `https://solscan.io/tx/${signature}`,
      label: null,
      type: 'completed',
      error: {
        message: `An error occurred. Contact the server owner and present the transaction in the description`,
      },
    });
  }
});
