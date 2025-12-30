
import { useState } from 'react';
import { Website } from '@/types/website';
import { BulkOperationResult } from '@/types/bulkActions';
import { useToast } from '@/hooks/use-toast';
import { simulateApiCall, createOperationResult, generateRandomResults } from '@/utils/bulkOperationUtils';

export const useBulkKeywordUpdate = () => {
  const { toast } = useToast();

  const execute = async (
    websites: Website[], 
    selectedWebsites: string[],
    setResults: (results: BulkOperationResult[]) => void,
    setIsProcessing: (processing: boolean) => void
  ) => {
    setIsProcessing(true);
    const selectedSites = websites.filter(w => selectedWebsites.includes(w.id));
    
    toast({
      title: "AI Keyword Update Started",
      description: `Processing ${selectedSites.length} websites...`,
    });

    const newResults: BulkOperationResult[] = [];

    for (const website of selectedSites) {
      try {
        const success = await simulateApiCall(1500);
        const result = success ? generateRandomResults.keywordUpdate() : undefined;
        
        newResults.push(createOperationResult(
          website,
          '',
          success,
          result,
          !success ? 'Failed to update keywords' : undefined
        ));
      } catch (error) {
        newResults.push(createOperationResult(
          website,
          '',
          false,
          undefined,
          'Network error occurred'
        ));
      }
    }

    setResults(newResults);
    setIsProcessing(false);

    const successCount = newResults.filter(r => r.status === 'success').length;
    toast({
      title: "AI Keyword Update Complete",
      description: `${successCount} of ${selectedSites.length} websites updated successfully.`,
      variant: successCount === selectedSites.length ? 'default' : 'destructive'
    });
  };

  return { execute };
};
