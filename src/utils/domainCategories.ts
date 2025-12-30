
export interface DomainCategory {
  value: string;
  label: string;
  isCustom?: boolean;
}

export const DEFAULT_DOMAIN_CATEGORIES: DomainCategory[] = [
  { value: 'business', label: 'Business' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'blog', label: 'Blog' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'news', label: 'News/Media' },
  { value: 'educational', label: 'Educational' },
  { value: 'nonprofit', label: 'Non-profit' },
  { value: 'other', label: 'Other' }
];

// Store custom categories in localStorage
const CUSTOM_CATEGORIES_KEY = 'custom_domain_categories';

const getCustomCategories = (): DomainCategory[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load custom domain categories:', error);
    return [];
  }
};

const saveCustomCategories = (categories: DomainCategory[]) => {
  try {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save custom domain categories:', error);
  }
};

export const getDomainCategoryLabel = (categoryValue: string): string => {
  const allCategories = [...DEFAULT_DOMAIN_CATEGORIES, ...getCustomCategories()];
  const category = allCategories.find(cat => cat.value === categoryValue);
  return category ? category.label : categoryValue;
};

export const addCustomDomainCategory = (label: string): DomainCategory => {
  const value = label.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const newCategory: DomainCategory = {
    value,
    label,
    isCustom: true
  };
  
  // Check if category already exists
  const existingCustom = getCustomCategories();
  const exists = [...DEFAULT_DOMAIN_CATEGORIES, ...existingCustom].some(
    cat => cat.value === value || cat.label === label
  );
  
  if (!exists) {
    const updatedCustom = [...existingCustom, newCategory];
    saveCustomCategories(updatedCustom);
  }
  
  return newCategory;
};

export const getAllDomainCategories = (): DomainCategory[] => {
  return [...DEFAULT_DOMAIN_CATEGORIES, ...getCustomCategories()];
};

export const removeCustomDomainCategory = (value: string): boolean => {
  const customCategories = getCustomCategories();
  const filtered = customCategories.filter(cat => cat.value !== value);
  
  if (filtered.length !== customCategories.length) {
    saveCustomCategories(filtered);
    return true;
  }
  return false;
};
