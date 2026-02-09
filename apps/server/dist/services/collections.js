import { getCollection } from '../db/client';
export const accountsCollection = () => getCollection('accounts');
export const runsCollection = () => getCollection('runs');
