
export interface SearchConsoleData {
  performance: PerformanceData;
  pages: PageData[];
  sitemaps: SitemapData[];
  schemaMarkup: SchemaMarkupData[];
}

export interface PerformanceData {
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averagePosition: number;
  clicksChange: number;
  impressionsChange: number;
  ctrChange: number;
  positionChange: number;
  dateRange: string;
  queries: QueryPerformance[];
  pages: PagePerformance[];
  countries: CountryPerformance[];
  devices: DevicePerformance[];
}

export interface QueryPerformance {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PagePerformance {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CountryPerformance {
  country: string;
  countryCode: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface DevicePerformance {
  device: 'desktop' | 'mobile' | 'tablet';
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageData {
  url: string;
  title: string;
  errors: PageError[];
  warnings: PageWarning[];
  status: 'valid' | 'error' | 'warning';
  lastCrawled: string;
  indexingStatus: 'indexed' | 'not_indexed' | 'blocked' | 'pending';
  mobileUsability: 'good' | 'poor' | 'unknown';
}

export interface PageError {
  type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedPages: number;
}

export interface PageWarning {
  type: string;
  description: string;
  affectedPages: number;
}

export interface SitemapData {
  url: string;
  status: 'success' | 'error' | 'warning';
  submittedUrls: number;
  indexedUrls: number;
  lastSubmitted: string;
  errors: SitemapError[];
}

export interface SitemapError {
  type: string;
  description: string;
  count: number;
}

export interface SchemaMarkupData {
  type: string;
  status: 'valid' | 'error' | 'warning';
  validItems: number;
  errorItems: number;
  warningItems: number;
  issues: SchemaIssue[];
}

export interface SchemaIssue {
  type: string;
  severity: 'error' | 'warning';
  description: string;
  affectedItems: number;
}
