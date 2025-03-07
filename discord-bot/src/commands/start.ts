import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
} from 'discord.js';
import { getOrCreateWallet } from '../database/database';
import { getWalletBalance, getSolPrice } from '../services/solana';
import { getQrCodeUrl } from '../services/discord';

export async function start(interaction: ChatInputCommandInteraction): Promise<InteractionReplyOptions> {
  const wallet = await getOrCreateWallet(interaction.user.id);

  const solBalance = await getWalletBalance(wallet.address);
  const solPrice = await getSolPrice();

  const qrCodeUrl = await getQrCodeUrl(wallet.address, interaction);

  const embed = new EmbedBuilder()
    .setColor('#DBCFC7')
    .setTitle('BlinkShare Bot')
    .setDescription(
      `**YOUR WALLET**
\`\`\`${wallet.address}\`\`\`
**SOL Balance**: ${solBalance} SOL ($${(solBalance * solPrice).toFixed(2)})

**NOTES:**
To deposit SOL into your BlinkShare BOT wallet, copy the wallet address above or scan the QR code, then use your preferred crypto wallet to send SOL to this address. Your balance will update the next time you use the /start command.
  `,
    )
    .setThumbnail(qrCodeUrl);

  const components = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('withdraw').setLabel('Withdraw').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('withdrawAll').setLabel('Withdraw 100%').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('export').setLabel('Export').setStyle(ButtonStyle.Danger),
    ),
  ];

  return { embeds: [embed], components };
}
