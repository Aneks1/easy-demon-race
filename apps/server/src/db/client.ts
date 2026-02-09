import { Db, Document, MongoClient } from 'mongodb';
import { config } from '../config/env';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export const connectToDatabase = async (): Promise<Db> => {
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(config.mongo.uri, {
      serverSelectionTimeoutMS: config.mongo.serverSelectionTimeoutMs,
    });
  }

  await cachedClient.connect();
  cachedDb = cachedClient.db(config.mongo.dbName);
  return cachedDb;
};

export const getCollection = async <TSchema extends Document = Document>(collectionName: string) => {
  const db = await connectToDatabase();
  return db.collection<TSchema>(collectionName);
};

export const disconnectFromDatabase = async () => {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
};
