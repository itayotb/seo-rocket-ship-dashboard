
import { useState } from 'react';
import { Template } from '@/components/templates/TemplateGallery';
import { getAllCategories, TemplateCategory } from '@/utils/templateCategories';

export const useTemplateGallery = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<TemplateCategory[]>(getAllCategories());

  const templates: Template[] = [
    {
      id: '1',
      name: 'Modern Business',
      category: 'Business',
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      rating: 4.8,
      downloads: 1250,
      isFavorite: false,
      description: 'A clean and modern business template perfect for corporate websites.',
      previewUrl: 'https://example.com/modern-business-preview'
    },
    {
      id: '2',
      name: 'E-commerce Store',
      category: 'E-commerce',
      preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      rating: 4.9,
      downloads: 2100,
      isFavorite: true,
      description: 'Complete e-commerce solution with shopping cart and product catalog.',
      previewUrl: 'https://example.com/ecommerce-preview'
    },
    {
      id: '3',
      name: 'Tech Blog',
      category: 'Blog',
      preview: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
      rating: 4.7,
      downloads: 980,
      isFavorite: false,
      description: 'Technology blog template with article management and comments.',
      previewUrl: 'https://example.com/tech-blog-preview'
    },
    {
      id: '4',
      name: 'Restaurant Menu',
      category: 'Local Business',
      preview: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      rating: 4.6,
      downloads: 750,
      isFavorite: false,
      description: 'Restaurant template with menu display and reservation system.',
      previewUrl: 'https://example.com/restaurant-preview'
    },
    {
      id: '5',
      name: 'Portfolio Showcase',
      category: 'Portfolio',
      preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      rating: 4.9,
      downloads: 1500,
      isFavorite: true,
      description: 'Creative portfolio template for designers and artists.',
      previewUrl: 'https://example.com/portfolio-preview'
    },
    {
      id: '6',
      name: 'Health & Wellness',
      category: 'Health',
      preview: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      rating: 4.5,
      downloads: 650,
      isFavorite: false,
      description: 'Health and wellness template with appointment booking.',
      previewUrl: 'https://example.com/health-preview'
    }
  ];

  const availableCategories = ['All', ...Array.from(new Set([
    ...categories.map(cat => cat.label),
    ...templates.map(template => template.category)
  ]))];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleCategoryAdded = (newCategory: TemplateCategory) => {
    setCategories(getAllCategories());
  };

  const toggleFavorite = (templateId: string) => {
    console.log('Toggling favorite for template:', templateId);
  };

  return {
    selectedTemplate,
    setSelectedTemplate,
    isPreviewOpen,
    setIsPreviewOpen,
    isEditOpen,
    setIsEditOpen,
    isApplyOpen,
    setIsApplyOpen,
    isCategoryManagerOpen,
    setIsCategoryManagerOpen,
    selectedCategory,
    setSelectedCategory,
    categories,
    templates,
    availableCategories,
    filteredTemplates,
    handleCategoryAdded,
    toggleFavorite
  };
};
