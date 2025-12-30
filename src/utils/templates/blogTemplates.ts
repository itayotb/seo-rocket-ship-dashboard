
import { Template } from '@/types/websiteCreation';

export const BLOG_TEMPLATES: Template[] = [
  {
    id: 'tech-blog',
    name: 'Tech Blog',
    description: 'Modern blog template for technology content',
    category: 'blog',
    preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=400&fit=crop',
    features: ['Article Management', 'Comments System', 'Social Sharing', 'Newsletter'],
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Latest tech articles',
        seoTitle: 'Tech Blog - Latest Technology News',
        seoDescription: 'Stay updated with the latest technology trends and news'
      },
      {
        id: 'blog',
        name: 'Blog',
        type: 'blog',
        content: 'All articles',
        seoTitle: 'All Articles - Tech Blog',
        seoDescription: 'Browse all our technology articles and tutorials'
      }
    ]
  },
  {
    id: 'lifestyle-blog',
    name: 'Lifestyle Blog',
    description: 'Beautiful blog template for lifestyle content',
    category: 'blog',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    features: ['Photo Gallery', 'Recipe Cards', 'Travel Journal', 'Personal Stories'],
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Lifestyle inspiration',
        seoTitle: 'Lifestyle Blog - Inspiration Daily',
        seoDescription: 'Find daily inspiration for a better lifestyle'
      }
    ]
  }
];
