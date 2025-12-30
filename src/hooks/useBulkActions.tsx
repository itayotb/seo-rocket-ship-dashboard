
import { useState } from 'react';
import { Website } from '@/types/website';
import { BulkActionsHook, BulkOperationResult } from '@/types/bulkActions';
import { useBulkStatusCheck } from '@/hooks/bulkOperations/useBulkStatusCheck';
import { useBulkSpeedTest } from '@/hooks/bulkOperations/useBulkSpeedTest';
import { useBulkSeoAnalysis } from '@/hooks/bulkOperations/useBulkSeoAnalysis';
import { useBulkPlagiarismScan } from '@/hooks/bulkOperations/useBulkPlagiarismScan';
import { useBulkKeywordUpdate } from '@/hooks/bulkOperations/useBulkKeywordUpdate';
import { useBulkParameterCheck } from '@/hooks/bulkOperations/useBulkParameterCheck';

export const useBulkActions = (): BulkActionsHook => {
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BulkOperationResult[]>([]);

  // Initialize operation hooks
  const statusCheck = useBulkStatusCheck();
  const speedTest = useBulkSpeedTest();
  const seoAnalysis = useBulkSeoAnalysis();
  const plagiarismScan = useBulkPlagiarismScan();
  const keywordUpdate = useBulkKeywordUpdate();
  const parameterCheck = useBulkParameterCheck();

  const toggleSelection = (websiteId: string) => {
    setSelectedWebsites(prev => 
      prev.includes(websiteId)
        ? prev.filter(id => id !== websiteId)
        : [...prev, websiteId]
    );
  };

  const selectAll = (websites: Website[]) => {
    setSelectedWebsites(websites.map(w => w.id));
  };

  const clearSelection = () => {
    setSelectedWebsites([]);
  };

  const checkAllParameters = async (websites: Website[]) => {
    await parameterCheck.execute(websites, selectedWebsites, setResults, setIsProcessing);
  };

  const bulkKeywordUpdate = async (websites: Website[]) => {
    await keywordUpdate.execute(websites, selectedWebsites, setResults, setIsProcessing);
  };

  const bulkPlagiarismScan = async (websites: Website[]) => {
    await plagiarismScan.execute(websites, selectedWebsites, setResults, setIsProcessing);
  };

  const bulkSpeedTest = async (websites: Website[]) => {
    await speedTest.execute(websites, selectedWebsites, setResults, setIsProcessing);
  };

  const bulkSeoAnalysis = async (websites: Website[]) => {
    await seoAnalysis.execute(websites, selectedWebsites, setResults, setIsProcessing);
  };

  const bulkStatusCheck = async (websites: Website[]) => {
    await statusCheck.execute(websites, selectedWebsites, setResults, setIsProcessing);
  };

  return {
    selectedWebsites,
    isProcessing,
    results,
    toggleSelection,
    selectAll,
    clearSelection,
    checkAllParameters,
    bulkKeywordUpdate,
    bulkPlagiarismScan,
    bulkSpeedTest,
    bulkSeoAnalysis,
    bulkStatusCheck
  };
};

// Re-export the interface for backward compatibility
export type { BulkOperationResult } from '@/types/bulkActions';
