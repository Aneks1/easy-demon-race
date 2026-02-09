import { DemonPageResponse, DemonLevel } from '../types/demon';
import { DemonFilter } from '../types/run';
export declare const fetchRecentDemons: (filter: DemonFilter, page: number) => Promise<DemonPageResponse>;
export declare const deriveCutoffId: (filter: DemonFilter) => Promise<string>;
export declare const fetchLevelByIndex: (filter: DemonFilter, globalIndex: number) => Promise<DemonLevel | null>;
