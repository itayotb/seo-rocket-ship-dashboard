
import { Template } from '@/types/websiteCreation';

export const LANDING_PAGE_TEMPLATES: Template[] = [
  {
    id: 'startup-landing',
    name: 'Startup Landing',
    description: 'High-converting landing page for startups',
    category: 'landing-page',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    features: ['Hero Section', 'Feature Highlights', 'Pricing Table', 'Lead Capture'],
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Revolutionary startup solution',
        seoTitle: 'Startup Solution - Revolutionary Product',
        seoDescription: 'Discover our revolutionary startup solution'
      }
    ]
  }
];
