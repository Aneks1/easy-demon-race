import { AccountDocument } from '../types/account';
import { RunDocument } from '../types/run';
export declare const accountsCollection: () => Promise<import("mongodb").Collection<AccountDocument>>;
export declare const runsCollection: () => Promise<import("mongodb").Collection<RunDocument>>;
