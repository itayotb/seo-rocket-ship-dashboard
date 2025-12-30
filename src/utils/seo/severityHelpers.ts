
import { SeoIssueSeverity } from '@/types/seo';

export const getSeverityColor = (severity: SeoIssueSeverity): string => {
  switch (severity) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'info':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getSeverityIcon = (severity: SeoIssueSeverity): string => {
  switch (severity) {
    case 'critical':
      return 'AlertTriangle';
    case 'warning':
      return 'AlertCircle';
    case 'info':
      return 'Info';
    default:
      return 'Info';
  }
};
