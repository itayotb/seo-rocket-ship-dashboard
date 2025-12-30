import { BulkCreationJob, BulkKeywordEntry, TemplateDistribution, RegistrarDistribution, LeadFormDistribution } from '@/types/bulkWebsiteCreation';
import { CreatedWebsite } from '@/types/websiteCreation';

export function calculateCompletionEstimate(
  totalSites: number,
  scheduling: { mode: string; sitesPerInterval?: number; intervalDays?: number; totalDays?: number }
): { days: number; completionDate: Date } {
  const now = new Date();
  let days = 0;

  switch (scheduling.mode) {
    case 'immediate':
      days = Math.ceil(totalSites / 10); // Assume 10 sites per day max
      break;
    case 'per_days':
      if (scheduling.sitesPerInterval && scheduling.intervalDays) {
        days = Math.ceil((totalSites / scheduling.sitesPerInterval) * scheduling.intervalDays);
      }
      break;
    case 'distribute_month':
      days = scheduling.totalDays || 30;
      break;
    default:
      days = totalSites;
  }

  const completionDate = new Date(now);
  completionDate.setDate(completionDate.getDate() + days);

  return { days, completionDate };
}

export function calculateDailyRate(
  totalSites: number,
  totalDays: number
): number {
  return Math.ceil(totalSites / totalDays);
}

export function getNextCreationDate(
  job: BulkCreationJob,
  lastCreatedAt?: Date
): Date {
  const now = lastCreatedAt || new Date();
  const next = new Date(now);

  switch (job.scheduling.mode) {
    case 'immediate':
      // Next one in a few seconds (simulated)
      next.setSeconds(next.getSeconds() + 3);
      break;
    case 'per_days':
      if (job.scheduling.intervalDays && job.scheduling.sitesPerInterval) {
        // Calculate based on interval
        const sitesInCurrentInterval = job.progress.completed % job.scheduling.sitesPerInterval;
        if (sitesInCurrentInterval === 0 && job.progress.completed > 0) {
          next.setDate(next.getDate() + job.scheduling.intervalDays);
        }
      }
      break;
    case 'distribute_month':
      const totalDays = job.scheduling.totalDays || 30;
      const dailyRate = Math.ceil(job.keywords.length / totalDays);
      const sitesToday = job.progress.completed % dailyRate;
      if (sitesToday === 0 && job.progress.completed > 0) {
        next.setDate(next.getDate() + 1);
      }
      break;
  }

  return next;
}

export function simulateWebsiteCreation(
  keyword: BulkKeywordEntry,
  templateId: string,
  templateName: string,
  category: string,
  leadFormId: string
): Promise<CreatedWebsite> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const website: CreatedWebsite = {
        id: `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: keyword.keyword,
        domain: keyword.domain || `${keyword.keyword.replace(/\s+/g, '')}.com`,
        template: {
          id: templateId,
          name: templateName,
          description: 'Bulk created template',
          category: category,
          preview: '/placeholder.svg',
          features: [],
          pages: [],
        },
        keywords: [keyword.keyword],
        pages: [
          {
            id: '1',
            name: 'Home',
            type: 'home',
            content: '',
            seoTitle: keyword.keyword,
            seoDescription: `${keyword.keyword} - ${keyword.geo}`,
          },
          {
            id: '2',
            name: 'About',
            type: 'about',
            content: '',
            seoTitle: `About - ${keyword.keyword}`,
            seoDescription: `About ${keyword.keyword}`,
          },
          {
            id: '3',
            name: 'Contact',
            type: 'contact',
            content: '',
            seoTitle: `Contact - ${keyword.keyword}`,
            seoDescription: `Contact us about ${keyword.keyword}`,
          },
        ],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resolve(website);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds
  });
}

export function distributeLeadForms(
  keywords: BulkKeywordEntry[],
  distribution: LeadFormDistribution[]
): Map<string, string> {
  const result = new Map<string, string>();
  const sortedDistribution = [...distribution].sort((a, b) => b.percentage - a.percentage);
  
  let currentIndex = 0;
  
  for (const dist of sortedDistribution) {
    const count = Math.round((dist.percentage / 100) * keywords.length);
    for (let i = 0; i < count && currentIndex < keywords.length; i++) {
      result.set(keywords[currentIndex].id, dist.leadFormId);
      currentIndex++;
    }
  }
  
  while (currentIndex < keywords.length) {
    result.set(keywords[currentIndex].id, sortedDistribution[0]?.leadFormId || '');
    currentIndex++;
  }
  
  return result;
}

export function distributeTemplates(
  keywords: BulkKeywordEntry[],
  distribution: TemplateDistribution[]
): Map<string, { templateId: string; templateName: string }> {
  const result = new Map<string, { templateId: string; templateName: string }>();
  const sortedDistribution = [...distribution].sort((a, b) => b.percentage - a.percentage);
  
  let currentIndex = 0;
  
  for (const dist of sortedDistribution) {
    const count = Math.round((dist.percentage / 100) * keywords.length);
    for (let i = 0; i < count && currentIndex < keywords.length; i++) {
      result.set(keywords[currentIndex].id, { templateId: dist.templateId, templateName: dist.templateName });
      currentIndex++;
    }
  }
  
  while (currentIndex < keywords.length) {
    const first = sortedDistribution[0];
    result.set(keywords[currentIndex].id, { 
      templateId: first?.templateId || '', 
      templateName: first?.templateName || '' 
    });
    currentIndex++;
  }
  
  return result;
}

export function distributeRegistrars(
  keywords: BulkKeywordEntry[],
  distribution: RegistrarDistribution[]
): Map<string, string> {
  const result = new Map<string, string>();
  
  if (distribution.length === 0) {
    return result;
  }
  
  const sortedDistribution = [...distribution].sort((a, b) => b.percentage - a.percentage);
  
  let currentIndex = 0;
  
  for (const dist of sortedDistribution) {
    const count = Math.round((dist.percentage / 100) * keywords.length);
    for (let i = 0; i < count && currentIndex < keywords.length; i++) {
      result.set(keywords[currentIndex].id, dist.registrarId);
      currentIndex++;
    }
  }
  
  while (currentIndex < keywords.length) {
    result.set(keywords[currentIndex].id, sortedDistribution[0]?.registrarId || '');
    currentIndex++;
  }
  
  return result;
}
