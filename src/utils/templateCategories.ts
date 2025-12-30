
export interface TemplateCategory {
  value: string;
  label: string;
  isCustom?: boolean;
}

export const DEFAULT_TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { value: 'business', label: 'Business' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'blog', label: 'Blog' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'news', label: 'News/Media' },
  { value: 'educational', label: 'Educational' },
  { value: 'nonprofit', label: 'Non-profit' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'technology', label: 'Technology' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'finance', label: 'Finance' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'creative', label: 'Creative' },
  { value: 'other', label: 'Other' }
];

// In a real app, this would be stored in a database or localStorage
let customCategories: TemplateCategory[] = [];

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  ...DEFAULT_TEMPLATE_CATEGORIES,
  ...customCategories
];

export const getCategoryLabel = (categoryValue: string): string => {
  const allCategories = [...DEFAULT_TEMPLATE_CATEGORIES, ...customCategories];
  const category = allCategories.find(cat => cat.value === categoryValue);
  return category ? category.label : categoryValue;
};

export const addCustomCategory = (label: string): TemplateCategory => {
  const value = label.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const newCategory: TemplateCategory = {
    value,
    label,
    isCustom: true
  };
  
  // Check if category already exists
  const exists = [...DEFAULT_TEMPLATE_CATEGORIES, ...customCategories].some(
    cat => cat.value === value || cat.label === label
  );
  
  if (!exists) {
    customCategories.push(newCategory);
  }
  
  return newCategory;
};

export const removeCustomCategory = (value: string): boolean => {
  const index = customCategories.findIndex(cat => cat.value === value);
  if (index > -1) {
    customCategories.splice(index, 1);
    return true;
  }
  return false;
};

export const getAllCategories = (): TemplateCategory[] => {
  return [...DEFAULT_TEMPLATE_CATEGORIES, ...customCategories];
};
