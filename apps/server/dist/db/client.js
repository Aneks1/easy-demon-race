import { MongoClient } from 'mongodb';
import { config } from '../config/env';
let cachedClient = null;
let cachedDb = null;
export const connectToDatabase = async () => {
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
export const getCollection = async (collectionName) => {
    const db = await connectToDatabase();
    return db.collection(collectionName);
};
export const disconnectFromDatabase = async () => {
    if (cachedClient) {
        await cachedClient.close();
        cachedClient = null;
        cachedDb = null;
    }
};
