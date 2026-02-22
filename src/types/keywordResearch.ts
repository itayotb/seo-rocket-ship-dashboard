
export type IntentType = "Informational" | "Commercial" | "Transactional" | "Navigational" | "Mixed";
export type DifficultyLabel = "very_easy" | "easy" | "medium" | "challenging" | "hard" | "extreme";
export type RecommendedSiteType = "small_site" | "mini_site" | "authority_blog";
export type CompetitionLevel = "LOW" | "MEDIUM" | "HIGH";

export interface KeywordRow {
  id: number;
  keyword: string;
  country: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: CompetitionLevel;
  intentsRaw: string;
  intentTypes: IntentType[];
}

export interface RawKeywordData {
  id: number;
  keyword: string;
  country: string;
  difficulty: number;
  volume: number;
  cpc: number;
  competition: CompetitionLevel;
  intentsRaw: string;
}

export interface FiltersState {
  minVolume: number;
  minDifficulty: number;
  maxDifficulty: number;
  minCpc: number;
  maxCpc: number;
  competition: "all" | CompetitionLevel;
  intentTypes: IntentType[];
  includeTerms: string[];
  includeMode: "all" | "any";
}

export const defaultFilters: FiltersState = {
  minVolume: 0,
  minDifficulty: 0,
  maxDifficulty: 100,
  minCpc: 0,
  maxCpc: 999,
  competition: "all",
  intentTypes: [],
  includeTerms: [],
  includeMode: "any",
};

// Analysis Types
export interface DomainPowerAnalysis {
  rankAvgTop10: number;
  rankMinTop10: number;
  rankMaxTop10: number;
  score: number;
}

export interface BacklinksAnalysis {
  rdAvgDofollowTop10: number;
  rdMinDofollowTop10: number;
  refDomainsTrafficTotal: number;
  score: number;
}

export interface PagePowerAnalysis {
  /** DataForSEO: page-level `rank` from `backlinks/summary/live` */
  pageRankAvgTop10: number;
  score: number;
}

/**
 * Difficulty formula: Domain Power (33%) + Backlinks (33%) + Page Power (33%)
 * Page Power uses DataForSEO's page-level `rank` from `backlinks/summary/live`
 */
export interface KeywordAnalysis {
  domainPower: DomainPowerAnalysis;
  backlinks: BacklinksAnalysis;
  pagePower: PagePowerAnalysis;
  difficultyScore: number;
  difficultyLabel: DifficultyLabel;
  recommendedSiteType: RecommendedSiteType;
}

export interface AnalyzedKeyword {
  id: number;
  keyword: string;
  country: string;
  volume: number;
  intentsRaw: string;
  analysis: KeywordAnalysis;
}

// Parameter for display
export interface AnalysisParameter {
  key: string;
  label: string;
  value: number;
  category: 'domain' | 'backlinks' | 'page' | 'intent' | 'scores';
}
