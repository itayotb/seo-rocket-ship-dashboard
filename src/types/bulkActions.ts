
import { Website } from '@/types/website';

export interface BulkOperationResult {
  websiteId: string;
  websiteName: string;
  status: 'success' | 'error' | 'processing';
  result?: any;
  error?: string;
}

export interface BulkOperationConfig {
  name: string;
  delay: number;
}

export interface BulkActionsState {
  selectedWebsites: string[];
  isProcessing: boolean;
  results: BulkOperationResult[];
}

export interface BulkActionsHook extends BulkActionsState {
  toggleSelection: (websiteId: string) => void;
  selectAll: (websites: Website[]) => void;
  clearSelection: () => void;
  checkAllParameters: (websites: Website[]) => Promise<void>;
  bulkKeywordUpdate: (websites: Website[]) => Promise<void>;
  bulkPlagiarismScan: (websites: Website[]) => Promise<void>;
  bulkSpeedTest: (websites: Website[]) => Promise<void>;
  bulkSeoAnalysis: (websites: Website[]) => Promise<void>;
  bulkStatusCheck: (websites: Website[]) => Promise<void>;
}
