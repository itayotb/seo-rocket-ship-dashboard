
import { WebsiteCreationStep } from '@/types/websiteCreation';

export const getWebsiteCreationSteps = (): WebsiteCreationStep[] => [
  {
    id: 'basics',
    title: 'Website Basics',
    description: 'Set up your website name, domain and category',
    status: 'pending'
  },
  {
    id: 'keywords',
    title: 'Keywords & SEO',
    description: 'Choose keywords to optimize your website for',
    status: 'pending'
  },
  {
    id: 'ai-customization',
    title: 'AI Customization',
    description: 'Tell AI how to customize your content and design',
    status: 'pending'
  },
  {
    id: 'template',
    title: 'Choose Template',
    description: 'Select a template that fits your needs',
    status: 'pending'
  },
  {
    id: 'lead-form',
    title: 'Lead Form',
    description: 'Select a lead form for your website',
    status: 'pending'
  },
  {
    id: 'preview',
    title: 'Preview Website',
    description: 'Preview your generated website content',
    status: 'pending'
  }
];
