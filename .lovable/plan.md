

# Plan: Clean Up Analysis Model for DataForSEO Compatibility

## What Changes

### 1. Remove `serpStabilityScore` (no DataForSEO source)
- **`src/types/keywordResearch.ts`**: Remove `serpStabilityScore` from `KeywordAnalysis` interface
- **`src/components/keyword-research/AnalysisResultsPanel.tsx`**: Remove "SERP Stability" from CSV export headers and row data
- **`public/data/car_loans_ca_analyzed.json`**: Remove `serpStabilityScore` from all 10 entries

### 2. Rename `urAvgTop10` to `pageRankAvgTop10` (DataForSEO uses page `rank`)
- **`src/types/keywordResearch.ts`**: Rename field in `PagePowerAnalysis`
- **`src/components/keyword-research/AnalysisResultsPanel.tsx`**:
  - Update all references from `urAvgTop10` to `pageRankAvgTop10`
  - Rename column header from "UR Avg" to "Page Rank"
  - Update tooltip from "URL Rating" to "Page Backlink Rank (DataForSEO)" with updated description
  - Update CSV header from "UR Avg (Top 10)" to "Page Rank Avg (Top 10)"
- **`public/data/car_loans_ca_analyzed.json`**: Rename field in all 10 entries

### 3. Update `difficultyScore` formula comment
- Add a comment in the types file clarifying the formula now uses Page Rank instead of UR:
  - Domain Power (33%) + Backlinks (33%) + Page Power (33%)
  - Page Power is based on DataForSEO's page-level `rank` from `backlinks/summary/live`

## Files Modified
1. `src/types/keywordResearch.ts` - Remove `serpStabilityScore`, rename `urAvgTop10`
2. `src/components/keyword-research/AnalysisResultsPanel.tsx` - Update column, tooltip, CSV export
3. `public/data/car_loans_ca_analyzed.json` - Update demo data

## Technical Details
- The `difficultyScore` calculation itself doesn't change (it's a weighted average of the 3 sub-scores) - only the data source for `pagePower.score` will differ when the API is connected
- No UI layout changes needed - same number of columns, just renamed

