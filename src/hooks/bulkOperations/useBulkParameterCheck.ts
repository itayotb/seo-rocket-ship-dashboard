
import { useState } from 'react';
import { Website } from '@/types/website';
import { BulkOperationResult } from '@/types/bulkActions';
import { useToast } from '@/hooks/use-toast';
import { simulateApiCall, createOperationResult, generateRandomResults, ALL_PARAMETER_OPERATIONS } from '@/utils/bulkOperationUtils';

export const useBulkParameterCheck = () => {
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
      title: "Complete Parameter Check Started",
      description: `Running all checks on ${selectedSites.length} websites...`,
    });

    const allResults: BulkOperationResult[] = [];

    // Run all operations sequentially for better UX
    for (const operation of ALL_PARAMETER_OPERATIONS) {
      toast({
        title: `Running ${operation.name}...`,
        description: `Processing ${selectedSites.length} websites`,
      });

      for (const website of selectedSites) {
        try {
          const success = await simulateApiCall(operation.delay);
          
          let result;
          switch (operation.name) {
            case 'Status Check':
              result = success ? generateRandomResults.statusCheck() : undefined;
              break;
            case 'Speed Test':
              result = success ? generateRandomResults.speedTest() : undefined;
              break;
            case 'SEO Analysis':
              result = success ? generateRandomResults.seoAnalysis() : undefined;
              break;
            case 'Plagiarism Scan':
              result = success ? generateRandomResults.plagiarismScan() : undefined;
              break;
            case 'AI Keyword Update':
              result = success ? generateRandomResults.keywordUpdate() : undefined;
              break;
          }

          allResults.push(createOperationResult(
            website,
            operation.name,
            success,
            result,
            !success ? `${operation.name} failed` : undefined
          ));
        } catch (error) {
          allResults.push(createOperationResult(
            website,
            operation.name,
            false,
            undefined,
            `${operation.name} error occurred`
          ));
        }
      }
    }

    setResults(allResults);
    setIsProcessing(false);

    const successCount = allResults.filter(r => r.status === 'success').length;
    const totalOperations = selectedSites.length * ALL_PARAMETER_OPERATIONS.length;
    
    toast({
      title: "Complete Parameter Check Finished",
      description: `${successCount} of ${totalOperations} operations completed successfully.`,
      variant: successCount === totalOperations ? 'default' : 'destructive'
    });
  };

  return { execute };
};
