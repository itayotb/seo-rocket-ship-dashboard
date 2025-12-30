
export interface WebsiteCreationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  component?: React.ComponentType<any>;
}

export interface WebsiteCreationData {
  domain: string;
  keywords: string[];
  template: string;
  websiteName: string;
  category: string;
  aiPrompt?: string;
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
