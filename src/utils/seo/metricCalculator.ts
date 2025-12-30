import { ContentItem } from '@/types/website';
import { SeoMetric } from '@/types/seo';
import { checkSitemapStatus } from './sitemapChecker';
import { checkRobotsStatus } from './robotsChecker';

export const calculateSeoMetrics = (item: ContentItem): SeoMetric[] => {
  return [
    {
      label: 'Title Length',
      value: item.title.length,
      target: '30-60 chars',
      status: item.title.length >= 30 && item.title.length <= 60 ? 'good' : 'warning',
      improvement: item.title.length < 30 ? 'Add more descriptive keywords' : item.title.length > 60 ? 'Shorten while keeping key terms' : undefined
    },
    {
      label: 'Meta Description',
      value: item.metaDescription.length,
      target: '120-160 chars',
      status: item.metaDescription.length >= 120 && item.metaDescription.length <= 160 ? 'good' : 'warning',
      improvement: item.metaDescription.length < 120 ? 'Expand with compelling details' : item.metaDescription.length > 160 ? 'Trim to avoid truncation' : undefined
    },
    {
      label: 'Word Count',
      value: item.wordCount,
      target: '300+ words',
      status: item.wordCount >= 300 ? 'good' : item.wordCount >= 150 ? 'warning' : 'critical',
      improvement: item.wordCount < 300 ? 'Add more detailed content' : undefined
    },
    {
      label: 'Reading Time',
      value: `${Math.ceil(item.wordCount / 200)} min`,
      target: '2-8 min',
      status: 'good'
    }
  ];
};

export const calculateWebsiteSeoMetrics = async (domain: string): Promise<SeoMetric[]> => {
  const [sitemapResult, robotsResult] = await Promise.all([
    checkSitemapStatus(domain),
    checkRobotsStatus(domain)
  ]);
  
  return [
    {
      label: 'Sitemap Status',
      value: sitemapResult.isAvailable ? 'Available' : 'Not Found',
      target: 'Available & Updated',
      status: sitemapResult.status,
      improvement: sitemapResult.recommendations.length > 0 ? sitemapResult.recommendations[0] : undefined
    },
    {
      label: 'Robots.txt Status',
      value: robotsResult.isBlocking ? 'Blocking Bots' : 'Allowing Crawlers',
      target: 'Allowing Search Engines',
      status: robotsResult.status,
      improvement: robotsResult.recommendations.length > 0 ? robotsResult.recommendations[0] : undefined
    }
  ];
};
