import express, { Request, Response, NextFunction } from 'express';
import { blinksRouter } from './routers/blinks';
import { initializeDatabase } from './database/database';
import { discordRouter } from './routers/discord';
import helmet from 'helmet';
import { actionCorsMiddleware, BLOCKCHAIN_IDS } from '@solana/actions';
import env from './services/env';
import './cron/remove-expired-roles';
import { loginRouter } from './routers/login';

require('console-stamp')(console, 'dd/mm/yyyy HH:MM:ss');

// Initialize the database
initializeDatabase();

const app = express();
app.use(express.json());
app.use(helmet());

// CORS middleware configuration
app.use(
  actionCorsMiddleware({
    chainId: BLOCKCHAIN_IDS.mainnet,
    actionVersion: '2', // Uncommented to specify the version of actions
  })
);

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
      { pathPattern: '/blinks/**', apiPath: `${env.APP_BASE_URL || 'https://default.base.url'}/blinks/**` },
    ],
  }),
);

// Route handling
app.use('/login', loginRouter);
app.use('/blinks', blinksRouter);
app.use('/discord', discordRouter);

// Global error handler to catch any unhandled errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unexpected Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
});

// Start server
const PORT = env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
