
import { Template } from '@/types/websiteCreation';
import { ALL_TEMPLATES } from './templates';
import { TEMPLATE_CATEGORIES, getCategoryLabel } from './templateCategories';

// Re-export for backward compatibility
export { TEMPLATE_CATEGORIES, getCategoryLabel };

export const getTemplatesForCategory = (category: string): Template[] => {
  if (category === 'all' || !category) {
    return ALL_TEMPLATES;
  }
  
  const filtered = ALL_TEMPLATES.filter(template => template.category === category);
  return filtered.length > 0 ? filtered : ALL_TEMPLATES.filter(t => t.category === 'business');
};

export const getTemplateById = (id: string): Template | undefined => {
  return ALL_TEMPLATES.find(template => template.id === id);
};

// Re-export for backward compatibility
export { ALL_TEMPLATES };
