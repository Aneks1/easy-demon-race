import { Db, Document } from 'mongodb';
export declare const connectToDatabase: () => Promise<Db>;
export declare const getCollection: <TSchema extends Document = Document>(collectionName: string) => Promise<import("mongodb").Collection<TSchema>>;
export declare const disconnectFromDatabase: () => Promise<void>;
