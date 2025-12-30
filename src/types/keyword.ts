
export interface KeywordData {
  id: string;
  term: string;
  geo: string;
  language: string;
  position: number;
  volume: number;
  difficulty: number;
  trend: 'up' | 'down' | 'stable';
  positionChange: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface KeywordSettings {
  keywords: string[];
  frequency: number;
  avoidDuplicates: boolean;
}
