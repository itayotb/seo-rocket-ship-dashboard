

# Fix All Parameters to Match DataForSEO Terminology

## Problem
The codebase uses Ahrefs terminology ("DR" = Domain Rating, "URL Rating") instead of DataForSEO's actual field names. DataForSEO uses `rank` with a configurable scale (0-100 or 0-1000).

## Decision: Use `rank_scale: "one_hundred"` (0-100)
We will send `rank_scale: "one_hundred"` in API calls so all rank values come back on a 0-100 scale. This keeps formulas simple and avoids normalization.

## Changes Required

### 1. Rename Field Names in Types (`src/types/keywordResearch.ts`)

| Old (Ahrefs terms) | New (DataForSEO terms) | API Field |
|---|---|---|
| `drAvgTop10` | `rankAvgTop10` | `rank` (domain-level) |
| `drMinTop10` | `rankMinTop10` | `rank` (domain-level) |
| `drMaxTop10` | `rankMaxTop10` | `rank` (domain-level) |
| `pageRankAvgTop10` | `pageRankAvgTop10` | `rank` (page-level) |

The `pageRankAvgTop10` name is already correct (DataForSEO calls it `rank` at page level too).

### 2. Update UI Labels (`src/components/keyword-research/AnalysisResultsPanel.tsx`)

- "DR Avg" -> "Rank Avg" (or "Domain Rank Avg")
- "DR Min" -> "Rank Min"
- Tooltip descriptions: remove "Domain Rating" references, use "Domain Rank (DataForSEO)"
- "URL Rating" -> "Page Rank (DataForSEO)"
- CSV headers: "DR Avg (Top 10)" -> "Domain Rank Avg (Top 10)", etc.

### 3. Update Demo Data (`public/data/car_loans_ca_analyzed.json`)

Rename all `drAvgTop10`, `drMinTop10`, `drMaxTop10` fields to `rankAvgTop10`, `rankMinTop10`, `rankMaxTop10`.

### 4. Update Methodology Document (`public/docs/keyword-analysis-methodology.md`)

- Replace all "DR" / "Domain Rating" references with "Domain Rank"
- Add note about `rank_scale: "one_hundred"` parameter
- Clarify that `rank` is DataForSEO's native metric (not Ahrefs DR)
- Page Power: clarify it uses page-level `rank` (not "URL Rating")

### 5. Update Hook (`src/hooks/useKeywordResearch.tsx`)

No structural changes needed (uses type interfaces), but will automatically reflect type changes.

## Files to Modify

1. `src/types/keywordResearch.ts` - Rename `dr*` fields to `rank*`
2. `src/components/keyword-research/AnalysisResultsPanel.tsx` - Update labels, tooltips, CSV headers
3. `public/data/car_loans_ca_analyzed.json` - Rename fields in demo data
4. `public/docs/keyword-analysis-methodology.md` - Fix terminology throughout

## Summary of DataForSEO Field Mapping

| Our Field | DataForSEO Endpoint | DataForSEO Field | Scale |
|---|---|---|---|
| `rankAvgTop10` | `backlinks/summary/live` (domain target) | `rank` | 0-100 (with `rank_scale: "one_hundred"`) |
| `rankMinTop10` | Same | `rank` | 0-100 |
| `rankMaxTop10` | Same | `rank` | 0-100 |
| `pageRankAvgTop10` | `backlinks/summary/live` (page target) | `rank` | 0-100 |
| `rdAvgDofollowTop10` | `backlinks/summary/live` | `referring_domains - referring_domains_nofollow` | count |
| `refDomainsTrafficTotal` | `backlinks/referring_domains/live` | `organic_traffic` (aggregated) | count |

