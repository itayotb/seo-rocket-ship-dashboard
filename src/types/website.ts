
export interface Website {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive';
  seoScore: number;
  mobileSpeed: number;
  desktopSpeed: number;
  googlePosition: number;
  rankingChange: 'up' | 'down' | 'stable';
  uniqueContent: number;
  thumbnail: string;
  lastUpdated: string;
  totalClicks?: number;
  category: string;
}

export interface WebsiteTableProps {
  websites: Website[];
  onViewDetails: (websiteId: string) => void;
  onToggleStatus?: (websiteId: string, status: boolean) => void;
}

export interface ContentItem {
  id: string;
  type: 'page' | 'post' | 'product';
  title: string;
  url: string;
  status: 'published' | 'draft' | 'review';
  seoScore: number;
  lastModified: string;
  content: string;
  metaDescription: string;
  wordCount: number;
}
