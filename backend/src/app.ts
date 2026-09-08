import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { authRouter } from './routes/auth.routes';
import { scoreRouter } from './routes/score.routes';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/login', authRouter);
  app.use('/score', scoreRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}