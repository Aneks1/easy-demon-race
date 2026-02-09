import { getCollection } from '../db/client';
import { AccountDocument } from '../types/account';
import { RunDocument } from '../types/run';

export const accountsCollection = () => getCollection<AccountDocument>('accounts');
export const runsCollection = () => getCollection<RunDocument>('runs');
