
import { useState, useEffect } from 'react';
import { ContentItem } from '@/types/website';
import { analyzeWebsiteSeo, WebsiteSeoAnalysis } from '@/utils/websiteSeoAnalyzer';

export const useWebsiteSeo = (contentItems: ContentItem[], domain?: string) => {
  const [seoAnalysis, setSeoAnalysis] = useState<WebsiteSeoAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const analyzeSeo = async () => {
      setIsAnalyzing(true);
      try {
        // Simulate brief analysis delay for UX
        await new Promise(resolve => setTimeout(resolve, 100));
        const analysis = await analyzeWebsiteSeo(contentItems, domain);
        setSeoAnalysis(analysis);
      } catch (error) {
        console.error('Error analyzing website SEO:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    if (contentItems.length > 0) {
      analyzeSeo();
    }
  }, [contentItems, domain]);

  const refreshAnalysis = async () => {
    if (contentItems.length > 0) {
      const analysis = await analyzeWebsiteSeo(contentItems, domain);
      setSeoAnalysis(analysis);
    }
  };

  return {
    seoAnalysis,
    isAnalyzing,
    refreshAnalysis
  };
};
