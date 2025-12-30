
export type IntentType = "Informational" | "Commercial" | "Transactional" | "Navigational";
export type BrandType = "Branded" | "Non-branded";
export type LocationType = "Local" | "Non-local";

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
