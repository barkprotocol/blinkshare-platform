import { Client, Intents } from 'discord.js';
import { Client as PgClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Discord client
const discordClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Initialize PostgreSQL client
const pgClient = new PgClient({
  connectionString: process.env.DATABASE_URL,
});

pgClient.connect();

// When the bot is ready
discordClient.once('ready', () => {
  console.log(`Logged in as ${discordClient.user?.tag}`);
});

// When the bot joins a new guild (server)
discordClient.on('guildCreate', async (guild) => {
  // Save guild details in the database
  const guildId = guild.id;
  const guildName = guild.name;
  const guildOwnerId = guild.ownerId;

  try {
    const result = await pgClient.query(
      'INSERT INTO guilds (guild_id, guild_name, guild_owner_id) VALUES ($1, $2, $3) RETURNING *',
      [guildId, guildName, guildOwnerId]
    );
    console.log('Logged new guild:', result.rows[0]);
  } catch (err) {
    console.error('Error logging new guild:', err);
  }
});

// When the bot receives a message
discordClient.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const command = message.content;

  // Check if command is to create a new Blink
  if (command.startsWith('!createBlink')) {
    const blinkName = command.replace('!createBlink ', '').trim();
    if (blinkName) {
      try {
        const result = await pgClient.query(
          'INSERT INTO blinks (user_id, guild_id, blink_name) VALUES ($1, $2, $3) RETURNING *',
          [userId, message.guild?.id, blinkName]
        );
        message.reply(`Your Blink named "${blinkName}" has been created successfully!`);
        console.log('Logged new Blink creation:', result.rows[0]);
      } catch (err) {
        console.error('Error creating Blink:', err);
        message.reply('There was an error creating your Blink.');
      }
    } else {
      message.reply('Please provide a name for your Blink.');
    }
  }
});

// Log in to Discord
discordClient.login(process.env.DISCORD_TOKEN);
