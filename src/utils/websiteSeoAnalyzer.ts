import { ContentItem } from '@/types/website';
import { analyzeSeoIssues, calculateSeoMetrics } from '@/utils/seo';
import { calculateWebsiteSeoMetrics } from '@/utils/seo/metricCalculator';
import { SeoIssue } from '@/types/seo';

export interface WebsiteSeoMetrics {
  label: string;
  score: number;
  issues: number;
  issueDetails: string | null;
}

export interface WebsiteSeoAnalysis {
  overallScore: number;
  metrics: WebsiteSeoMetrics[];
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
}

export const analyzeWebsiteSeo = async (contentItems: ContentItem[], domain?: string): Promise<WebsiteSeoAnalysis> => {
  const allIssues: SeoIssue[] = [];
  const metricsByCategory: Record<string, { scores: number[], issues: SeoIssue[] }> = {};

  // Analyze each content item
  contentItems.forEach(item => {
    const issues = analyzeSeoIssues(item);
    allIssues.push(...issues);

    // Group issues by category for aggregation
    issues.forEach(issue => {
      if (!metricsByCategory[issue.category]) {
        metricsByCategory[issue.category] = { scores: [], issues: [] };
      }
      metricsByCategory[issue.category].issues.push(issue);
    });
  });

  // Calculate scores for each category
  contentItems.forEach(item => {
    const metrics = calculateSeoMetrics(item);
    metrics.forEach(metric => {
      const category = getCategoryFromLabel(metric.label);
      if (!metricsByCategory[category]) {
        metricsByCategory[category] = { scores: [], issues: [] };
      }
      const score = getScoreFromStatus(metric.status);
      metricsByCategory[category].scores.push(score);
    });
  });

  // Get website-level metrics (including sitemap and robots.txt)
  let websiteLevelMetrics: any[] = [];
  if (domain) {
    websiteLevelMetrics = await calculateWebsiteSeoMetrics(domain);
  }

  // Build website metrics including sitemap and robots.txt
  const websiteMetrics: WebsiteSeoMetrics[] = [
    {
      label: 'Title Tags',
      score: calculateCategoryScore(metricsByCategory['title']?.scores || []),
      issues: metricsByCategory['title']?.issues.length || 0,
      issueDetails: buildIssueDetails(metricsByCategory['title']?.issues || [], 'title tags')
    },
    {
      label: 'Meta Descriptions',
      score: calculateCategoryScore(metricsByCategory['meta']?.scores || []),
      issues: metricsByCategory['meta']?.issues.length || 0,
      issueDetails: buildIssueDetails(metricsByCategory['meta']?.issues || [], 'meta descriptions')
    },
    {
      label: 'Header Structure',
      score: calculateCategoryScore(metricsByCategory['structure']?.scores || []),
      issues: metricsByCategory['structure']?.issues.filter(i => i.id.includes('header') || i.id.includes('no-headers')).length || 0,
      issueDetails: buildIssueDetails(metricsByCategory['structure']?.issues.filter(i => i.id.includes('header') || i.id.includes('no-headers')) || [], 'header structure')
    },
    {
      label: 'Alt Text',
      score: 85, // Mock score for now since we don't analyze images yet
      issues: 0,
      issueDetails: null
    },
    {
      label: 'Internal Links',
      score: calculateCategoryScore(metricsByCategory['structure']?.scores || []),
      issues: metricsByCategory['structure']?.issues.filter(i => i.id.includes('link')).length || 0,
      issueDetails: buildIssueDetails(metricsByCategory['structure']?.issues.filter(i => i.id.includes('link')) || [], 'internal links')
    },
    {
      label: 'External Links',
      score: calculateCategoryScore(metricsByCategory['structure']?.scores || []),
      issues: metricsByCategory['structure']?.issues.filter(i => i.id.includes('link')).length || 0,
      issueDetails: buildIssueDetails(metricsByCategory['structure']?.issues.filter(i => i.id.includes('link')) || [], 'external links')
    }
  ];

  // Add website-level metrics if available
  if (websiteLevelMetrics.length > 0) {
    websiteLevelMetrics.forEach(metric => {
      websiteMetrics.push({
        label: metric.label === 'Sitemap Status' ? 'Sitemap' : 'Robots.txt',
        score: getScoreFromStatus(metric.status),
        issues: metric.status !== 'good' ? 1 : 0,
        issueDetails: metric.improvement || null
      });
    });
  }

  // Calculate overall score
  const totalScore = websiteMetrics.reduce((sum, metric) => sum + metric.score, 0);
  const overallScore = Math.round(totalScore / websiteMetrics.length);

  // Count issues by severity
  const criticalIssues = allIssues.filter(i => i.severity === 'critical').length;
  const warningIssues = allIssues.filter(i => i.severity === 'warning').length;
  const infoIssues = allIssues.filter(i => i.severity === 'info').length;

  return {
    overallScore,
    metrics: websiteMetrics,
    totalIssues: allIssues.length,
    criticalIssues,
    warningIssues,
    infoIssues
  };
};

const getCategoryFromLabel = (label: string): string => {
  switch (label.toLowerCase()) {
    case 'title length':
      return 'title';
    case 'meta description':
      return 'meta';
    default:
      return 'content';
  }
};

const getScoreFromStatus = (status: string): number => {
  switch (status) {
    case 'good':
      return 90;
    case 'warning':
      return 70;
    case 'critical':
      return 40;
    default:
      return 80;
  }
};

const calculateCategoryScore = (scores: number[]): number => {
  if (scores.length === 0) return 85; // Default score if no data
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

const buildIssueDetails = (issues: SeoIssue[], category: string): string | null => {
  if (issues.length === 0) return null;
  
  const severityGroups = issues.reduce((groups, issue) => {
    if (!groups[issue.severity]) groups[issue.severity] = 0;
    groups[issue.severity]++;
    return groups;
  }, {} as Record<string, number>);

  const details = Object.entries(severityGroups)
    .map(([severity, count]) => `${count} ${severity}`)
    .join(', ');

  return `${issues.length} ${category} issues found: ${details}`;
};
