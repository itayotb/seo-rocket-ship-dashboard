
import { BulkOperationResult, BulkOperationConfig } from '@/types/bulkActions';
import { Website } from '@/types/website';

export const simulateApiCall = (delay: number = 2000): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      resolve(Math.random() > 0.1);
    }, delay);
  });
};

export const createOperationResult = (
  website: Website,
  operationName: string,
  success: boolean,
  result?: any,
  error?: string
): BulkOperationResult => ({
  websiteId: website.id,
  websiteName: `${website.name}${operationName ? ` - ${operationName}` : ''}`,
  status: success ? 'success' : 'error',
  result: success ? result : undefined,
  error: !success ? (error || `${operationName} failed`) : undefined
});

export const generateRandomResults = {
  statusCheck: () => ({
    isOnline: Math.random() > 0.1,
    responseTime: Math.floor(Math.random() * 2000) + 200,
    statusCode: Math.random() > 0.1 ? 200 : 404
  }),
  
  speedTest: () => ({
    mobileSpeed: Math.floor(Math.random() * 40) + 60,
    desktopSpeed: Math.floor(Math.random() * 30) + 70
  }),
  
  seoAnalysis: () => ({
    seoScore: Math.floor(Math.random() * 40) + 60,
    issuesFound: Math.floor(Math.random() * 10),
    recommendations: Math.floor(Math.random() * 5) + 2
  }),
  
  plagiarismScan: () => ({
    uniqueContent: Math.floor(Math.random() * 30) + 70,
    pagesScanned: Math.floor(Math.random() * 50) + 10
  }),
  
  keywordUpdate: () => ({
    keywordsAdded: Math.floor(Math.random() * 20) + 5
  })
};

export const ALL_PARAMETER_OPERATIONS: BulkOperationConfig[] = [
  { name: 'Status Check', delay: 1000 },
  { name: 'Speed Test', delay: 3000 },
  { name: 'SEO Analysis', delay: 2500 },
  { name: 'Plagiarism Scan', delay: 2000 },
  { name: 'AI Keyword Update', delay: 1500 }
];
