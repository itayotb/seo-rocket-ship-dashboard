
export type SeoIssueSeverity = 'critical' | 'warning' | 'info';
export type SeoIssueCategory = 'title' | 'meta' | 'content' | 'structure';

export interface SeoIssue {
  id: string;
  category: SeoIssueCategory;
  severity: SeoIssueSeverity;
  title: string;
  description: string;
  recommendation: string;
  impact: string;
  canAutoFix?: boolean;
  autoFixAction?: () => Promise<void>;
  navigateToFix?: () => void;
  quickFix?: {
    label: string;
    action: () => void;
  };
}

export interface SeoMetric {
  label: string;
  value: number | string;
  target: number | string;
  status: 'good' | 'warning' | 'critical';
  improvement?: string;
}
