-- Create the users table (storing user information)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,        -- Username of the user
  email VARCHAR(255) UNIQUE NOT NULL,           -- Email address for user
  password_hash VARCHAR(255) NOT NULL,          -- Hashed password
  discord_id VARCHAR(255) UNIQUE NOT NULL,      -- Unique Discord ID
  telegram_id VARCHAR(255) UNIQUE NOT NULL,     -- Unique Telegram ID
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when user is created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp for when the user was last updated
);

-- Create the servers table (representing Discord servers)
CREATE TABLE IF NOT EXISTS servers (
  id SERIAL PRIMARY KEY,                      -- Auto-incremented server ID
  name VARCHAR(255) NOT NULL,                  -- Server name
  discord_id VARCHAR(255) UNIQUE NOT NULL,     -- Unique Discord server ID
  user_id INT REFERENCES users(id) ON DELETE CASCADE, -- Link to user (server owner)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when server is created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the server is last updated
);

-- Create guilds table for Discord Guild (server) information
CREATE TABLE IF NOT EXISTS guilds (
    guild_id TEXT PRIMARY KEY,                  -- Unique guild ID
    guild_name TEXT NOT NULL,                   -- Name of the Discord guild
    guild_owner_id TEXT NOT NULL,               -- Owner of the guild (Discord user ID)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the guild was created
);

-- Create airdrop table for tracking airdrop events
CREATE TABLE IF NOT EXISTS airdrops (
  id SERIAL PRIMARY KEY,                      -- Auto-incremented ID for each airdrop event
  blink_id INT REFERENCES blinks(id) ON DELETE CASCADE,  -- Reference to Blink (NFTs or tokens)
  user_id INT REFERENCES users(id) ON DELETE CASCADE,    -- Link to user receiving the airdrop
  amount INT NOT NULL,                        -- Amount of tokens or assets distributed
  status VARCHAR(50) DEFAULT 'pending',       -- Current status of the airdrop (e.g., 'pending', 'completed')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the airdrop event is created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp for when the event was last updated
);

-- Create transactions table for Blink transfers or interactions
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,                      -- Auto-incremented transaction ID
  blink_id INT REFERENCES blinks(id) ON DELETE CASCADE, -- Link to Blink (NFT or token)
  from_user_id INT REFERENCES users(id) ON DELETE CASCADE, -- Sender's user ID
  to_user_id INT REFERENCES users(id) ON DELETE CASCADE,   -- Receiver's user ID
  amount INT NOT NULL,                        -- Amount transferred
  transaction_type VARCHAR(50),               -- Type of transaction (e.g., 'transfer', 'stake')
  status VARCHAR(50) DEFAULT 'pending',       -- Transaction status (e.g., 'pending', 'completed')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the transaction was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp for when the transaction was last updated
);

-- Add table for tracking user roles within servers
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,                      -- Auto-incremented ID for each role assignment
  user_id INT REFERENCES users(id) ON DELETE CASCADE, -- User assigned this role
  server_id INT REFERENCES servers(id) ON DELETE CASCADE, -- Server this role belongs to
  role VARCHAR(50),                           -- Role assigned to the user (e.g., 'admin', 'member')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the role was created
);

-- Create table for tracking Discord bot interactions
CREATE TABLE IF NOT EXISTS discord_bot_interactions (
  id SERIAL PRIMARY KEY,                      -- Auto-incremented interaction ID
  user_id INT REFERENCES users(id) ON DELETE CASCADE, -- User interacting with the bot
  server_id INT REFERENCES servers(id) ON DELETE CASCADE, -- Server where interaction occurred
  command VARCHAR(255) NOT NULL,               -- Command issued by the user
  response TEXT,                              -- Response from the bot
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the interaction occurred
);

-- Create table for tracking Telegram bot interactions
CREATE TABLE IF NOT EXISTS telegram_bot_interactions (
  id SERIAL PRIMARY KEY,                      -- Auto-incremented interaction ID
  user_id INT REFERENCES users(id) ON DELETE CASCADE, -- User interacting with the bot
  command VARCHAR(255) NOT NULL,               -- Command issued by the user
  response TEXT,                              -- Response from the bot
  telegram_chat_id VARCHAR(255) NOT NULL,      -- Telegram chat ID
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the interaction occurred
);

-- Create table for Discord bot events (custom events, like joining server)
CREATE TABLE IF NOT EXISTS discord_bot_events (
  id SERIAL PRIMARY KEY,                      -- Auto-incremented event ID
  event_type VARCHAR(50),                     -- Event type (e.g., 'server_join', 'message_sent')
  server_id INT REFERENCES servers(id) ON DELETE CASCADE, -- Server where event occurred
  user_id INT REFERENCES users(id) ON DELETE CASCADE,   -- User involved in the event
  data JSONB,                                 -- Event-specific data (e.g., message content)
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the event occurred
);

-- Create table for Telegram bot events (custom events, like messages received)
CREATE TABLE IF NOT EXISTS telegram_bot_events (
  id SERIAL PRIMARY KEY,                      -- Auto-incremented event ID
  event_type VARCHAR(50),                     -- Event type (e.g., 'message_received')
  telegram_chat_id VARCHAR(255) NOT NULL,      -- Telegram chat ID
  user_id INT REFERENCES users(id) ON DELETE CASCADE, -- User involved in the event
  data JSONB,                                 -- Event-specific data (e.g., message content)
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the event occurred
);

-- Add table for storing wallet addresses for users (with network info)
CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,                      -- Auto-incremented wallet address ID
  user_id INT REFERENCES users(id) ON DELETE CASCADE, -- User owning this wallet
  wallet_address VARCHAR(255) NOT NULL,        -- Wallet address (e.g., Solana address)
  network VARCHAR(50) DEFAULT 'solana',       -- Network the wallet is associated with (default: Solana)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when wallet address is created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when wallet address is last updated
);
