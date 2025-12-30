
export interface WebsiteCreationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  component?: React.ComponentType<any>;
}

export interface SerpAnalysisResult {
  recommendedSections: string[];
  relatedKeywords: string[];
  analyzed: boolean;
}

export interface WebsiteCreationData {
  domain: string;
  mainKeyword: string;
  geo: string;
  keywords: string[];
  template: string;
  websiteName: string;
  category: string;
  aiPrompt?: string;
  leadFormId?: string;
  serpAnalysis?: SerpAnalysisResult;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  features: string[];
  pages: TemplatePage[];
  isActive?: boolean;
}

export interface TemplatePage {
  id: string;
  name: string;
  type: 'home' | 'about' | 'contact' | 'services' | 'blog' | 'product';
  content: string;
  seoTitle: string;
  seoDescription: string;
}

export interface CreatedWebsite {
  id: string;
  name: string;
  domain: string;
  template: Template;
  keywords: string[];
  pages: TemplatePage[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

// Available sections for SERP analysis
export const AVAILABLE_SECTIONS = [
  'Hero Section',
  'Intro / Overview Section',
  'Value Proposition Section',
  'What Is / Definition Section',
  'Benefits Section',
  'Features / Services Section',
  'How It Works Section',
  'Process Overview Section',
  'Use Cases / Who It\'s For Section',
  'Industries / Segments Section',
  'Pricing / Cost Overview Section',
  'Comparison Section',
  'Pros & Cons Section',
  'Eligibility / Requirements Section',
  'Key Considerations Section',
  'Common Mistakes Section',
  'Expert Tips Section',
  'Best Practices Section',
  'Detailed Guide Section',
  'Step-by-Step Section',
  'FAQ Section',
  'Testimonials Section',
  'Reviews / Ratings Section',
  'Case Studies / Success Stories Section',
  'Statistics / Results Section',
  'Brand Authority / Why Choose Us Section',
  'About Section (Mini)',
  'CTA Section',
  'Resources / Helpful Links Section',
] as const;

// GEO options
export const GEO_OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'il', label: 'Israel' },
] as const;
