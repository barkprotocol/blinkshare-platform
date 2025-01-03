import dotenv from 'dotenv';

// Load environment variables from a `.env` file into `process.env`
dotenv.config();

const env = {
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT || '5432', 10),
  DATABASE_NAME: process.env.DATABASE_NAME || 'postgres',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-key',
  API_PORT: parseInt(process.env.API_PORT || '3000', 10),
  // Add more environment variables as needed
};

export default env;
