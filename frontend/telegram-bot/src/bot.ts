import TelegramBot from 'node-telegram-bot-api';
import { Client as PgClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Telegram bot
const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN as string, { polling: true });

// Initialize PostgreSQL client
const pgClient = new PgClient({
  connectionString: process.env.DATABASE_URL,
});

pgClient.connect();

// When the bot receives a message
telegramBot.on('message', async (msg) => {
  const userId = msg.from?.id;
  const command = msg.text;

  // Log command interaction in the database
  try {
    const result = await pgClient.query(
      'INSERT INTO telegram_bot_interactions (user_id, command, response, telegram_chat_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, command, 'Command received', msg.chat.id]
    );
    console.log('Logged Telegram interaction:', result.rows[0]);
  } catch (err) {
    console.error('Error logging interaction:', err);
  }

  // Respond to the /createBlink command
  if (command?.startsWith('/createBlink')) {
    const blinkName = command.replace('/createBlink ', '').trim();
    if (blinkName) {
      try {
        const result = await pgClient.query(
          'INSERT INTO blinks (user_id, guild_id, blink_name) VALUES ($1, $2, $3) RETURNING *',
          [userId, msg.chat.id.toString(), blinkName] // Telegram chat_id is used as guild_id
        );
        telegramBot.sendMessage(msg.chat.id, `Your Blink named "${blinkName}" has been created successfully!`);
        console.log('Logged new Blink creation:', result.rows[0]);
      } catch (err) {
        console.error('Error creating Blink:', err);
        telegramBot.sendMessage(msg.chat.id, 'There was an error creating your Blink.');
      }
    } else {
      telegramBot.sendMessage(msg.chat.id, 'Please provide a name for your Blink.');
    }
  }
});

// Respond to /start command
telegramBot.onText(/\/start/, (msg) => {
  telegramBot.sendMessage(msg.chat.id, 'Welcome to BlinkShare!');
});
