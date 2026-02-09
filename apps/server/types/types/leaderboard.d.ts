import { RunCategory, DemonRecord } from './run';
export interface LeaderboardEntry {
    top: number;
    runId: string;
    user: string;
    category: RunCategory;
    demonsBeaten: DemonRecord[];
}
