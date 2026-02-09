import { DemonFilter } from '../types/run';
export interface PoolWindow {
    startIndex: number;
    poolLen: number;
    totalCountAtStart: number;
}
export declare const locatePoolWindow: (filter: DemonFilter, cutoffId: string) => Promise<PoolWindow>;
