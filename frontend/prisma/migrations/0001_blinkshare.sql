-- blinkshare.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION table_exists(tbl text) RETURNS boolean AS $$
DECLARE
  exists boolean;
BEGIN
  SELECT count(*) > 0 INTO exists
  FROM information_schema.tables
  WHERE table_name = tbl;
  RETURN exists;
END;
$$ LANGUAGE plpgsql;

-- Uncomment the following lines if you want to drop existing tables (USE WITH CAUTION!)
/*
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS telegram_bot_events;
DROP TABLE IF EXISTS discord_bot_events;
DROP TABLE IF EXISTS telegram_bot_interactions;
DROP TABLE IF EXISTS discord_bot_interactions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS airdrops;
DROP TABLE IF EXISTS guilds;
DROP TABLE IF EXISTS servers;
DROP TABLE IF EXISTS users;
*/

-- Users table
DO $$
BEGIN
  IF NOT table_exists('users') THEN
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      discord_id VARCHAR(255) UNIQUE,
      telegram_id VARCHAR(255) UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  END IF;
END $$;

-- Servers table
DO $$
BEGIN
  IF NOT table_exists('servers') THEN
    CREATE TABLE servers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      discord_id VARCHAR(255) UNIQUE NOT NULL,
      user_id UUID NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  END IF;
END $$;

-- Guilds table
DO $$
BEGIN
  IF NOT table_exists('guilds') THEN
    CREATE TABLE guilds (
      guild_id VARCHAR(255) PRIMARY KEY,
      guild_name VARCHAR(255) NOT NULL,
      guild_owner_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  END IF;
END $$;

-- Airdrops table
DO $$
BEGIN
  IF NOT table_exists('airdrops') THEN
    CREATE TABLE airdrops (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      blink_id VARCHAR(255) NOT NULL,
      user_id UUID NOT NULL,
      amount INTEGER NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  END IF;
END $$;

-- Transactions table
DO $$
BEGIN
  IF NOT table_exists('transactions') THEN
    CREATE TABLE transactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      blink_id VARCHAR(255) NOT NULL,
      from_user_id UUID NOT NULL,
      to_user_id UUID NOT NULL,
      amount INTEGER NOT NULL,
      transaction_type VARCHAR(50),
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (from_user_id) REFERENCES users(id),
      FOREIGN KEY (to_user_id) REFERENCES users(id)
    );
  END IF;
END $$;

-- UserRoles table
DO $$
BEGIN
  IF NOT table_exists('user_roles') THEN
    CREATE TABLE user_roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      server_id UUID NOT NULL,
      role VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (server_id) REFERENCES servers(id),
      UNIQUE (user_id, server_id, role)
    );
  END IF;
END $$;

-- DiscordBotInteractions table
DO $$
BEGIN
  IF NOT table_exists('discord_bot_interactions') THEN
    CREATE TABLE discord_bot_interactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      server_id UUID NOT NULL,
      command VARCHAR(255) NOT NULL,
      response TEXT,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (server_id) REFERENCES servers(id)
    );
  END IF;
END $$;

-- TelegramBotInteractions table
DO $$
BEGIN
  IF NOT table_exists('telegram_bot_interactions') THEN
    CREATE TABLE telegram_bot_interactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      command VARCHAR(255) NOT NULL,
      response TEXT,
      telegram_chat_id VARCHAR(255) NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  END IF;
END $$;

-- DiscordBotEvents table
DO $$
BEGIN
  IF NOT table_exists('discord_bot_events') THEN
    CREATE TABLE discord_bot_events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      event_type VARCHAR(255) NOT NULL,
      server_id UUID NOT NULL,
      user_id UUID NOT NULL,
      data JSONB,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (server_id) REFERENCES servers(id)
    );
  END IF;
END $$;

-- TelegramBotEvents table
DO $$
BEGIN
  IF NOT table_exists('telegram_bot_events') THEN
    CREATE TABLE telegram_bot_events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      event_type VARCHAR(255) NOT NULL,
      telegram_chat_id VARCHAR(255) NOT NULL,
      user_id UUID NOT NULL,
      data JSONB,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  END IF;
END $$;

-- Wallets table
DO $$
BEGIN
  IF NOT table_exists('wallets') THEN
    CREATE TABLE wallets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      wallet_address VARCHAR(255) NOT NULL,
      network VARCHAR(50) NOT NULL DEFAULT 'solana',
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE (user_id, wallet_address, network)
    );
  END IF;
END $$;

-- Create indexes (these will not throw errors if they already exist)
CREATE INDEX IF NOT EXISTS idx_users_discord_telegram ON users(discord_id, telegram_id);
CREATE INDEX IF NOT EXISTS idx_servers_discord_id ON servers(discord_id);
CREATE INDEX IF NOT EXISTS idx_guilds_owner_id ON guilds(guild_owner_id);
CREATE INDEX IF NOT EXISTS idx_airdrops_user_status ON airdrops(user_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_users_status ON transactions(from_user_id, to_user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_server ON user_roles(user_id, server_id);
CREATE INDEX IF NOT EXISTS idx_discord_bot_interactions_user_server_command ON discord_bot_interactions(user_id, server_id, command);
CREATE INDEX IF NOT EXISTS idx_telegram_bot_interactions_user_command ON telegram_bot_interactions(user_id, command);
CREATE INDEX IF NOT EXISTS idx_discord_bot_events_server_type ON discord_bot_events(server_id, event_type);
CREATE INDEX IF NOT EXISTS idx_telegram_bot_events_user_type ON telegram_bot_events(user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_wallets_user_network ON wallets(user_id, network);