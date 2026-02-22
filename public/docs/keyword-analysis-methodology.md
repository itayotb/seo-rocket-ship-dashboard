# Keyword Analysis Methodology

> How the keyword difficulty analysis system works with the DataForSEO API.

---

## Important: DataForSEO Terminology

This system uses **DataForSEO's native `rank` metric** — not Ahrefs "Domain Rating (DR)" or "URL Rating (UR)".

- **Domain Rank** = `rank` from `backlinks/summary/live` with a **domain-level target**
- **Page Rank** = `rank` from `backlinks/summary/live` with a **page-level target**

We use `rank_scale: "one_hundred"` in all API calls so rank values are returned on a **0–100 scale** (instead of the default 0–1000).

---

## Keyword Base Data (Not Scored)

These fields exist per keyword but are **not** part of the difficulty score calculation:

| Field | Description | DataForSEO Source |
|---|---|---|
| `id` | Internal identifier | System-generated |
| `keyword` | The search term | User input / `dataforseo_labs/keyword_suggestions/live` |
| `country` | Geo target (e.g., `ca`) | User input |
| `volume` | Monthly search volume | `dataforseo_labs/keyword_suggestions/live` → `search_volume` |
| `difficulty` (KD) | Keyword difficulty (0–100) | `dataforseo_labs/bulk_keyword_difficulty/live` → `keyword_difficulty` |
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

**What it measures:** How strong the competing domains are in the Top 10 search results. If the Top 10 domains are powerful → higher difficulty. If weaker domains appear → easier.

**Inputs:**

| Field | Description | DataForSEO Source |
|---|---|---|
| `rankAvgTop10` | Average Domain Rank of Top 10 | `backlinks/summary/live` (domain target) → `rank` with `rank_scale: "one_hundred"` |
| `rankMinTop10` | Lowest Domain Rank in Top 10 | Same |
| `rankMaxTop10` | Highest Domain Rank in Top 10 | Same |

All values scale 0–100 (using `rank_scale: "one_hundred"`).

**Score Formula:**

```
DomainPowerScore = (rankAvgTop10 × 0.5) + (rankMinTop10 × 0.3) + (rankMaxTop10 × 0.2)
```

**Interpretation:**
- 0 = very weak competition
- 100 = extremely strong domains

---

### 2️⃣ Backlinks Power

**What it measures:** How many strong backlinks are required to rank. If competitors have strong backlink profiles → hard. If competitors rank with few or weak backlinks → easier.

**Inputs:**

| Field | Description | DataForSEO Source |
|---|---|---|
| `rankAvgDofollowTop10` | Avg dofollow rank per page (Domain Rank > 25 only) | `backlinks/summary/live` → `rank` with `rank_scale: "one_hundred"` |
| `rankMinDofollowTop10` | Min dofollow rank among Top 10 (Domain Rank > 25 only) | Same |
| `refDomainsTrafficTotal` | Combined organic traffic of all referring domains | `backlinks/referring_domains/live` → `organic_traffic` (aggregated) |

**Step 1 – Normalize Rank values to 0–100:**

```
Rank_Avg_Score = min((rankAvgDofollowTop10 / 100) × 100, 100)
Rank_Min_Score = min((rankMinDofollowTop10 / 50) × 100, 100)
```

- 100 rank avg → score 100
- 50 rank min → score 100

**Step 2 – Normalize Referring Domains Traffic:**

```
Traffic_Score = min((refDomainsTrafficTotal / 1,000,000) × 100, 100)
```

- 1,000,000 total organic traffic = MAX difficulty 100
- Lower = proportional score

**Step 3 – Final Backlinks Score:**

```
BacklinksScore = (Rank_Avg_Score × 0.45) + (Rank_Min_Score × 0.25) + (Traffic_Score × 0.30)
```

**Interpretation:**
- 0 = almost no backlinks needed
- 100 = huge backlink strength required

---

### 3️⃣ Page Power

**What it measures:** Strength of individual pages currently ranking (not domains).

**Input:**

| Field | Description | DataForSEO Source |
|---|---|---|
| `pageRankAvgTop10` | Average page-level rank of Top 10 | `backlinks/summary/live` (page target) → `rank` with `rank_scale: "one_hundred"` |

The page `rank` from DataForSEO is scaled 0–100 (using `rank_scale: "one_hundred"`).

**Score:**

```
PagePowerScore = pageRankAvgTop10
```

**Interpretation:**
- 0 = pages rank without authority
- 100 = highly authoritative ranking pages

---

## Final Difficulty Score

The main 0–100 score combining all three categories with **equal weights**:

```
DifficultyScore = (DomainPowerScore × 0.33) + (BacklinksScore × 0.33) + (PagePowerScore × 0.33)
```

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
| Domain Rank | `backlinks/summary/live` (domain-level target) | `rank` (with `rank_scale: "one_hundred"`) |
| Page Rank | `backlinks/summary/live` (page-level target) | `rank` (with `rank_scale: "one_hundred"`) |
| Referring domains (dofollow) | `backlinks/summary/live` | `referring_domains`, `referring_domains_nofollow` |
| Referring domains traffic | `backlinks/referring_domains/live` | `organic_traffic` (aggregated) |
| SERP results (Top 10) | `serp/google/organic/live/regular` | `items[]` → URLs for backlink lookups |

### API Call Parameter

All `backlinks/summary/live` calls must include:
```json
{
  "rank_scale": "one_hundred"
}
```
This ensures `rank` values are returned on a 0–100 scale instead of the default 0–1000.

---

## Data Flow

```
1. User enters keyword + country
2. → dataforseo_labs/keyword_suggestions/live
   Returns: volume, cpc, competition, intents + related keywords

3. → dataforseo_labs/bulk_keyword_difficulty/live
   Returns: KD score per keyword

4. User selects keywords for deep analysis
5. → serp/google/organic/live/regular
   Returns: Top 10 URLs for the keyword

6. For each Top 10 URL:
   → backlinks/summary/live (page-level, rank_scale: "one_hundred")
   Returns: page rank, referring domains

   → backlinks/summary/live (domain-level, rank_scale: "one_hundred")
   Returns: domain rank

   → backlinks/referring_domains/live
   Returns: referring domains with traffic data

7. Aggregate metrics → compute 3 category scores → final DifficultyScore
```
