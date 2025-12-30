import { CreatedWebsite } from './websiteCreation';

export interface BulkKeywordEntry {
  id: string;
  keyword: string;
  geo: string;
  domain?: string;
  domainStatus: 'pending' | 'available' | 'taken' | 'generated';
}

export interface LeadFormDistribution {
  leadFormId: string;
  leadFormName: string;
  percentage: number;
}

export interface SchedulingConfig {
  mode: 'immediate' | 'per_days' | 'distribute_month';
  sitesPerInterval?: number;
  intervalDays?: number;
  totalDays?: number;
}

export interface BulkCreationJob {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  keywords: BulkKeywordEntry[];
  domainMode: 'manual' | 'auto';
  tld?: string;
  templateId: string;
  templateName: string;
  category: string;
  leadFormDistribution: LeadFormDistribution[];
  scheduling: SchedulingConfig;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  nextCreationAt?: string;
  progress: {
    completed: number;
    total: number;
    currentKeyword?: string;
  };
  createdWebsites: CreatedWebsite[];
}

export interface BulkCreationData {
  keywords: BulkKeywordEntry[];
  domainMode: 'manual' | 'auto';
  tld: string;
  templateId: string;
  templateName: string;
  category: string;
  leadFormDistribution: LeadFormDistribution[];
  scheduling: SchedulingConfig;
}

export const TLD_OPTIONS = [
  { value: '.com', label: '.com' },
  { value: '.ca', label: '.ca (Canada)' },
  { value: '.net', label: '.net' },
  { value: '.io', label: '.io' },
  { value: '.co', label: '.co' },
  { value: '.org', label: '.org' },
  { value: '.us', label: '.us (USA)' },
  { value: '.uk', label: '.uk (UK)' },
  { value: '.au', label: '.au (Australia)' },
];

export const BULK_WIZARD_STEPS = [
  { id: 1, title: 'Keywords', description: 'Add keywords and GEO' },
  { id: 2, title: 'Domains', description: 'Configure domain settings' },
  { id: 3, title: 'Template', description: 'Choose template and category' },
  { id: 4, title: 'Lead Forms', description: 'Distribute lead forms' },
  { id: 5, title: 'Scheduling', description: 'Set creation schedule' },
  { id: 6, title: 'Review', description: 'Confirm and start' },
];
