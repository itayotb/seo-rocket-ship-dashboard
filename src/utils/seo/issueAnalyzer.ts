
import { ContentItem } from '@/types/website';
import { SeoIssue } from '@/types/seo';
import { SeoAutoFixService } from '../seoAutoFix';

export const analyzeSeoIssues = (
  item: ContentItem, 
  onAutoFix?: (updatedItem: ContentItem) => void,
  onNavigateToEdit?: (item: ContentItem) => void
): SeoIssue[] => {
  const issues: SeoIssue[] = [];

  // Title Analysis
  if (item.title.length < 30) {
    issues.push({
      id: 'title-too-short',
      category: 'title',
      severity: 'warning',
      title: 'Title Too Short',
      description: `Your title is ${item.title.length} characters. It should be at least 30 characters.`,
      recommendation: 'Expand your title to include more descriptive keywords and context.',
      impact: 'Short titles may not fully utilize search result space and miss keyword opportunities.',
      canAutoFix: true,
      autoFixAction: async () => {
        const result = await SeoAutoFixService.fixTitleLength(item);
        if (result.success && result.updatedItem && onAutoFix) {
          onAutoFix(result.updatedItem);
        }
      },
      navigateToFix: () => onNavigateToEdit?.(item)
    });
  } else if (item.title.length > 60) {
    issues.push({
      id: 'title-too-long',
      category: 'title',
      severity: 'warning',
      title: 'Title Too Long',
      description: `Your title is ${item.title.length} characters. It may be truncated in search results.`,
      recommendation: 'Shorten your title to 50-60 characters while keeping the most important keywords.',
      impact: 'Long titles get truncated in search results, potentially hiding important information.',
      canAutoFix: true,
      autoFixAction: async () => {
        const result = await SeoAutoFixService.fixTitleLength(item);
        if (result.success && result.updatedItem && onAutoFix) {
          onAutoFix(result.updatedItem);
        }
      },
      navigateToFix: () => onNavigateToEdit?.(item)
    });
  }

  // Meta Description Analysis
  if (item.metaDescription.length < 120) {
    issues.push({
      id: 'meta-too-short',
      category: 'meta',
      severity: 'warning',
      title: 'Meta Description Too Short',
      description: `Your meta description is ${item.metaDescription.length} characters. It should be 120-160 characters.`,
      recommendation: 'Expand your meta description to better describe your content and include relevant keywords.',
      impact: 'Short meta descriptions miss opportunities to attract clicks from search results.',
      canAutoFix: true,
      autoFixAction: async () => {
        const result = await SeoAutoFixService.fixMetaDescription(item);
        if (result.success && result.updatedItem && onAutoFix) {
          onAutoFix(result.updatedItem);
        }
      },
      navigateToFix: () => onNavigateToEdit?.(item)
    });
  } else if (item.metaDescription.length > 160) {
    issues.push({
      id: 'meta-too-long',
      category: 'meta',
      severity: 'warning',
      title: 'Meta Description Too Long',
      description: `Your meta description is ${item.metaDescription.length} characters and may be truncated.`,
      recommendation: 'Trim your meta description to 150-160 characters while keeping the most compelling parts.',
      impact: 'Long meta descriptions get truncated, potentially cutting off your call-to-action.',
      canAutoFix: true,
      autoFixAction: async () => {
        const result = await SeoAutoFixService.fixMetaDescription(item);
        if (result.success && result.updatedItem && onAutoFix) {
          onAutoFix(result.updatedItem);
        }
      },
      navigateToFix: () => onNavigateToEdit?.(item)
    });
  }

  // Content Length Analysis
  if (item.wordCount < 300) {
    issues.push({
      id: 'content-too-short',
      category: 'content',
      severity: item.wordCount < 150 ? 'critical' : 'warning',
      title: 'Content Too Short',
      description: `Your content has ${item.wordCount} words. Aim for at least 300 words.`,
      recommendation: 'Add more detailed information, examples, or sections to reach the recommended word count.',
      impact: 'Short content may not rank well and might not provide enough value to readers.',
      canAutoFix: true,
      autoFixAction: async () => {
        const result = await SeoAutoFixService.expandContent(item);
        if (result.success && result.updatedItem && onAutoFix) {
          onAutoFix(result.updatedItem);
        }
      },
      navigateToFix: () => onNavigateToEdit?.(item)
    });
  }

  // Structure Analysis
  const hasHeaders = /#{1,6}\s/.test(item.content) || /<h[1-6]/.test(item.content);
  if (!hasHeaders) {
    issues.push({
      id: 'no-headers',
      category: 'structure',
      severity: 'warning',
      title: 'No Header Structure',
      description: 'Your content lacks proper heading structure (H1, H2, H3, etc.).',
      recommendation: 'Add headers to organize your content and improve readability for both users and search engines.',
      impact: 'Poor structure makes content harder to read and less likely to rank well.',
      canAutoFix: true,
      autoFixAction: async () => {
        const result = await SeoAutoFixService.fixContentStructure(item);
        if (result.success && result.updatedItem && onAutoFix) {
          onAutoFix(result.updatedItem);
        }
      },
      navigateToFix: () => onNavigateToEdit?.(item)
    });
  }

  const hasLinks = /\[.*\]\(.*\)/.test(item.content) || /<a/.test(item.content);
  if (!hasLinks) {
    issues.push({
      id: 'no-links',
      category: 'structure',
      severity: 'info',
      title: 'No Internal or External Links',
      description: 'Your content doesn\'t contain any links to other pages or external resources.',
      recommendation: 'Add relevant internal links to other pages and external links to authoritative sources.',
      impact: 'Links help search engines understand content context and provide additional value to readers.',
      canAutoFix: false,
      navigateToFix: () => onNavigateToEdit?.(item)
    });
  }

  return issues;
};
