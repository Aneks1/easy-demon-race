export interface DemonLevel {
  id: string;
  name: string;
  creator: string;
  difficulty: string;
  rating?: number;
}

export interface DemonPageResponse {
  page: number;
  levels: DemonLevel[];
  totalCount: number;
  hasMore: boolean;
}
