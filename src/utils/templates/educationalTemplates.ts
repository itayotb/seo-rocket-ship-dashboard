
import { Template } from '@/types/websiteCreation';

export const EDUCATIONAL_TEMPLATES: Template[] = [
  {
    id: 'online-course',
    name: 'Online Course',
    description: 'Educational platform template for online courses',
    category: 'educational',
    preview: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
    features: ['Course Catalog', 'Student Dashboard', 'Progress Tracking', 'Certificates'],
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Learn with our courses',
        seoTitle: 'Online Courses - Learn New Skills',
        seoDescription: 'Master new skills with our comprehensive online courses'
      }
    ]
  }
];
