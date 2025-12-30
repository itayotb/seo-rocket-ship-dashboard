
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WebsiteCreationData, CreatedWebsite } from '@/types/websiteCreation';
import { getTemplateById } from '@/utils/templateData';

export const useWebsiteCreation = (onComplete: (website: CreatedWebsite) => void, onClose: () => void) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState<WebsiteCreationData>({
    domain: '',
    mainKeyword: '',
    geo: '',
    keywords: [],
    template: '',
    websiteName: '',
    category: '',
    aiPrompt: ''
  });
  const { toast } = useToast();

  const updateWebsiteData = (updates: Partial<WebsiteCreationData>) => {
    setWebsiteData(prev => ({ ...prev, ...updates }));
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setWebsiteData({
      domain: '',
      mainKeyword: '',
      geo: '',
      keywords: [],
      template: '',
      websiteName: '',
      category: '',
      aiPrompt: ''
    });
  };

  const createWebsite = async () => {
    setIsLoading(true);
    try {
      // Simulate AI-enhanced website creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const selectedTemplate = getTemplateById(websiteData.template);
      
      // Generate AI-enhanced content based on the prompt
      const enhancedContent = websiteData.aiPrompt ? 
        `AI-enhanced content: ${websiteData.aiPrompt}` : 
        `Welcome to ${websiteData.websiteName}!`;
      
      const newWebsite: CreatedWebsite = {
        id: `website_${Date.now()}`,
        name: websiteData.websiteName,
        domain: websiteData.domain,
        template: selectedTemplate || {
          id: websiteData.template,
          name: 'Custom Template',
          description: 'AI-customized template',
          category: websiteData.category,
          preview: '/placeholder.svg',
          features: ['SEO Optimized', 'Mobile Responsive', 'AI-Enhanced Content'],
          pages: [
            {
              id: 'home',
              name: 'Home',
              type: 'home',
              content: enhancedContent,
              seoTitle: `${websiteData.websiteName} - ${websiteData.keywords.join(', ')}`,
              seoDescription: `${websiteData.websiteName} - ${websiteData.keywords.slice(0, 3).join(', ')}`
            }
          ]
        },
        keywords: websiteData.keywords,
        pages: selectedTemplate?.pages || [],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onComplete(newWebsite);
      resetWizard();
      onClose();
      
      toast({
        title: "Website Created Successfully!",
        description: `${websiteData.websiteName} has been created with AI-enhanced content.`,
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    isLoading,
    websiteData,
    updateWebsiteData,
    resetWizard,
    createWebsite,
    toast
  };
};
