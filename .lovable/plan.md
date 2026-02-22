

# Migration: Keyword Research to DataForSEO API

## Overview

Replace the current mock/Ahrefs-based keyword research section with real DataForSEO API integration. This involves creating edge functions to call DataForSEO endpoints, updating types and UI components to match DataForSEO's data model, and rewiring the entire flow.

---

## DataForSEO API Endpoints to Use

| Data Point | DataForSEO Endpoint | What It Returns |
|---|---|---|
| Search Volume + Difficulty | `dataforseo_labs/google/bulk_keyword_difficulty/live` | Volume, keyword difficulty, search intent for up to 1000 keywords |
| SERP Competitors (Top 10 domains) | `dataforseo_labs/google/serp_competitors/live` | Domains ranking for keywords with their metrics |
| Domain Authority (Rank) | `dataforseo_labs/google/domain_rank_overview/live` | Domain rank, organic traffic, backlinks count per domain |
| Backlinks per Domain | `backlinks/summary/live` | Referring domains count, dofollow RDs, backlinks count |
| Keyword Suggestions | `dataforseo_labs/google/keyword_suggestions/live` | Related keywords with volume + difficulty |
| Search Intent | `dataforseo_labs/google/search_intent/live` | Intent classification (informational, commercial, etc.) |

---

## Architecture

```text
User enters keyword + country
        |
        v
[Edge Function: keyword-research]
        |
        +---> DataForSEO: bulk_keyword_difficulty (volume, KD, intent)
        +---> DataForSEO: keyword_suggestions (find related keywords)
        |
        v
Returns keyword list to frontend
        |
User selects keywords -> "Analyze"
        |
        v
[Edge Function: keyword-analyze]
        |
        +---> DataForSEO: serp_competitors (top 10 domains per keyword)
        +---> DataForSEO: backlinks/summary (for each top domain)
        +---> DataForSEO: domain_rank_overview (domain rank per competitor)
        |
        v
Calculate scores using existing formulas -> Return analyzed data
```

---

## Changes Required

### 1. Supabase Edge Functions (New)

**`supabase/functions/keyword-research/index.ts`**
- Accepts: `{ keyword: string, country: string, language: string }`
- Calls DataForSEO `keyword_suggestions/live` to get related keywords
- Calls DataForSEO `bulk_keyword_difficulty/live` to get volume + difficulty
- Calls DataForSEO `search_intent/live` to classify intent
- Returns: array of keywords with volume, difficulty, intent data

**`supabase/functions/keyword-analyze/index.ts`**
- Accepts: `{ keywords: string[], country: string, language: string }`
- For each keyword, calls `serp_competitors/live` to get Top 10 domains
- For each unique domain, calls `backlinks/summary/live` for RD data
- For each unique domain, calls `domain_rank_overview/live` for domain rank
- Calculates scores using existing formulas (Domain Power, Backlinks, Page Power, SERP Stability, Difficulty)
- Returns: array of AnalyzedKeyword objects

### 2. Types Update (`src/types/keywordResearch.ts`)

- `RawKeywordData` - add fields from DataForSEO: `searchIntent`, `cpc`, `competition`
- `KeywordRow` - update to include DataForSEO fields (CPC, competition level)
- `DomainPowerAnalysis` - keep `drAvgTop10`, `drMinTop10`, `drMaxTop10` but source from DataForSEO's `domain_rank`
- `BacklinksAnalysis` - keep `rdAvgDofollowTop10`, `rdMinDofollowTop10`, `refDomainsTrafficTotal` from DataForSEO backlinks API
- `PagePowerAnalysis` - `urAvgTop10` replaced with DataForSEO's page-level backlink metrics
- Remove `difficulty` from `RawKeywordData` (will come from DataForSEO's KD)
- Add `cpc`, `competition` fields

### 3. Hook Update (`src/hooks/useKeywordResearch.tsx`)

- Replace `loadDemoData` with real `searchKeywords(keyword, country)` function
- Call the `keyword-research` edge function instead of loading JSON
- Replace `analyzeSelected` to call the `keyword-analyze` edge function
- Keep `applyFilters` logic (works the same)
- Add error handling and loading states for API calls
- Keep demo mode as fallback (load JSON if no API key configured)

### 4. SearchHeader Update (`src/components/keyword-research/SearchHeader.tsx`)

- Enable the keyword input field (currently disabled)
- Enable country selector
- Add a "Search" button that triggers the actual API call
- Keep "Load Demo" as a secondary option
- Add language selector (DataForSEO requires language code)

### 5. FiltersPanel Update (`src/components/keyword-research/FiltersPanel.tsx`)

- Add CPC filter (min/max range)
- Add Competition filter (low/medium/high)
- Add Keyword Difficulty filter (min/max range from DataForSEO's KD score)
- Keep existing: volume, intent, branding, location, include words filters

### 6. KeywordsTable Update (`src/components/keyword-research/KeywordsTable.tsx`)

- Add CPC column
- Add Competition column
- Add DataForSEO KD column (their native difficulty score)
- Update sort options to include new columns

### 7. AnalysisResultsPanel (`src/components/keyword-research/AnalysisResultsPanel.tsx`)

- Minimal changes - the score calculation stays the same
- Update tooltips to reference DataForSEO metrics instead of Ahrefs
- Domain Rank from DataForSEO replaces DR (conceptually similar)

### 8. Demo Data Files

- Keep `public/data/car_loans_ca_demo.json` updated with new field structure
- Keep `public/data/car_loans_ca_analyzed.json` updated for demo mode
- Demo mode works without API key for testing

### 9. Secret Management

- Store DataForSEO credentials as Supabase secrets:
  - `DATAFORSEO_LOGIN` - API login email
  - `DATAFORSEO_PASSWORD` - API password
- DataForSEO uses Basic Auth (base64 of login:password)

---

## Technical Details

### DataForSEO Authentication
All API calls use HTTP Basic Auth:
```text
Authorization: Basic base64(login:password)
```

### DataForSEO Pricing (for reference)
- Bulk Keyword Difficulty: ~$0.05 per 1000 keywords
- SERP Competitors: ~$0.05 per request
- Backlinks Summary: ~$0.02 per request  
- Domain Rank Overview: ~$0.01 per request
- Search Intent: ~$0.01 per 1000 keywords

### Score Mapping (DataForSEO to Current Model)
| Current Field | DataForSEO Source |
|---|---|
| `drAvgTop10` | Average `domain_rank` from Top 10 SERP competitors |
| `drMinTop10` | Min `domain_rank` from Top 10 SERP competitors |
| `drMaxTop10` | Max `domain_rank` from Top 10 SERP competitors |
| `rdAvgDofollowTop10` | Average `referring_domains_dofollow` from backlinks/summary |
| `rdMinDofollowTop10` | Min `referring_domains_dofollow` from backlinks/summary |
| `refDomainsTrafficTotal` | Sum of `etv` (estimated traffic value) from SERP competitors |
| `urAvgTop10` | Average `page_rank` from backlinks/summary per page |
| `serpStabilityScore` | Calculated from SERP position changes over time (from ranked keywords history) |

### Implementation Order
1. Set up DataForSEO secrets
2. Create `keyword-research` edge function
3. Create `keyword-analyze` edge function
4. Update types
5. Update hook
6. Update SearchHeader (enable real search)
7. Update FiltersPanel (add new filters)
8. Update KeywordsTable (add new columns)
9. Update demo JSON files
10. Test end-to-end

