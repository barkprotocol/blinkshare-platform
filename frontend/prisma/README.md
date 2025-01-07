The SQL schema defines a comprehensive structure for managing users, interactions, and assets within a system that integrates Discord, Telegram, Blink, and blockchain wallet functionalities. Here's a breakdown of what each table is designed for:

1. **`users`**: Stores user information, including credentials (username, email, password) and external service IDs (Discord, Telegram).
   
2. **`servers`**: Represents Discord servers, each associated with a user who owns it.
   
3. **`guilds`**: Stores information about Discord guilds (servers), including the guild ID, name, and owner ID.
   
4. **`airdrops`**: Tracks airdrop events related to users and Blink (token) transfers, capturing the status and amount of tokens.
   
5. **`transactions`**: Logs Blink token transfers between users, specifying the sender, receiver, transaction type, and status.
   
6. **`user_roles`**: Stores the roles assigned to users in different servers (e.g., Discord roles).
   
7. **`discord_bot_interactions`**: Tracks interactions between users and a Discord bot, including the commands issued and responses given.
   
8. **`telegram_bot_interactions`**: Similar to the Discord interactions table, but for Telegram bot commands and responses.
   
9. **`discord_bot_events`**: Stores events related to Discord bot activities (e.g., server events) with JSON data to represent event-specific information.
   
10. **`telegram_bot_events`**: Similar to `discord_bot_events`, but for Telegram bots, tracking events along with relevant data.
   
11. **`wallets`**: Associates blockchain wallet addresses with users, specifying the network (default is Solana).
