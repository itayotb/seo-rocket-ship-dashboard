

# Create Updated Keyword Analysis Documentation

## Overview
Create a new markdown document (`public/docs/keyword-analysis-methodology.md`) that replaces the old PDF and accurately describes how the system works with the DataForSEO API.

## Key Differences from Old PDF

| Aspect | Old (Rapid API) | New (DataForSEO) |
|---|---|---|
| Categories | 5 (Domain, Backlinks, Page, Intent, SERP Stability) | 3 (Domain, Backlinks, Page) |
| Weights | 25% + 25% + 20% + 20% + 10% | 33% + 33% + 33% |
| Page Power metric | `urAvgTop10` (URL Rating) | `pageRankAvgTop10` (page-level `rank` from `backlinks/summary/live`) |
| SERP Stability | Included (10%) | Removed (no DataForSEO source) |
| Intent Score | Included (20%) | Removed from difficulty formula (intent is still displayed but not scored) |
| Competition field | Not present | Added (DataForSEO float 0-1, mapped to LOW/MEDIUM/HIGH) |
| CPC field | Not present | Added from `keyword_suggestions/live` |
| KD field | Not present | Added from `bulk_keyword_difficulty/live` |

## Document Content Structure

1. **Keyword Base Data** - id, keyword, country, volume, difficulty (KD), cpc, competition, intents
2. **Analysis Category 1: Domain Power** - same formula as before (DR avg/min/max)
3. **Analysis Category 2: Backlinks Power** - same formula (RD avg/min, traffic)
4. **Analysis Category 3: Page Power** - updated to use DataForSEO `pageRankAvgTop10`
5. **Final Difficulty Score** - updated to 33/33/33 weights
6. **Difficulty Labels** - same 6-scale model
7. **Recommended Site Type** - same logic
8. **DataForSEO API Endpoints Reference** - which endpoint provides each field

## File to Create
- `public/docs/keyword-analysis-methodology.md` - Full methodology document

## Technical Notes
- The document will be a Markdown file stored in the project for easy reference
- All formulas will match exactly what the code implements
- DataForSEO endpoint names will be included for developer reference
