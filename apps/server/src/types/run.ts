import { ObjectId } from 'mongodb';

export type DemonFilter = 'Easy' | 'Medium' | 'Hard' | 'Insane' | 'Extreme';
export type RunCategory = '3h' | '2h' | '1h' | '30m' | 'Custom';

export interface DemonRecord {
  name: string;
  id: string;
  creator: string;
}

export interface Run {
  runId: string;
  userId: ObjectId;
  gdUserId: string;
  demonFilter: DemonFilter;
  seed: string;
  cutoffId: string;
  startIndex: number;
  poolLen: number;
  totalCountAtStart: number;
  step: number;
  usedLevelIds: string[];
  category: RunCategory;
  customTimeLabel?: string;
  createdAt: Date;
  updatedAt: Date;
  categoryIsCustom: boolean;
  demonsBeaten: DemonRecord[] | null;
  demonsBeatenCount: number;
  gaveUp: false | string;
  verified: boolean;
  verificationFootageUrl: string | null;
}

export interface RunDocument extends Run {
  _id: ObjectId;
}
