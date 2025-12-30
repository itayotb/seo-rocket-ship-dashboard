
import { Template } from '@/types/websiteCreation';

export const ECOMMERCE_TEMPLATES: Template[] = [
  {
    id: 'ecommerce-starter',
    name: 'E-commerce Starter',
    description: 'Complete online store solution with modern design',
    category: 'ecommerce',
    preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Integration', 'Order Management'],
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Welcome to our store',
        seoTitle: 'Online Store - Quality Products',
        seoDescription: 'Shop quality products online with fast delivery'
      },
      {
        id: 'products',
        name: 'Products',
        type: 'product',
        content: 'Browse our products',
        seoTitle: 'Products - Shop Our Collection',
        seoDescription: 'Discover our wide range of quality products'
      }
    ]
  },
  {
    id: 'fashion-store',
    name: 'Fashion Store',
    description: 'Stylish e-commerce template for fashion brands',
    category: 'ecommerce',
    preview: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    features: ['Fashion Gallery', 'Size Guide', 'Wishlist', 'Style Blog'],
    pages: [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        content: 'Latest fashion trends',
        seoTitle: 'Fashion Store - Latest Trends',
        seoDescription: 'Discover the latest fashion trends and styles'
      }
    ]
  }
];
