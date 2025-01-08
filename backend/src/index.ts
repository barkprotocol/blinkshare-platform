import express, { Request, Response, NextFunction } from 'express';
import { blinksRouter } from './routers/blinks';
import { initializeDatabase } from './database/database';
import { discordRouter } from './routers/discord';
import helmet from 'helmet';
import { actionCorsMiddleware, BLOCKCHAIN_IDS } from '@solana/actions';
import env from './services/env';
import './cron/remove-expired-roles';
import { loginRouter } from './routers/login';
import rateLimit from 'express-rate-limit';
import { createLogger, transports, format } from 'winston';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize the database
initializeDatabase();

// Create a Winston logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'server.log' })
  ],
});

const app = express();
app.use(express.json());
app.use(helmet());

// CORS middleware configuration
app.use(
  actionCorsMiddleware({
    chainId: BLOCKCHAIN_IDS.mainnet,
    actionVersion: '2', // Specify the version of actions
  })
);

// Rate limiting configuration
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
}));

// Redirect API URL to the website
app.use((req, res, next) => {
  if (req.hostname === 'api.blinkshare.fun' && req.path === '/') {
    const userAgent = req.headers['user-agent'] || '';
    const isBrowser = /Mozilla|Chrome|Safari|Edge|Opera/.test(userAgent);

    if (isBrowser) {
      return res.redirect(301, 'https://blinkshare.fun');
    }
  }
  next();
});

// API path mappings (added fallback for APP_BASE_URL)
app.get('/actions.json', (req: Request, res: Response) =>
  res.json({
    rules: [
      { pathPattern: '/', apiPath: '/blinks/' },
      { pathPattern: '/blinks/**', apiPath: `${env.APP_BASE_URL || 'https://blinkshare.fun'}/blinks/**` },
    ],
  }),
);

// Route handling
app.use('/login', loginRouter);
app.use('/blinks', blinksRouter);
app.use('/discord', discordRouter);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Server is healthy' });
});

// Global error handler to catch any unhandled errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error with Winston
  logger.error(err.message, { stack: err.stack });

  // If the error has a status code, use it; otherwise, default to 500
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
});

// Start server with graceful shutdown
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));

// Graceful shutdown on SIGINT (Ctrl + C) and SIGTERM
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
  server.close(() => {
    logger.info('Server shut down');
    process.exit(0);
  });
});
