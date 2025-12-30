
export type IntentType = "Informational" | "Commercial" | "Transactional" | "Navigational" | "Mixed";
export type BrandType = "Branded" | "Non-branded";
export type LocationType = "Local" | "Non-local";
export type DifficultyLabel = "very_easy" | "easy" | "medium" | "challenging" | "hard" | "extreme";
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
  drAvgTop10: number;
  drMinTop10: number;
  drMaxTop10: number;
  score: number;
}

export interface BacklinksAnalysis {
  rdAvgDofollowTop10: number;
  rdMinDofollowTop10: number;
  refDomainsTrafficTotal: number;
  score: number;
}

export interface PagePowerAnalysis {
  urAvgTop10: number;
  score: number;
}

export interface KeywordAnalysis {
  domainPower: DomainPowerAnalysis;
  backlinks: BacklinksAnalysis;
  pagePower: PagePowerAnalysis;
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
