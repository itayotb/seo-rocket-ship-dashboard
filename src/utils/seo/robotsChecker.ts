
export interface RobotsCheckResult {
  isBlocking: boolean;
  status: 'good' | 'warning' | 'critical';
  url?: string;
  lastChecked: string;
  issues: string[];
  recommendations: string[];
  userAgentRules: {
    userAgent: string;
    isAllowed: boolean;
    rules: string[];
  }[];
}

export const checkRobotsStatus = async (domain: string): Promise<RobotsCheckResult> => {
  const robotsUrls = [
    `https://${domain}/robots.txt`,
    `https://www.${domain}/robots.txt`
  ];

  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Mock robots.txt check - in a real app, this would make actual HTTP requests
  // For demo purposes, we'll simulate different scenarios
  const mockRobotsExists = Math.random() > 0.2; // 80% chance robots.txt exists
  
  if (!mockRobotsExists) {
    issues.push('No robots.txt file found');
    recommendations.push('Create a robots.txt file to guide search engine crawlers');
    recommendations.push('Ensure your robots.txt allows important pages to be crawled');
    
    return {
      isBlocking: false, // No robots.txt means not blocking
      status: 'warning',
      lastChecked: new Date().toISOString(),
      issues,
      recommendations,
      userAgentRules: []
    };
  }

  // If robots.txt exists, check for potential blocking issues
  const isBlockingBots = Math.random() > 0.85; // 15% chance of blocking search engines
  const hasIssues = Math.random() > 0.7; // 30% chance of minor issues
  
  const userAgentRules = [
    {
      userAgent: 'Googlebot',
      isAllowed: !isBlockingBots,
      rules: isBlockingBots ? ['Disallow: /'] : ['Allow: /']
    },
    {
      userAgent: 'Bingbot',
      isAllowed: !isBlockingBots,
      rules: isBlockingBots ? ['Disallow: /'] : ['Allow: /']
    },
    {
      userAgent: '*',
      isAllowed: !isBlockingBots,
      rules: isBlockingBots ? ['Disallow: /'] : ['Allow: /']
    }
  ];

  if (isBlockingBots) {
    issues.push('Robots.txt is blocking search engine crawlers');
    recommendations.push('Review robots.txt rules to ensure search engines can access your content');
    recommendations.push('Consider allowing specific user agents like Googlebot and Bingbot');
  }
  
  if (hasIssues && !isBlockingBots) {
    issues.push('Some optimization opportunities found in robots.txt');
    recommendations.push('Add sitemap reference to robots.txt');
    recommendations.push('Optimize crawl delay settings if present');
  }

  const status: 'good' | 'warning' | 'critical' = 
    isBlockingBots ? 'critical' :
    issues.length === 0 ? 'good' : 'warning';

  return {
    isBlocking: isBlockingBots,
    status,
    url: robotsUrls[0],
    lastChecked: new Date().toISOString(),
    issues,
    recommendations,
    userAgentRules
  };
};
