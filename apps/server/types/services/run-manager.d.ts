import { ObjectId } from 'mongodb';
import { DemonRecord, RunDocument } from '../types/run';
export interface DrawResult {
    level: DemonRecord;
    step: number;
    liveIndex: number;
}
export declare const drawNextDemon: (run: RunDocument) => Promise<DrawResult>;
export interface RunOutcomePatch {
    demonsBeaten?: DemonRecord[] | null;
    gaveUp?: false | string;
    verified?: boolean;
    verificationFootageUrl?: string | null;
}
export declare const updateRunOutcome: (runId: string, patch: RunOutcomePatch) => Promise<RunDocument | null>;
export declare const findRunById: (runId: string) => Promise<RunDocument | null>;
export declare const findRunByObjectId: (id: ObjectId) => Promise<RunDocument | null>;
