
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'seo-overview' | 'keyword-performance' | 'website-health' | 'ranking-history' | 'competitor-analysis';
  icon: string;
  includeCharts: boolean;
  defaultTimeframe: '7d' | '30d' | '90d' | '1y';
}

export interface ReportFilters {
  timeframe: '7d' | '30d' | '90d' | '1y';
  websites: string[];
  keywords?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ReportData {
  id: string;
  name: string;
  template: ReportTemplate;
  filters: ReportFilters;
  generatedAt: Date;
  status: 'generating' | 'ready' | 'failed';
  downloadUrls?: {
    pdf?: string;
    csv?: string;
  };
}

export interface HistoricalRankingData {
  date: string;
  keyword: string;
  position: number;
  website: string;
  url: string;
  clicks: number;
  impressions: number;
}

export interface KeywordPerformanceHistory {
  keyword: string;
  website: string;
  data: {
    date: string;
    position: number;
    clicks: number;
    impressions: number;
    ctr: number;
  }[];
}
