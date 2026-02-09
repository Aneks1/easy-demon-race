import { Router } from 'express';
import { config } from '../config/env';

export const healthRouter: Router = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});
