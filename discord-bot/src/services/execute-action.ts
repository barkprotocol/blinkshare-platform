import axios from 'axios';
import { ButtonInteraction, InteractionReplyOptions, ModalSubmitInteraction } from 'discord.js';
import { getUserWallet } from '../database/database';
import { LinkedAction } from '../types/types';
import { executeTransaction } from './solana';
import { addblinkshareRole, createActionEmbed } from './discord';
import { MongoDB } from '../database/mongo';

export async function executeAction(
  interaction: ButtonInteraction | ModalSubmitInteraction,
  action: LinkedAction,
  actionUrl: string,
  mongoDB: MongoDB,
): Promise<InteractionReplyOptions | string> {
  // Get the user's wallet from the database
  const wallet = await getUserWallet(interaction.user.id);
  if (!wallet) return 'No wallet found, run `/start` to get started.';
  // Check if the action is a blinkshare role purchase
  const blinkshareRegex = /^https:\/\/api\.blinkshare\.com\/blinks\/(\d{17,19})\/buy\?roleId=(\d{17,19})/;
  const match = action.href.match(blinkshareRegex);
  const [guildId, roleId] = [match?.[1], match?.[2]];

  try {
    const body = { account: wallet.address } as any;
    if (guildId && roleId) body.isDiscordBot = true;
    const {
      data: { transaction, message, error, links },
    } = await axios.post(action.href, body);

    if (error) return `❌ Error: ${error.message || error}`;

    const signature = transaction ? await executeTransaction(transaction, wallet) : undefined;
    const content = `✅ Success\n${message || ''}\n${signature ? `Transaction: https://solscan.io/tx/${signature}` : ''}`;

    // blinkshare only
    if (guildId && roleId) addblinkshareRole(guildId, roleId, interaction);
    // Handle action chaining
    else if (links?.next) {
      const { type, action: nextAction, href } = links.next;
      if (type === 'inline' && nextAction) {
        return { content, ...createActionEmbed(nextAction, href || actionUrl) };
      } else if (type === 'post' && href) {
        const apiUrl = href.startsWith('http') ? href : `${new URL(actionUrl).origin}${href}`;
        const { data: nextActionData } = await axios.post(apiUrl, { ...body, signature });
        // Add the subsequent action to the cache so it can be fetched from button interaction
        mongoDB.setActionCache(apiUrl, nextActionData);
        return { content, ...createActionEmbed(nextActionData, apiUrl) };
      }
    }

    return content;
  } catch (error: any) {
    if (error?.name === 'TransactionFailedError') return error.message;

    console.error(`Error executing action: ${error}`);
    if (axios.isAxiosError(error)) {
      console.error(`Axios error: ${error.response?.data}`);
      return 'The action returned a server error, please try again';
    }
    return error?.response?.data?.message || error?.response?.data || 'An error occurred, please try again later';
  }
}
