import dotenv from 'dotenv';

// Load environment variables from a `.env` file into `process.env`
dotenv.config();

// Define a type for environment variables
interface EnvConfig {
  DATABASE_HOST: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  API_PORT: number;
  VERCEL_URL: string;
  NEXT_PUBLIC_API_BASE_URL: string;
  DATABASE_URL: string;
  POSTGRES_URL: string;
  POSTGRES_PRISMA_URL: string;
  SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  POSTGRES_URL_NON_POOLING: string;
  SUPABASE_JWT_SECRET: string;
  POSTGRES_USER: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DATABASE: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  POSTGRES_HOST: string;
  NEXT_PUBLIC_SOLANA_NETWORK: string;
  NEXT_PUBLIC_SOLANA_RPC_URL: string;
  DIALECT_API_KEY: string;
  TOKEN_SECRET_KEY: string;
  DISCORD_CLIENT_ID: string;
  COINMARKETCAP_API_KEY: string;
}

const env: EnvConfig = {
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT || '5432', 10),
  DATABASE_NAME: process.env.DATABASE_NAME || 'postgres',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-key',
  API_PORT: parseInt(process.env.API_PORT || '3000', 10),
  VERCEL_URL: process.env.VERCEL_URL || 'https://blinkshare.fun',
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.blinkshare.fun',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydb',
  POSTGRES_URL: process.env.POSTGRES_URL || '',
  POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL || '',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING || '',
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || '',
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || 'postgres',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  POSTGRES_HOST: process.env.POSTGRES_HOST || '',
  NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
  NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  DIALECT_API_KEY: process.env.DIALECT_API_KEY || '<your-dialect-api-key>',
  TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY || '',
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
  COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY || '',
};

export default env;
