
import { SectionTemplate } from '@/types/aiSection';

export const sectionTemplates: SectionTemplate[] = [
  {
    id: 'generic',
    name: 'Generic Section',
    description: 'Create any type of content section',
    icon: 'FileText',
    defaultPrompt: 'Create a custom section with engaging content',
    structure: ['Custom Title', 'Custom Content', 'Optional Subsections']
  },
  {
    id: 'faq',
    name: 'FAQ Section',
    description: 'Frequently Asked Questions with answers',
    icon: 'HelpCircle',
    defaultPrompt: 'Create a comprehensive FAQ section that addresses common customer questions',
    structure: ['Question 1', 'Answer 1', 'Question 2', 'Answer 2', 'Question 3', 'Answer 3']
  },
  {
    id: 'features',
    name: 'Features List',
    description: 'Product or service features with descriptions',
    icon: 'Star',
    defaultPrompt: 'Generate a compelling features list highlighting key benefits and capabilities',
    structure: ['Feature Title', 'Feature Description', 'Benefits']
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    description: 'Customer reviews and testimonials',
    icon: 'MessageSquare',
    defaultPrompt: 'Create realistic customer testimonials that showcase positive experiences',
    structure: ['Customer Name', 'Company', 'Testimonial Text', 'Rating']
  },
  {
    id: 'howto',
    name: 'How-To Guide',
    description: 'Step-by-step instructions or tutorial',
    icon: 'List',
    defaultPrompt: 'Create a clear step-by-step guide that is easy to follow',
    structure: ['Introduction', 'Step 1', 'Step 2', 'Step 3', 'Conclusion']
  },
  {
    id: 'benefits',
    name: 'Benefits Section',
    description: 'Key benefits and value propositions',
    icon: 'CheckCircle',
    defaultPrompt: 'Highlight the main benefits and value propositions for customers',
    structure: ['Benefit Title', 'Description', 'Impact']
  },
  {
    id: 'about',
    name: 'About Us',
    description: 'Company or personal background information',
    icon: 'Users',
    defaultPrompt: 'Write an engaging about section that builds trust and connection',
    structure: ['Mission', 'History', 'Team', 'Values']
  }
];

export const getSectionTemplate = (id: string): SectionTemplate | undefined => {
  return sectionTemplates.find(template => template.id === id);
};
