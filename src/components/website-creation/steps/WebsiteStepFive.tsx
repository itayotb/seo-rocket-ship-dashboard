
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Check, ExternalLink, Sparkles, Target, Globe } from 'lucide-react';
import { WebsiteCreationData, GEO_OPTIONS } from '@/types/websiteCreation';
import { getTemplateById } from '@/utils/templateData';

interface WebsiteStepFiveProps {
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
}

const WebsiteStepFive = ({ data, onUpdate }: WebsiteStepFiveProps) => {
  const template = getTemplateById(data.template);
  const geoLabel = GEO_OPTIONS.find(g => g.value === data.geo)?.label || data.geo;

  const generateFinalSummary = () => {
    return {
      websiteName: data.websiteName,
      domain: data.domain,
      category: data.category,
      template: template?.name || 'Unknown',
      keywords: data.keywords,
      totalPages: template?.pages?.length || 1,
      aiEnhanced: !!data.serpAnalysis?.analyzed
    };
  };

  const summary = generateFinalSummary();

  const handleViewFullSite = () => {
    console.log('Opening generated website in new tab');
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
              <p className="text-sm text-muted-foreground">Website Name</p>
              <p className="font-semibold">{summary.websiteName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Domain</p>
              <p className="font-semibold">{summary.domain}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Template</p>
              <p className="font-semibold">{summary.template}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pages</p>
              <p className="font-semibold">{summary.totalPages}</p>
            </div>
          </div>

          {/* Main Keyword & GEO */}
          {data.mainKeyword && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3" /> Main Keyword
                </p>
                <p className="font-semibold">{data.mainKeyword}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Target GEO
                </p>
                <p className="font-semibold">{geoLabel}</p>
              </div>
            </div>
          )}

          {/* AI Recommended Sections */}
          {data.serpAnalysis?.recommendedSections && data.serpAnalysis.recommendedSections.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> AI Recommended Sections
              </p>
              <div className="flex flex-wrap gap-2">
                {data.serpAnalysis.recommendedSections.map((section, index) => (
                  <Badge key={index} variant="secondary">
                    {section}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Related Keywords */}
          {summary.keywords.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Related Keywords</p>
              <div className="flex flex-wrap gap-2">
                {summary.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {summary.aiEnhanced && (
            <div className="mt-4 flex items-center space-x-2 text-green-600">
              <Check className="h-4 w-4" />
              <span className="text-sm">AI-Analyzed SERP Content</span>
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
