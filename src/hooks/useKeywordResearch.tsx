
import { useState, useCallback } from 'react';
import { 
  KeywordRow, 
  RawKeywordData, 
  FiltersState, 
  defaultFilters,
  IntentType,
  BrandType,
  LocationType,
  AnalyzedKeyword
} from '@/types/keywordResearch';

const parseIntentsRaw = (intentsRaw: string): { 
  intentTypes: IntentType[]; 
  brandType: BrandType; 
  locationType: LocationType;
} => {
  const parts = intentsRaw.split(',').map(p => p.trim());
  
  const intentTypes: IntentType[] = [];
  let brandType: BrandType = 'Non-branded';
  let locationType: LocationType = 'Non-local';

  parts.forEach(part => {
    if (['Informational', 'Commercial', 'Transactional', 'Navigational'].includes(part)) {
      intentTypes.push(part as IntentType);
    } else if (part === 'Branded' || part === 'Non-branded') {
      brandType = part as BrandType;
    } else if (part === 'Local' || part === 'Non-local') {
      locationType = part as LocationType;
    }
  });

  return { intentTypes, brandType, locationType };
};

const parseRawData = (rawData: RawKeywordData[]): KeywordRow[] => {
  return rawData.map(row => {
    const { intentTypes, brandType, locationType } = parseIntentsRaw(row.intentsRaw);
    return {
      ...row,
      intentTypes,
      brandType,
      locationType,
    };
  });
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

  const applyFilters = useCallback((newFilters: FiltersState) => {
    setFilters(newFilters);
    
    let rows = [...allKeywords];

    // Volume filter
    if (newFilters.minVolume > 0) {
      rows = rows.filter(r => r.volume >= newFilters.minVolume);
    }

    // Intent filter
    if (newFilters.intentTypes.length > 0) {
      rows = rows.filter(r =>
        r.intentTypes.some(intent => newFilters.intentTypes.includes(intent))
      );
    }

    // Branding filter
    if (newFilters.branding === "Branded") {
      rows = rows.filter(r => r.brandType === "Branded");
    } else if (newFilters.branding === "Non-branded") {
      rows = rows.filter(r => r.brandType === "Non-branded");
    }

    // Location filter
    if (newFilters.location === "Local") {
      rows = rows.filter(r => r.locationType === "Local");
    } else if (newFilters.location === "Non-local") {
      rows = rows.filter(r => r.locationType === "Non-local");
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
    // Clear selections that are no longer in filtered results
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
    loadDemoData,
    applyFilters,
    toggleSelection,
    selectAll,
    clearSelection,
    analyzeSelected,
    closeAnalysis,
  };
};
