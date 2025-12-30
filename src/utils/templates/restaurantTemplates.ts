
import { Template } from '@/types/websiteCreation';

export const RESTAURANT_TEMPLATES: Template[] = [
  {
    id: 'restaurant-modern',
    name: 'Modern Restaurant',
    description: 'Elegant restaurant template with menu and reservations',
    category: 'restaurant',
    preview: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    features: ['Digital Menu', 'Reservation System', 'Location Map', 'Chef Gallery'],
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Welcome to our restaurant',
        seoTitle: 'Modern Restaurant - Fine Dining Experience',
        seoDescription: 'Experience fine dining at our modern restaurant'
      }
    ]
  }
];
