
export interface AnalyticsKPI {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  trend: number[];
  icon: string;
  color: string;
}

export interface WebsitePerformance {
  id: string;
  name: string;
  domain: string;
  seoScore: number;
  traffic: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

export interface KeywordPerformance {
  id: string;
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  trend: 'up' | 'down' | 'stable';
  websiteUrl: string;
}

export interface DomainGroup {
  domain: string;
  websites: WebsitePerformance[];
  totalTraffic: number;
  avgSeoScore: number;
}

export interface DomainTableData {
  domain: string;
  totalClicks: number;
  totalImpressions: number;
  ctr: number;
  websiteCount: number;
  lastUpdated: string;
}

export interface TimeSeriesData {
  date: string;
  traffic: number;
  impressions: number;
  seoScore: number;
}

export interface AnalyticsFilters {
  timeframe: '7d' | '30d' | '90d' | '1y';
  category?: string;
  domain?: string;
  performanceLevel?: 'top' | 'bottom' | 'all';
}

export interface AnalyticsDashboardData {
  kpis: AnalyticsKPI[];
  topPerformers: WebsitePerformance[];
  bottomPerformers: WebsitePerformance[];
  topKeywords: KeywordPerformance[];
  domainGroups: DomainGroup[];
  domainsTableData: DomainTableData[];
  timeSeriesData: TimeSeriesData[];
  totalWebsites: number;
}
