import cors from 'cors';
import express, { Express } from 'express';
import { config } from './config/env';
import { healthRouter } from './routes/health';
import { accountsRouter } from './routes/accounts';
import { runsRouter } from './routes/runs';
import { leaderboardsRouter } from './routes/leaderboards';
import { demonsRouter } from './routes/demons';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

const app: Express = express();

app.use(
  cors(
    config.corsOrigin
      ? {
          origin: config.corsOrigin,
        }
      : undefined,
  ),
);
app.use(express.json());
app.use('/health', healthRouter);
app.use('/accounts', accountsRouter);
app.use('/runs', runsRouter);
app.use('/leaderboards', leaderboardsRouter);
app.use('/demons', demonsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

export default app;
