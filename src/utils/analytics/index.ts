
import { AnalyticsDashboardData, AnalyticsFilters } from '@/types/analytics';
import { generateKPIs } from './kpiData';
import { generateWebsitePerformance } from './websiteData';
import { generateTopKeywords } from './keywordData';
import { generateTimeSeriesData } from './timeSeriesData';
import { groupWebsitesByDomain } from './domainGrouping';
import { generateDomainsTableData } from './domainTableData';

export const getAnalyticsDashboardData = (filters?: AnalyticsFilters): AnalyticsDashboardData => {
  const websites = generateWebsitePerformance();
  
  // Filter websites by category if specified
  const filteredWebsites = filters?.category && filters.category !== 'all' 
    ? websites.filter(website => website.category === filters.category)
    : websites;
  
  const sortedBySeo = [...filteredWebsites].sort((a, b) => b.seoScore - a.seoScore);
  
  // Filter keywords by category if specified
  const allKeywords = generateTopKeywords();
  const filteredKeywords = filters?.category && filters.category !== 'all'
    ? allKeywords.filter(keyword => {
        // Match keywords to websites by domain
        const websiteDomain = keyword.websiteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        return filteredWebsites.some(website => website.domain === websiteDomain);
      })
    : allKeywords;
  
  // Filter domains table data by category if specified
  const allDomainsData = generateDomainsTableData();
  const filteredDomainsData = filters?.category && filters.category !== 'all'
    ? allDomainsData.filter(domainData => {
        return filteredWebsites.some(website => website.domain === domainData.domain);
      })
    : allDomainsData;
  
  // Filter time series data based on filtered websites
  const timeSeriesData = generateTimeSeriesData();
  const filteredTimeSeriesData = filters?.category && filters.category !== 'all'
    ? timeSeriesData.map(dataPoint => ({
        ...dataPoint,
        traffic: Math.round(dataPoint.traffic * (filteredWebsites.length / websites.length)),
        impressions: Math.round(dataPoint.impressions * (filteredWebsites.length / websites.length))
      }))
    : timeSeriesData;
  
  return {
    kpis: generateKPIs(),
    topPerformers: sortedBySeo.slice(0, 5),
    bottomPerformers: sortedBySeo.slice(-2),
    topKeywords: filteredKeywords.slice(0, 5),
    domainGroups: groupWebsitesByDomain(filteredWebsites),
    domainsTableData: filteredDomainsData,
    timeSeriesData: filteredTimeSeriesData,
    totalWebsites: filteredWebsites.length
  };
};

// Re-export individual functions for flexibility
export { generateKPIs } from './kpiData';
export { generateWebsitePerformance } from './websiteData';
export { generateTopKeywords } from './keywordData';
export { generateTimeSeriesData } from './timeSeriesData';
export { groupWebsitesByDomain } from './domainGrouping';
export { generateDomainsTableData } from './domainTableData';
