import { schedule } from 'node-cron';
import { discordApi, sendDiscordLogMessage } from '../services/oauth';
import env from '../services/env';
import { getAllRolesForUser as getUserRolePurchases, getExpiringRoles, initializeDatabase } from '../database/database';

// Cron job to run every hour
schedule(
  '0 * * * *',
  async () => {
    if (env.NODE_ENV === 'development') return;

    try {
      console.info('Cron job started: Checking for expiring roles');

      // Initialize the database connection
      await initializeDatabase();

      // Fetch expiring roles from the database
      const expiringRoles = await getExpiringRoles();

      console.info(`Total expiring roles: ${expiringRoles.length}`);

      // Ensure expiring roles are unique by guild.id, role.id, and discordUserId
      const uniqueExpiringRoles = expiringRoles
        .reduce((acc, rolePurchase) => {
          const key = `${rolePurchase.guild.id}-${rolePurchase.role.id}-${rolePurchase.discordUserId}`;
          if (!acc.has(key)) {
            acc.set(key, rolePurchase);
          }
          return acc;
        }, new Map())
        .values();

      // Get current time
      const now = new Date();

      // Iterate over each unique expiring role
      await Promise.all(
        [...uniqueExpiringRoles].map(async (rolePurchase) => {
          const {
            discordUserId,
            guild: { id: guildId, name: guildName },
            role: { id: roleId, name: roleName },
            expiresAt,
          } = rolePurchase;

          // Fetch role purchases for the user in the specified guild and role
          const userRolePurchases = await getUserRolePurchases(discordUserId, guildId, roleId);

          // If the user has renewed the role, skip
          if (userRolePurchases.length > 1 && userRolePurchases.some((role) => new Date(role.expiresAt) > expiresAt)) {
            console.info(`User ${discordUserId} has renewed the role ${roleName} on guild ${guildName}, skipping`);
            return;
          }

          // Calculate the hours remaining until expiration
          const hoursUntilExpiration = Math.floor((new Date(expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60));

          // Send a reminder if the role is expiring in 3 days or 1 day
          if (hoursUntilExpiration === 3 * 24 || hoursUntilExpiration === 24) {
            await sendDiscordMessage(
              discordUserId,
              `**Reminder**: Your role **${roleName}** on the server **${guildName}** will expire in ${hoursUntilExpiration / 24} ${hoursUntilExpiration / 24 === 1 ? 'day' : 'days'}. \nRenew it on <https://blinkshare.fun/${guildId}>`,
            );
          } else if (hoursUntilExpiration === 0) {
            // Remove the role if it has expired
            try {
              await discordApi.delete(`/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`, {
                headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
              });
              console.info(`Removed role ${roleId} from user ${discordUserId}`);
            } catch (error) {
              console.error(`Failed to remove role ${roleId} from user ${discordUserId}: ${error}`);
            }

            // Notify the user that their role has expired
            await sendDiscordMessage(
              discordUserId,
              `Your role **${roleName}** on the server **${guildName}** has expired. \nRenew it on <https://blinkshare/${guildId}>`,
            );

            // Log the role expiration
            sendDiscordLogMessage(
              '1324299574336290866',
              'Role Expired',
              `**User:** <@${discordUserId}>\n**Role:** ${roleName}\n**Server:** ${guildName}`,
            );
          }
        })
      );

      console.info('Cron job finished: Role expiration checks completed');
    } catch (error) {
      console.error('Error during cron job execution:', error);
    }
  },
  { recoverMissedExecutions: true, runOnInit: true },
);

// Function to send a direct message to a Discord user
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
