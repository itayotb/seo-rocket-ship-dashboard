
import { useState } from 'react';
import { Website } from '@/types/website';
import { BulkOperationResult } from '@/types/bulkActions';
import { useToast } from '@/hooks/use-toast';
import { simulateApiCall, createOperationResult, generateRandomResults } from '@/utils/bulkOperationUtils';

export const useBulkPlagiarismScan = () => {
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
      title: "Plagiarism Scan Started",
      description: `Scanning ${selectedSites.length} websites...`,
    });

    const newResults: BulkOperationResult[] = [];

    for (const website of selectedSites) {
      try {
        const success = await simulateApiCall(2000);
        const result = success ? generateRandomResults.plagiarismScan() : undefined;
        
        newResults.push(createOperationResult(
          website,
          '',
          success,
          result,
          !success ? 'Scan failed' : undefined
        ));
      } catch (error) {
        newResults.push(createOperationResult(
          website,
          '',
          false,
          undefined,
          'Scan timeout'
        ));
      }
    }

    setResults(newResults);
    setIsProcessing(false);

    const successCount = newResults.filter(r => r.status === 'success').length;
    toast({
      title: "Plagiarism Scan Complete",
      description: `${successCount} of ${selectedSites.length} websites scanned successfully.`,
      variant: successCount === selectedSites.length ? 'default' : 'destructive'
    });
  };

  return { execute };
};
