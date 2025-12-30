
import { Template } from '@/types/websiteCreation';

export const BUSINESS_TEMPLATES: Template[] = [
  {
    id: 'modern-business',
    name: 'Modern Business',
    description: 'Clean and professional business template with service showcases',
    category: 'business',
    preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
    features: ['Service Catalog', 'Team Profiles', 'Contact Forms', 'Testimonials'],
    isActive: true,
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Professional business solutions',
        seoTitle: 'Professional Business Services',
        seoDescription: 'Discover our comprehensive business solutions and services'
      },
      {
        id: 'about',
        name: 'About',
        type: 'about',
        content: 'Learn about our company',
        seoTitle: 'About Our Company',
        seoDescription: 'Learn about our company mission, values, and team'
      },
      {
        id: 'services',
        name: 'Services',
        type: 'services',
        content: 'Our professional services',
        seoTitle: 'Our Services',
        seoDescription: 'Explore our comprehensive range of professional services'
      },
      {
        id: 'contact',
        name: 'Contact',
        type: 'contact',
        content: 'Get in touch with us',
        seoTitle: 'Contact Us',
        seoDescription: 'Contact our team for professional business solutions'
      }
    ]
  }
];
