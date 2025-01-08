import { schedule } from 'node-cron';
import { discordApi, sendDiscordLogMessage } from '../services/oauth';
import env from '../services/env';
import { getAllRolesForUser as getUserRolePurchases, getExpiringRoles, initializeDatabase } from '../database/database';

/**
 * Cron job that runs every hour to check and manage expired roles.
 */
schedule(
  '0 * * * *',
  async () => {
    // Skip execution in development environment
    if (env.NODE_ENV === 'production') return;

    // Initialize the database
    await initializeDatabase();

    // Fetch the list of expiring roles
    const expiringRoles = await getExpiringRoles();

    // Ensure uniqueness by combining guild.id, role.id, and discordUserId
    const uniqueExpiringRoles = expiringRoles
      .reduce((acc, rolePurchase) => {
        const key = `${rolePurchase.guild.id}-${rolePurchase.role.id}-${rolePurchase.discordUserId}`;
        if (!acc.has(key)) {
          acc.set(key, rolePurchase);
        }
        return acc;
      }, new Map())
      .values();

    console.info(`Total expiring roles: ${expiringRoles.length}`);

    // Get current date/time
    const now = new Date();

    // Iterate over each unique expiring role
    for (const rolePurchase of uniqueExpiringRoles) {
      const {
        discordUserId,
        guild: { id: guildId, name: guildName },
        role: { id: roleId, name: roleName },
        expiresAt,
      } = rolePurchase;

      // Fetch user's role purchases for the specific guild and role
      const userRolePurchases = await getUserRolePurchases(discordUserId, guildId, roleId);

      // Skip if the user has renewed the role
      if (userRolePurchases.length > 1 && userRolePurchases.some((role) => new Date(role.expiresAt) > expiresAt)) {
        console.info(`User ${discordUserId} has renewed the role ${roleName} on guild ${guildName}, skipping`);
        continue;
      }

      // Calculate hours until expiration
      const hoursUntilExpiration = Math.floor((new Date(expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60));

      // Send a reminder if the role is expiring in 3 days or 1 day
      if (hoursUntilExpiration === 3 * 24 || hoursUntilExpiration === 24) {
        await sendDiscordMessage(
          discordUserId,
          `**Reminder**: Your role **${roleName}** on the server **${guildName}** will expire in ${hoursUntilExpiration / 24} ${hoursUntilExpiration / 24 === 1 ? 'day' : 'days'}. \nRenew it on <https://blinkshare.fun/${guildId}>`,
        );
      } else if (hoursUntilExpiration === 0) {
        // If the role has expired, remove it from the user
        await discordApi
          .delete(`/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`, {
            headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
          })
          .then(() => console.info(`Removed role ${roleId} from user ${discordUserId}`))
          .catch((error) => console.error(`Failed to remove role ${roleId} from user ${discordUserId}: ${error}`));

        // Send a notification that the role has expired
        await sendDiscordMessage(
          discordUserId,
          `Your role **${roleName}** on the server **${guildName}** has expired. \nRenew it on <https://blinkshare.fun/${guildId}>`,
        );

        // Log the role expiration event
        sendDiscordLogMessage(
          '1324299574336290866',
          'Role Expired',
          `**User:** <@${discordUserId}>\n**Role:** ${roleName}\n**Server:** ${guildName}`,
        );
      }
    }
  },
  { recoverMissedExecutions: true, runOnInit: true },
);

/**
 * Function to send a direct message to a Discord user.
 */
const sendDiscordMessage = async (discordUserId: string, content: string) => {
  try {
    // Create a new DM channel for the user
    const { data: dmChannel } = await discordApi.post(
      `/users/@me/channels`,
      { recipient_id: discordUserId },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );

    // Send the message to the newly created channel
    await discordApi.post(
      `/channels/${dmChannel.id}/messages`,
      { embeds: [{ description: content, color: 0x61d1aa }] },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );
  } catch (error) {
    console.error(`Failed to send message to user ${discordUserId}: ${error}`);
  }
};
