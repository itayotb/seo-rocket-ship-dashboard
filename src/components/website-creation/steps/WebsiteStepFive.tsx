
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Check, ExternalLink } from 'lucide-react';
import { WebsiteCreationData } from '@/types/websiteCreation';
import { getTemplateById } from '@/utils/templateData';

interface WebsiteStepFiveProps {
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
}

const WebsiteStepFive = ({ data, onUpdate }: WebsiteStepFiveProps) => {
  const template = getTemplateById(data.template);

  const generateFinalSummary = () => {
    return {
      websiteName: data.websiteName,
      domain: data.domain,
      category: data.category,
      template: template?.name || 'Unknown',
      keywords: data.keywords,
      totalPages: template?.pages?.length || 1,
      aiEnhanced: !!data.aiPrompt
    };
  };

  const summary = generateFinalSummary();

  const handleViewFullSite = () => {
    // This would open the generated website in a new tab
    console.log('Opening generated website in new tab');
    // In a real implementation, this would navigate to the generated website
    window.open('/generated-website', '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5" />
            <span>Website Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Website Name</p>
              <p className="font-semibold">{summary.websiteName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Domain</p>
              <p className="font-semibold">{summary.domain}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Template</p>
              <p className="font-semibold">{summary.template}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pages</p>
              <p className="font-semibold">{summary.totalPages}</p>
            </div>
          </div>
          
          {summary.keywords.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">SEO Keywords</p>
              <div className="flex flex-wrap gap-2">
                {summary.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {summary.aiEnhanced && (
            <div className="mt-4 flex items-center space-x-2 text-green-600">
              <Check className="h-4 w-4" />
              <span className="text-sm">AI-Enhanced Content</span>
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <Button onClick={handleViewFullSite} className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>View Preview of Full Website</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteStepFive;
