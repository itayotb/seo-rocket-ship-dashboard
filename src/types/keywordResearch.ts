
export type IntentType = "Informational" | "Commercial" | "Transactional" | "Navigational";
export type BrandType = "Branded" | "Non-branded";
export type LocationType = "Local" | "Non-local";
export type DifficultyLabel = "easy" | "medium" | "hard";
export type RecommendedSiteType = "small_site" | "mini_site" | "authority_blog";

export interface KeywordRow {
  id: number;
  keyword: string;
  country: string;
  volume: number;
  difficulty: number;
  intentsRaw: string;
  intentTypes: IntentType[];
  brandType: BrandType;
  locationType: LocationType;
}

export interface RawKeywordData {
  id: number;
  keyword: string;
  country: string;
  difficulty: number;
  volume: number;
  intentsRaw: string;
}

export interface FiltersState {
  minVolume: number;
  intentTypes: IntentType[];
  branding: "all" | "Branded" | "Non-branded";
  location: "all" | "Local" | "Non-local";
  includeTerms: string[];
  includeMode: "all" | "any";
}

export const defaultFilters: FiltersState = {
  minVolume: 0,
  intentTypes: [],
  branding: "all",
  location: "all",
  includeTerms: [],
  includeMode: "any",
};

// Analysis Types
export interface DomainPowerAnalysis {
  drAvgTop5: number;
  drMinTop5: number;
  drMaxTop5: number;
  drAvgTop10: number;
  drMinTop10: number;
  drMaxTop10: number;
  score: number;
}

export interface BacklinksAnalysis {
  rdAvgDofollowTop5: number;
  rdMinDofollowTop5: number;
  rdAvgDofollowTop10: number;
  rdMinDofollowTop10: number;
  refDomainsTrafficTotal: number;
  score: number;
}

export interface PagePowerAnalysis {
  urAvgTop5: number;
  urAvgTop10: number;
  score: number;
}

export interface IntentAnalysis {
  mainIntent: IntentType;
  serpLocked: boolean;
  branded: boolean;
  local: boolean;
  score: number;
}

export interface KeywordAnalysis {
  domainPower: DomainPowerAnalysis;
  backlinks: BacklinksAnalysis;
  pagePower: PagePowerAnalysis;
  intent: IntentAnalysis;
  uxTrustScore: number;
  serpStabilityScore: number;
  difficultyScore: number;
  difficultyLabel: DifficultyLabel;
  recommendedSiteType: RecommendedSiteType;
}

export interface AnalyzedKeyword {
  id: number;
  keyword: string;
  country: string;
  volume: number;
  ahrefsDifficulty: number;
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
