import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const Methodology = () => {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .methodology-page { padding: 0 !important; max-width: 100% !important; }
          table { page-break-inside: avoid; }
          h2, h3 { page-break-after: avoid; }
          .code-block { page-break-inside: avoid; }
        }
      `}</style>
      <div className="methodology-page max-w-4xl mx-auto px-8 py-10 bg-white text-gray-900 font-serif leading-relaxed">
        {/* Print Button */}
        <div className="no-print flex justify-end mb-6">
          <Button onClick={() => window.print()} className="gap-2">
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </Button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2 font-sans">Keyword Analysis Methodology</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">How the keyword difficulty analysis system works with the DataForSEO API</p>
        <hr className="mb-8 border-gray-300" />

        {/* DataForSEO API Services Used */}
        <h2 className="text-2xl font-bold font-sans mt-6 mb-4">DataForSEO API Services Used</h2>
        <p className="mb-4 text-sm">This system uses the following DataForSEO API services:</p>
        <table className="w-full border-collapse mb-6 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Category</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">API Service</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">What We Use It For</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Keyword Data', 'dataforseo_labs/keyword_suggestions/live', 'Fetch keyword suggestions, volume, CPC, competition, and search intent'],
              ['Keyword Data', 'dataforseo_labs/bulk_keyword_difficulty/live', 'Get KD scores for multiple keywords at once'],
              ['SERP API', 'serp/google/organic/live/regular', 'Retrieve Top 10 Google organic results for deep analysis'],
              ['Backlinks API', 'backlinks/summary/live', 'Get Domain Rank and Page Rank (with rank_scale: "one_hundred")'],
              ['Backlinks API', 'backlinks/referring_domains/live', 'Get referring domain count and organic traffic data'],
            ].map(([cat, service, usage], i) => (
              <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="border border-gray-300 px-3 py-2 font-semibold">{cat}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{service}</td>
                <td className="border border-gray-300 px-3 py-2">{usage}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-lg font-bold font-sans mb-3">API Services NOT Currently Used</h3>
        <p className="mb-3 text-sm">The following DataForSEO services are available but <strong>not</strong> part of the current implementation:</p>
        <table className="w-full border-collapse mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Category</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">API Service</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Search & Generative Engine Optimization', 'AI Optimization'],
              ['Keyword Data', 'Google Ads API, Bing Ads API, Google Trends API'],
              ['On-page SEO & Website Health', 'OnPage API, Lighthouse API, Content Analysis API'],
              ['Website Visibility', 'DataForSEO Labs API (advanced), Domain Analytics API'],
              ['Ecommerce', 'Business Data API, Merchant API (Amazon), Merchant API (Google Shopping)'],
              ['App Data', 'App Store API, Google Play API'],
            ].map(([cat, service], i) => (
              <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="border border-gray-300 px-3 py-2 font-semibold">{cat}</td>
                <td className="border border-gray-300 px-3 py-2">{service}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Important Note */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r">
          <p className="font-sans font-semibold text-blue-800 mb-1">Important: DataForSEO Terminology</p>
          <p className="text-sm text-blue-900">
            This system uses <strong>DataForSEO's native <code className="bg-blue-100 px-1 rounded">rank</code> metric</strong> — not Ahrefs "Domain Rating (DR)" or "URL Rating (UR)".
          </p>
          <ul className="list-disc ml-6 mt-2 text-sm text-blue-900">
            <li><strong>Domain Rank</strong> = <code className="bg-blue-100 px-1 rounded">rank</code> from <code className="bg-blue-100 px-1 rounded">backlinks/summary/live</code> with a <strong>domain-level target</strong></li>
            <li><strong>Page Rank</strong> = <code className="bg-blue-100 px-1 rounded">rank</code> from <code className="bg-blue-100 px-1 rounded">backlinks/summary/live</code> with a <strong>page-level target</strong></li>
          </ul>
          <p className="text-sm text-blue-900 mt-2">
            We use <code className="bg-blue-100 px-1 rounded">rank_scale: "one_hundred"</code> in all API calls so rank values are returned on a <strong>0–100 scale</strong>.
          </p>
        </div>

        {/* Section 1: Keyword Base Data */}
        <h2 className="text-2xl font-bold font-sans mt-10 mb-4">Keyword Base Data <span className="text-gray-400 font-normal text-base">(Not Scored)</span></h2>
        <p className="mb-4 text-sm">These fields exist per keyword but are <strong>not</strong> part of the difficulty score calculation:</p>
        <table className="w-full border-collapse mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Field</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Description</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">DataForSEO Source</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['id', 'Internal identifier', 'System-generated'],
              ['keyword', 'The search term', 'User input / keyword_suggestions/live'],
              ['country', 'Geo target (e.g., ca)', 'User input'],
              ['volume', 'Monthly search volume', 'keyword_suggestions/live → search_volume'],
              ['difficulty (KD)', 'Keyword difficulty (0–100)', 'bulk_keyword_difficulty/live → keyword_difficulty'],
              ['cpc', 'Cost per click (USD)', 'keyword_suggestions/live → cpc'],
              ['competition', 'Competition level: LOW / MEDIUM / HIGH', 'keyword_suggestions/live → competition (float 0–1, mapped)'],
              ['intents', 'Search intent types', 'keyword_suggestions/live → search_intent_info'],
            ].map(([field, desc, source], i) => (
              <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{field}</td>
                <td className="border border-gray-300 px-3 py-2">{desc}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{source}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Competition Mapping */}
        <h3 className="text-lg font-bold font-sans mb-3">Competition Mapping</h3>
        <p className="mb-3 text-sm">DataForSEO returns <code className="bg-gray-100 px-1 rounded">competition</code> as a float (0–1). We map it:</p>
        <table className="w-64 border-collapse mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Range</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Label</th>
            </tr>
          </thead>
          <tbody>
            {[['0 – 0.33', 'LOW'], ['0.34 – 0.66', 'MEDIUM'], ['0.67 – 1.0', 'HIGH']].map(([range, label], i) => (
              <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="border border-gray-300 px-3 py-2">{range}</td>
                <td className="border border-gray-300 px-3 py-2 font-semibold">{label}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Analysis Categories */}
        <h2 className="text-2xl font-bold font-sans mt-10 mb-4">Analysis Categories <span className="text-gray-400 font-normal text-base">(Scored)</span></h2>
        <p className="mb-6 text-sm">The system uses <strong>3 scored categories</strong> to compute a final difficulty score.</p>

        {/* 1. Domain Power */}
        <h3 className="text-xl font-bold font-sans mb-3 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">1</span>
          Domain Power
        </h3>
        <p className="mb-3 text-sm"><strong>What it measures:</strong> How strong the competing domains are in the Top 10. Powerful domains → higher difficulty.</p>
        <p className="mb-2 text-sm font-semibold font-sans">Inputs:</p>
        <table className="w-full border-collapse mb-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Field</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Description</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">DataForSEO Source</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['rankAvgTop10', 'Average Domain Rank of Top 10', 'backlinks/summary/live (domain) → rank'],
              ['rankMinTop10', 'Lowest Domain Rank in Top 10', 'Same'],
              ['rankMaxTop10', 'Highest Domain Rank in Top 10', 'Same'],
            ].map(([f, d, s], i) => (
              <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{f}</td>
                <td className="border border-gray-300 px-3 py-2">{d}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{s}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="code-block bg-gray-100 border border-gray-300 rounded p-4 mb-6 font-mono text-sm">
          DomainPowerScore = (rankAvgTop10 × 0.5) + (rankMinTop10 × 0.3) + (rankMaxTop10 × 0.2)
        </div>

        {/* 2. Backlinks Power */}
        <h3 className="text-xl font-bold font-sans mb-3 flex items-center gap-2">
          <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">2</span>
          Backlinks Power
        </h3>
        <p className="mb-3 text-sm"><strong>What it measures:</strong> How many strong backlinks are required to rank. Strong backlink profiles → harder.</p>
        <p className="mb-2 text-sm font-semibold font-sans">Inputs:</p>
        <table className="w-full border-collapse mb-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Field</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Description</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">DataForSEO Source</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['rankAvgDofollowTop10', 'Avg dofollow rank (Rank > 25)', 'backlinks/summary/live → rank (rank_scale: one_hundred)'],
              ['rankMinDofollowTop10', 'Min dofollow rank among Top 10 (Rank > 25)', 'Same'],
              ['refDomainsTrafficTotal', 'Combined organic traffic of all referring domains', 'backlinks/referring_domains/live → organic_traffic'],
            ].map(([f, d, s], i) => (
              <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{f}</td>
                <td className="border border-gray-300 px-3 py-2">{d}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{s}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mb-2 text-sm font-semibold font-sans">Step 1 – Normalize Rank values to 0–100:</p>
        <div className="code-block bg-gray-100 border border-gray-300 rounded p-4 mb-4 font-mono text-sm">
          <div>Rank_Avg_Score = min((rankAvgDofollowTop10 / 100) × 100, 100)</div>
          <div>Rank_Min_Score = min((rankMinDofollowTop10 / 50) × 100, 100)</div>
        </div>
        <p className="mb-2 text-sm font-semibold font-sans">Step 2 – Normalize Referring Domains Traffic:</p>
        <div className="code-block bg-gray-100 border border-gray-300 rounded p-4 mb-4 font-mono text-sm">
          Traffic_Score = min((refDomainsTrafficTotal / 1,000,000) × 100, 100)
        </div>
        <p className="mb-2 text-sm font-semibold font-sans">Step 3 – Final Backlinks Score:</p>
        <div className="code-block bg-gray-100 border border-gray-300 rounded p-4 mb-6 font-mono text-sm">
          BacklinksScore = (Rank_Avg_Score × 0.45) + (Rank_Min_Score × 0.25) + (Traffic_Score × 0.30)
        </div>

        {/* 3. Page Power */}
        <h3 className="text-xl font-bold font-sans mb-3 flex items-center gap-2">
          <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">3</span>
          Page Power
        </h3>
        <p className="mb-3 text-sm"><strong>What it measures:</strong> Strength of individual pages currently ranking (not domains).</p>
        <table className="w-full border-collapse mb-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Field</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Description</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">DataForSEO Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2 font-mono text-xs">pageRankAvgTop10</td>
              <td className="border border-gray-300 px-3 py-2">Average page-level rank of Top 10</td>
              <td className="border border-gray-300 px-3 py-2 font-mono text-xs">backlinks/summary/live (page) → rank</td>
            </tr>
          </tbody>
        </table>
        <div className="code-block bg-gray-100 border border-gray-300 rounded p-4 mb-6 font-mono text-sm">
          PagePowerScore = pageRankAvgTop10
        </div>

        {/* Final Difficulty Score */}
        <h2 className="text-2xl font-bold font-sans mt-10 mb-4">Final Difficulty Score</h2>
        <p className="mb-4 text-sm">The main 0–100 score combining all three categories with <strong>equal weights</strong>:</p>
        <div className="code-block bg-yellow-50 border-2 border-yellow-400 rounded p-5 mb-6 font-mono text-base text-center font-semibold">
          DifficultyScore = (DomainPowerScore × 0.33) + (BacklinksScore × 0.33) + (PagePowerScore × 0.33)
        </div>
        <p className="text-sm mb-8">Result: Always 0–100 where <strong>0 = very easy</strong> and <strong>100 = extremely hard</strong>.</p>

        {/* Difficulty Labels */}
        <h2 className="text-2xl font-bold font-sans mt-10 mb-4">Difficulty Labels <span className="text-gray-400 font-normal text-base">(6-Scale Model)</span></h2>
        <table className="w-72 border-collapse mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Range</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Label</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['0 – 15', 'very_easy', 'bg-green-50'],
              ['16 – 35', 'easy', 'bg-green-50'],
              ['36 – 50', 'medium', 'bg-yellow-50'],
              ['51 – 65', 'challenging', 'bg-orange-50'],
              ['66 – 80', 'hard', 'bg-red-50'],
              ['81 – 100', 'extreme', 'bg-red-100'],
            ].map(([range, label, bg], i) => (
              <tr key={i} className={bg}>
                <td className="border border-gray-300 px-3 py-2">{range}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono font-semibold">{label}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Recommended Site Type */}
        <h2 className="text-2xl font-bold font-sans mt-10 mb-4">Recommended Site Type</h2>
        <p className="mb-3 text-sm">Based <strong>only</strong> on the final difficulty score:</p>
        <table className="w-full border-collapse mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Condition</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Recommendation</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Difficulty ≤ 35', 'small_site', '1–4 pages'],
              ['Difficulty ≤ 65', 'mini_site', 'Up to 10 pages'],
              ['Difficulty > 65', 'authority_blog', 'Full authority site'],
            ].map(([cond, rec, desc], i) => (
              <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="border border-gray-300 px-3 py-2">{cond}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono font-semibold">{rec}</td>
                <td className="border border-gray-300 px-3 py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* API Endpoints Reference */}
        <h2 className="text-2xl font-bold font-sans mt-10 mb-4">DataForSEO API Endpoints Reference</h2>
        <table className="w-full border-collapse mb-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Data</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Endpoint</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-sans">Field Path</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Keyword suggestions, volume, CPC, competition, intents', 'dataforseo_labs/keyword_suggestions/live', 'search_volume, cpc, competition, search_intent_info'],
              ['Keyword difficulty (KD)', 'dataforseo_labs/bulk_keyword_difficulty/live', 'keyword_difficulty'],
              ['Domain Rank', 'backlinks/summary/live (domain-level)', 'rank (with rank_scale: "one_hundred")'],
              ['Page Rank', 'backlinks/summary/live (page-level)', 'rank (with rank_scale: "one_hundred")'],
              ['Referring domains (dofollow)', 'backlinks/summary/live', 'referring_domains, referring_domains_nofollow'],
              ['Referring domains traffic', 'backlinks/referring_domains/live', 'organic_traffic (aggregated)'],
              ['SERP results (Top 10)', 'serp/google/organic/live/regular', 'items[] → URLs for backlink lookups'],
            ].map(([data, endpoint, field], i) => (
              <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="border border-gray-300 px-3 py-2">{data}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{endpoint}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{field}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="code-block bg-gray-100 border border-gray-300 rounded p-4 mb-8 font-mono text-sm">
          <p className="text-gray-600 mb-1">// All backlinks/summary/live calls must include:</p>
          <p>{'{ "rank_scale": "one_hundred" }'}</p>
        </div>

        {/* Data Flow */}
        <h2 className="text-2xl font-bold font-sans mt-10 mb-4">Data Flow</h2>
        <div className="code-block bg-gray-50 border border-gray-300 rounded p-5 mb-8 font-mono text-sm leading-7">
          <div>1. User enters seed keyword + country + pre-search filters</div>
          <div className="ml-6 text-gray-500">(limit, min volume, must-include words)</div>
          <div className="mt-2 ml-4">→ dataforseo_labs/keyword_suggestions/live</div>
          <div className="ml-6 text-gray-500">Params: keyword, location_code, language_code, limit, filters</div>
          <div className="ml-6 text-gray-500">Returns: keyword suggestions with volume, cpc, competition, intents</div>
          <div className="mt-2">2. Client-side: apply "must include words" filter</div>
          <div className="mt-2">3. → dataforseo_labs/bulk_keyword_difficulty/live</div>
          <div className="ml-6 text-gray-500">Returns: KD score per keyword</div>
          <div className="mt-2">4. User selects keywords for deep analysis</div>
          <div className="mt-2">5. → serp/google/organic/live/regular</div>
          <div className="ml-6 text-gray-500">Returns: Top 10 URLs for the keyword</div>
          <div className="mt-2">6. For each Top 10 URL:</div>
          <div className="ml-4">→ backlinks/summary/live (page-level, rank_scale: "one_hundred")</div>
          <div className="ml-6 text-gray-500">Returns: page rank, referring domains</div>
          <div className="ml-4 mt-1">→ backlinks/summary/live (domain-level, rank_scale: "one_hundred")</div>
          <div className="ml-6 text-gray-500">Returns: domain rank</div>
          <div className="ml-4 mt-1">→ backlinks/referring_domains/live</div>
          <div className="ml-6 text-gray-500">Returns: referring domains with traffic data</div>
          <div className="mt-2">7. Aggregate metrics → compute 3 category scores → final DifficultyScore</div>
        </div>

        {/* Footer */}
        <hr className="border-gray-300 mt-10 mb-4" />
        <p className="text-center text-gray-400 text-xs">Keyword Analysis Methodology — DataForSEO Integration</p>
      </div>
    </>
  );
};

export default Methodology;
