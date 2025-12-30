
import { Template } from '@/types/websiteCreation';

export const PORTFOLIO_TEMPLATES: Template[] = [
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Showcase your creative work with this elegant portfolio',
    category: 'portfolio',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    features: ['Project Gallery', 'Case Studies', 'Client Testimonials', 'Contact Form'],
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Creative portfolio showcase',
        seoTitle: 'Creative Portfolio - My Work',
        seoDescription: 'Explore my creative portfolio and projects'
      }
    ]
  },
  {
    id: 'developer-portfolio',
    name: 'Developer Portfolio',
    description: 'Professional portfolio for developers and programmers',
    category: 'portfolio',
    preview: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
    features: ['Code Showcase', 'GitHub Integration', 'Skills Display', 'Project Timeline'],
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Developer portfolio',
        seoTitle: 'Developer Portfolio - My Projects',
        seoDescription: 'Explore my development projects and skills'
      }
    ]
  }
];
