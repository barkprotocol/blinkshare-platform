import { InteractionReplyOptions, EmbedBuilder } from 'discord.js';

export async function info(): Promise<InteractionReplyOptions> {
  const embed = new EmbedBuilder()
    .setColor('#DBCFC7')
    .setTitle('blinkshare Bot Information')
    .setDescription(
      `**With the blinkshare Bot, you can:**
- Manage your SOL wallet
- Purchase Discord roles using SOL
- Execute transactions on the Solana blockchain
- Unfurl blinks and handle action chaining

**Commands:**
- \`/info\`: Display this information message
- \`/start\`: Initialize your wallet and get your SOL balance
- \`/whitelisted-domains\`: View and manage whitelisted domains (admins only)

**How to Unfurl Blinks:**
Any URL which is a blink can be posted to any chatroom on your Discord server. When posted, the bot will automatically unfurl the blink and display all available actions.
If you want to learn more about blinks and how they work, view our [Blinks docs page](https://docs.blinkshare.fun/solana-actions-and-blinks)

Example blink URL to buy $BARK in Discord, post this on any channel to test out how blink unfurling works: https://jup.ag/swap/SOL-BARK

For more information, visit our [documentation](https://docs.blinkshare.fun).`,
    )
    .setThumbnail('https://blinkshare.com/images/logo.png');

  return { embeds: [embed] };
}
