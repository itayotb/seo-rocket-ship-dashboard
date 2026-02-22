# Keyword Analysis Methodology – DataForSEO Edition

> This document describes how the keyword difficulty analysis system works using DataForSEO as the data provider.

---

## Keyword Base Data (Not Scored)

These fields exist per keyword but are **not** part of the difficulty score calculation:

| Field | Description | Source |
|---|---|---|
| `id` | Internal identifier | System-generated |
| `keyword` | The search term | User input / `dataforseo_labs/keyword_suggestions/live` |
| `country` | Geo target (e.g., `ca`) | User input |
| `volume` | Monthly search volume | `dataforseo_labs/keyword_suggestions/live` → `search_volume` |
| `difficulty` (KD) | DataForSEO's own keyword difficulty (0–100) | `dataforseo_labs/bulk_keyword_difficulty/live` |
| `cpc` | Cost per click (USD) | `dataforseo_labs/keyword_suggestions/live` → `cpc` |
| `competition` | Competition level: `LOW` / `MEDIUM` / `HIGH` | `dataforseo_labs/keyword_suggestions/live` → `competition` (float 0–1, mapped) |
| `intents` | Search intent types (Informational, Commercial, Transactional, Navigational) | `dataforseo_labs/keyword_suggestions/live` → `search_intent_info` |

### Competition Mapping

DataForSEO returns `competition` as a float (0–1). We map it:

| Range | Label |
|---|---|
| 0 – 0.33 | `LOW` |
| 0.34 – 0.66 | `MEDIUM` |
| 0.67 – 1.0 | `HIGH` |

---

## Analysis Categories (Scored)

The system uses **3 scored categories** to compute a final difficulty score.

---

### 1️⃣ Domain Power

**What it measures:** How strong the competing domains are in the Top 10 search results.

**Inputs:**

| Field | Description | Source |
|---|---|---|
| `drAvgTop10` | Average Domain Rating of Top 10 | `backlinks/summary/live` → `rank` (domain-level) |
| `drMinTop10` | Lowest DR in Top 10 | Same |
| `drMaxTop10` | Highest DR in Top 10 | Same |

All DR values naturally scale 0–100.

**Score Formula:**

```
DomainPowerScore = (drAvgTop10 × 0.5) + (drMinTop10 × 0.3) + (drMaxTop10 × 0.2)
```

**Interpretation:**
- 0 = very weak competition
- 100 = extremely strong domains

---

### 2️⃣ Backlinks Power

**What it measures:** How many strong backlinks are required to rank.

**Inputs:**

| Field | Description | Source |
|---|---|---|
| `rdAvgDofollowTop10` | Avg dofollow referring domains per page (DR > 25 only) | `backlinks/summary/live` → `referring_domains_nofollow` subtracted |
| `rdMinDofollowTop10` | Min dofollow RD among Top 10 (DR > 25 only) | Same |
| `refDomainsTrafficTotal` | Combined organic traffic of all referring domains | `backlinks/referring_domains/live` → aggregated traffic |

**Step 1 – Normalize RD values to 0–100:**

```
RD_Avg_Score = min((rdAvgDofollowTop10 / 100) × 100, 100)
RD_Min_Score = min((rdMinDofollowTop10 / 50) × 100, 100)
```

- 100 RD avg = score 100
- 50 RD min = score 100

**Step 2 – Normalize Referring Domains Traffic:**

```
Traffic_Score = min((refDomainsTrafficTotal / 1,000,000) × 100, 100)
```

- 1,000,000 total organic traffic = MAX difficulty 100

**Step 3 – Final Backlinks Score:**

```
BacklinksScore = (RD_Avg_Score × 0.45) + (RD_Min_Score × 0.25) + (Traffic_Score × 0.30)
```

**Interpretation:**
- 0 = almost no backlinks needed
- 100 = huge backlink strength required

---

### 3️⃣ Page Power

**What it measures:** Strength of individual pages currently ranking (not domains).

**Input:**

| Field | Description | Source |
|---|---|---|
| `pageRankAvgTop10` | Average page-level rank of Top 10 | `backlinks/summary/live` → page-level `rank` |

The page `rank` from DataForSEO is already scaled 0–100.

**Score:**

```
PagePowerScore = pageRankAvgTop10
```

**Interpretation:**
- 0 = pages rank without authority
- 100 = highly authoritative ranking pages

> **Note:** In the previous Rapid API version, this used `urAvgTop10` (URL Rating). DataForSEO does not provide UR, so we use the page-level `rank` from `backlinks/summary/live` instead.

---

## Final Difficulty Score

The main 0–100 score combining all three categories with **equal weights**:

```
DifficultyScore = (DomainPowerScore × 0.33) + (BacklinksScore × 0.33) + (PagePowerScore × 0.33)
```

> **Change from previous version:** The old system used 5 categories with weights 25% + 25% + 20% + 20% + 10% (including Intent and SERP Stability). The new system uses 3 categories at 33% each. Intent is still displayed but not scored. SERP Stability has been removed entirely (no DataForSEO equivalent).

**Result:** Always 0–100 where:
- 0 = very easy
- 100 = extremely hard

---

## Difficulty Labels (6-Scale Model)

| Range | Label |
|---|---|
| 0 – 15 | `very_easy` |
| 16 – 35 | `easy` |
| 36 – 50 | `medium` |
| 51 – 65 | `challenging` |
| 66 – 80 | `hard` |
| 81 – 100 | `extreme` |

---

## Recommended Site Type

Based **only** on the final difficulty score:

| Condition | Recommendation | Description |
|---|---|---|
| Difficulty ≤ 35 | `small_site` | 1–4 pages |
| Difficulty ≤ 65 | `mini_site` | Up to 10 pages |
| Difficulty > 65 | `authority_blog` | Full authority site |

---

## DataForSEO API Endpoints Reference

| Data | Endpoint | Field Path |
|---|---|---|
| Keyword suggestions, volume, CPC, competition, intents | `dataforseo_labs/keyword_suggestions/live` | `search_volume`, `cpc`, `competition`, `search_intent_info` |
| Keyword difficulty (KD) | `dataforseo_labs/bulk_keyword_difficulty/live` | `keyword_difficulty` |
| Domain Rating (DR) | `backlinks/summary/live` (domain-level) | `rank` |
| Page Rank | `backlinks/summary/live` (page-level) | `rank` |
| Referring domains (dofollow) | `backlinks/summary/live` | `referring_domains`, `referring_domains_nofollow` |
| Referring domains traffic | `backlinks/referring_domains/live` | `organic_traffic` (aggregated) |
| SERP results (Top 10) | `serp/google/organic/live/regular` | `items[]` → URLs for backlink lookups |

---

## Changes from Previous Version (Rapid API)

| Aspect | Old (Rapid API) | New (DataForSEO) |
|---|---|---|
| Categories | 5 | 3 |
| Weights | 25% + 25% + 20% + 20% + 10% | 33% + 33% + 33% |
| Page Power metric | `urAvgTop10` (URL Rating) | `pageRankAvgTop10` (page-level `rank`) |
| SERP Stability | Included (10% weight) | Removed |
| Intent Score | Included (20% weight) | Display only, not scored |
| Competition field | Not present | Added (LOW/MEDIUM/HIGH) |
| CPC field | Not present | Added |
| KD field | Not present | Added |
