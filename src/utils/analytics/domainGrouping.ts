
import { WebsitePerformance, DomainGroup } from '@/types/analytics';

export const groupWebsitesByDomain = (websites: WebsitePerformance[]): DomainGroup[] => {
  const domainMap = new Map<string, WebsitePerformance[]>();
  
  websites.forEach(website => {
    const domain = website.domain.split('.').slice(-2).join('.');
    if (!domainMap.has(domain)) {
      domainMap.set(domain, []);
    }
    domainMap.get(domain)!.push(website);
  });

  return Array.from(domainMap.entries()).map(([domain, websites]) => ({
    domain,
    websites,
    totalTraffic: websites.reduce((sum, w) => sum + w.traffic, 0),
    avgSeoScore: Math.round(websites.reduce((sum, w) => sum + w.seoScore, 0) / websites.length)
  }));
};
