
import { QueryPerformance, PagePerformance, CountryPerformance, DevicePerformance } from '@/types/searchConsole';
import { getSearchConsoleDataForPeriod } from './mockData';
import { DrillDownContext } from '@/hooks/useSearchConsole';

export const getTopQueriesFromData = (
  queries: QueryPerformance[], 
  limit: number = 10
): QueryPerformance[] => {
  return queries.slice(0, limit);
};

export const getTopPagesFromData = (
  pages: PagePerformance[], 
  limit: number = 10
): PagePerformance[] => {
  return pages.slice(0, limit);
};

export const getDrillDownData = (context: DrillDownContext, period: string = '28days') => {
  const baseData = getSearchConsoleDataForPeriod(period);
  
  // For drill-down, we simulate filtered data based on the selected query/page
  // In a real implementation, this would come from the API with filters applied
  
  if (context.type === 'query') {
    // Find the specific query data
    const queryData = baseData.performance.queries.find(q => q.query === context.value);
    if (!queryData) return null;

    // Simulate breakdown data for this specific query
    return {
      totalClicks: queryData.clicks,
      totalImpressions: queryData.impressions,
      averageCTR: queryData.ctr,
      averagePosition: queryData.position,
      countries: baseData.performance.countries.map(country => ({
        ...country,
        // Simulate proportional distribution
        clicks: Math.round(queryData.clicks * (country.clicks / baseData.performance.totalClicks)),
        impressions: Math.round(queryData.impressions * (country.impressions / baseData.performance.totalImpressions))
      })),
      devices: baseData.performance.devices.map(device => ({
        ...device,
        // Simulate proportional distribution
        clicks: Math.round(queryData.clicks * (device.clicks / baseData.performance.totalClicks)),
        impressions: Math.round(queryData.impressions * (device.impressions / baseData.performance.totalImpressions))
      })),
      pages: baseData.performance.pages.map(page => ({
        ...page,
        // Simulate how this query performs on different pages
        clicks: Math.round(queryData.clicks * 0.2 + Math.random() * queryData.clicks * 0.6),
        impressions: Math.round(queryData.impressions * 0.2 + Math.random() * queryData.impressions * 0.6),
        ctr: queryData.ctr + (Math.random() - 0.5) * 2,
        position: queryData.position + (Math.random() - 0.5) * 2
      })).sort((a, b) => b.clicks - a.clicks)
    };
  }

  if (context.type === 'page') {
    // Find the specific page data
    const pageData = baseData.performance.pages.find(p => p.page === context.value);
    if (!pageData) return null;

    // Simulate breakdown data for this specific page
    return {
      totalClicks: pageData.clicks,
      totalImpressions: pageData.impressions,
      averageCTR: pageData.ctr,
      averagePosition: pageData.position,
      countries: baseData.performance.countries.map(country => ({
        ...country,
        // Simulate proportional distribution
        clicks: Math.round(pageData.clicks * (country.clicks / baseData.performance.totalClicks)),
        impressions: Math.round(pageData.impressions * (country.impressions / baseData.performance.totalImpressions))
      })),
      devices: baseData.performance.devices.map(device => ({
        ...device,
        // Simulate proportional distribution  
        clicks: Math.round(pageData.clicks * (device.clicks / baseData.performance.totalClicks)),
        impressions: Math.round(pageData.impressions * (device.impressions / baseData.performance.totalImpressions))
      })),
      queries: baseData.performance.queries.map(query => ({
        ...query,
        // Simulate how different queries perform on this page
        clicks: Math.round(pageData.clicks * 0.1 + Math.random() * pageData.clicks * 0.8),
        impressions: Math.round(pageData.impressions * 0.1 + Math.random() * pageData.impressions * 0.8),
        ctr: pageData.ctr + (Math.random() - 0.5) * 3,
        position: pageData.position + (Math.random() - 0.5) * 3
      })).sort((a, b) => b.clicks - a.clicks)
    };
  }

  return null;
};
