
import { Template } from '@/types/websiteCreation';
import { BUSINESS_TEMPLATES } from './businessTemplates';
import { ECOMMERCE_TEMPLATES } from './ecommerceTemplates';
import { BLOG_TEMPLATES } from './blogTemplates';
import { PORTFOLIO_TEMPLATES } from './portfolioTemplates';
import { RESTAURANT_TEMPLATES } from './restaurantTemplates';
import { HEALTH_TEMPLATES } from './healthTemplates';
import { LANDING_PAGE_TEMPLATES } from './landingPageTemplates';
import { EDUCATIONAL_TEMPLATES } from './educationalTemplates';

export const ALL_TEMPLATES: Template[] = [
  ...BUSINESS_TEMPLATES,
  ...ECOMMERCE_TEMPLATES,
  ...BLOG_TEMPLATES,
  ...PORTFOLIO_TEMPLATES,
  ...RESTAURANT_TEMPLATES,
  ...HEALTH_TEMPLATES,
  ...LANDING_PAGE_TEMPLATES,
  ...EDUCATIONAL_TEMPLATES
];
