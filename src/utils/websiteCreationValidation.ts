
import { WebsiteCreationData } from '@/types/websiteCreation';

export const validateStep = (step: number, data: WebsiteCreationData): boolean => {
  switch (step) {
    case 0:
      return !!(data.websiteName && data.domain && data.category);
    case 1:
      return data.keywords.length > 0;
    case 2:
      return true; // AI customization is optional
    case 3:
      return !!data.template;
    case 4:
      return true; // Preview step doesn't require validation
    case 5:
      return true; // Final step for publishing
    default:
      return false;
  }
};

export const getValidationMessage = (step: number): string => {
  switch (step) {
    case 0:
      return "Please fill in website name, domain, and category.";
    case 1:
      return "Please add at least one keyword for SEO optimization.";
    case 2:
      return "AI customization step completed.";
    case 3:
      return "Please select a template for your website.";
    case 4:
      return "Please review and customize your website content.";
    case 5:
      return "Ready to publish your website.";
    default:
      return "Please complete the required fields.";
  }
};
