
import { Template } from '@/types/websiteCreation';

export const HEALTH_TEMPLATES: Template[] = [
  {
    id: 'wellness-center',
    name: 'Wellness Center',
    description: 'Health and wellness template with appointment booking',
    category: 'health',
    preview: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    features: ['Appointment Booking', 'Service Catalog', 'Health Tips', 'Staff Profiles'],
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Your wellness journey starts here',
        seoTitle: 'Wellness Center - Health & Wellness Services',
        seoDescription: 'Professional health and wellness services for your wellbeing'
      }
    ]
  }
];
