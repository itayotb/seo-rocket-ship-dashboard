
import { useState, useCallback } from 'react';
import { 
  KeywordRow, 
  RawKeywordData, 
  FiltersState, 
  defaultFilters,
  IntentType,
  AnalyzedKeyword
} from '@/types/keywordResearch';

const parseIntentsRaw = (intentsRaw: string): IntentType[] => {
  const parts = intentsRaw.split(',').map(p => p.trim());
  return parts.filter(part =>
    ['Informational', 'Commercial', 'Transactional', 'Navigational'].includes(part)
  ) as IntentType[];
};

const parseRawData = (rawData: RawKeywordData[]): KeywordRow[] => {
  return rawData.map(row => ({
    ...row,
    intentTypes: parseIntentsRaw(row.intentsRaw),
  }));
};

export const useKeywordResearch = () => {
  const [allKeywords, setAllKeywords] = useState<KeywordRow[]>([]);
  const [filteredKeywords, setFilteredKeywords] = useState<KeywordRow[]>([]);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalyzedKeyword[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCountry, setSearchCountry] = useState('ca');
  const [searchLanguage, setSearchLanguage] = useState('en');

  const loadDemoData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/data/car_loans_ca_demo.json');
      const rawData: RawKeywordData[] = await res.json();
      const parsedKeywords = parseRawData(rawData);
      setAllKeywords(parsedKeywords);
      setFilteredKeywords(parsedKeywords);
      setIsLoaded(true);
      setSelectedIds([]);
      setAnalysisResults([]);
      setShowAnalysis(false);
    } catch (error) {
      console.error('Failed to load demo data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Placeholder for real API search - will call edge function when Cloud is enabled
  const searchKeywords = useCallback(async (keyword: string, country: string, language: string, preFilters?: { limit: number; minVolume: number; noVolumeFilter: boolean; includeKeywords: string }) => {
    setSearchKeyword(keyword);
    setSearchCountry(country);
    setSearchLanguage(language);
    setIsLoading(true);
    try {
      const res = await fetch('/data/car_loans_ca_demo.json');
      const rawData: RawKeywordData[] = await res.json();
      let parsedKeywords = parseRawData(rawData);

      // Apply pre-search filters (mock of server-side filtering)
      if (preFilters) {
        // Volume filter
        if (!preFilters.noVolumeFilter && preFilters.minVolume > 0) {
          parsedKeywords = parsedKeywords.filter(k => k.volume >= preFilters.minVolume);
        }

        // Include keywords filter
        if (preFilters.includeKeywords.trim()) {
          const raw = preFilters.includeKeywords.trim();
          const exactMatch = raw.match(/^"(.+)"$/);
          if (exactMatch) {
            const phrase = exactMatch[1].toLowerCase();
            parsedKeywords = parsedKeywords.filter(k => k.keyword.toLowerCase().includes(phrase));
          } else {
            const terms = raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
            if (terms.length > 0) {
              parsedKeywords = parsedKeywords.filter(k =>
                terms.some(term => k.keyword.toLowerCase().includes(term))
              );
            }
          }
        }

        // Limit
        if (preFilters.limit > 0) {
          parsedKeywords = parsedKeywords.slice(0, preFilters.limit);
        }
      }

      setAllKeywords(parsedKeywords);
      setFilteredKeywords(parsedKeywords);
      setIsLoaded(true);
      setSelectedIds([]);
      setAnalysisResults([]);
      setShowAnalysis(false);
    } catch (error) {
      console.error('Failed to search keywords:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyFilters = useCallback((newFilters: FiltersState) => {
    setFilters(newFilters);
    
    let rows = [...allKeywords];

    // Volume filter
    if (newFilters.minVolume > 0) {
      rows = rows.filter(r => r.volume >= newFilters.minVolume);
    }

    // Difficulty filter
    if (newFilters.minDifficulty > 0 || newFilters.maxDifficulty < 100) {
      rows = rows.filter(r => r.difficulty >= newFilters.minDifficulty && r.difficulty <= newFilters.maxDifficulty);
    }

    // CPC filter
    if (newFilters.minCpc > 0 || newFilters.maxCpc < 999) {
      rows = rows.filter(r => r.cpc >= newFilters.minCpc && r.cpc <= newFilters.maxCpc);
    }

    // Competition filter
    if (newFilters.competition !== "all") {
      rows = rows.filter(r => r.competition === newFilters.competition);
    }

    // Intent filter
    if (newFilters.intentTypes.length > 0) {
      rows = rows.filter(r =>
        r.intentTypes.some(intent => newFilters.intentTypes.includes(intent))
      );
    }


    // Include terms filter
    if (newFilters.includeTerms.length > 0) {
      rows = rows.filter(r => {
        const kw = r.keyword.toLowerCase();
        if (newFilters.includeMode === "all") {
          return newFilters.includeTerms.every(term => kw.includes(term.toLowerCase()));
        } else {
          return newFilters.includeTerms.some(term => kw.includes(term.toLowerCase()));
        }
      });
    }

    setFilteredKeywords(rows);
    setSelectedIds(prev => prev.filter(id => rows.some(r => r.id === id)));
  }, [allKeywords]);

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(filteredKeywords.map(k => k.id));
  }, [filteredKeywords]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const analyzeSelected = useCallback(async () => {
    if (selectedIds.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      // Load demo analysis data
      const res = await fetch('/data/car_loans_ca_analyzed.json');
      const analyzedData: AnalyzedKeyword[] = await res.json();
      
      // Filter to only selected keywords
      const selectedResults = analyzedData.filter(item => selectedIds.includes(item.id));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAnalysisResults(selectedResults);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Failed to analyze keywords:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedIds]);

  const closeAnalysis = useCallback(() => {
    setShowAnalysis(false);
  }, []);

  return {
    allKeywords,
    filteredKeywords,
    filters,
    selectedIds,
    isLoading,
    isLoaded,
    isAnalyzing,
    analysisResults,
    showAnalysis,
    searchKeyword,
    searchCountry,
    searchLanguage,
    loadDemoData,
    searchKeywords,
    setSearchKeyword,
    setSearchCountry,
    setSearchLanguage,
    applyFilters,
    toggleSelection,
    selectAll,
    clearSelection,
    analyzeSelected,
    closeAnalysis,
  };
};
