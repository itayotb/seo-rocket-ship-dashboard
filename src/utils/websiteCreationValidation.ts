
import { WebsiteCreationData } from '@/types/websiteCreation';

export const validateStep = (step: number, data: WebsiteCreationData): boolean => {
  switch (step) {
    case 0:
      return !!(data.websiteName && data.domain && data.category);
    case 1:
      // Require main keyword, geo, and completed analysis
      return !!(data.mainKeyword && data.geo && data.serpAnalysis?.analyzed);
    case 2:
      return !!data.template;
    case 3:
      return true; // Lead form is optional
    case 4:
      return true; // Preview step doesn't require validation
    default:
      return false;
  }
};

export const getValidationMessage = (step: number): string => {
  switch (step) {
    case 0:
      return "Please fill in website name, domain, and category.";
    case 1:
      return "Please enter a keyword, select GEO, and run AI analysis.";
    case 2:
      return "Please select a template for your website.";
    case 3:
      return "Lead form selection completed.";
    case 4:
      return "Ready to publish your website.";
    default:
      return "Please complete the required fields.";
  }
};
