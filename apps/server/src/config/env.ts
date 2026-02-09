import dotenv from 'dotenv';

const envFile = process.env.SERVER_ENV_FILE;
const result = dotenv.config(envFile ? { path: envFile } : undefined);

if (result.error && process.env.NODE_ENV !== 'production') {
  console.warn(`Unable to load .env file${envFile ? ` at ${envFile}` : ''}:`, result.error.message);
}

type NodeEnvironment = 'development' | 'test' | 'production';

const resolveNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getRequired = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const config = {
  nodeEnv: (process.env.NODE_ENV ?? 'development') as NodeEnvironment,
  port: resolveNumber(process.env.PORT, 4000),
  mongo: {
    uri: getRequired(process.env.MONGODB_URI, 'MONGODB_URI'),
    dbName: process.env.MONGODB_DB_NAME ?? 'easy-demon-race',
    serverSelectionTimeoutMs: resolveNumber(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS, 5000),
  },
  corsOrigin: process.env.CORS_ORIGIN,
} as const;

export type AppConfig = typeof config;
