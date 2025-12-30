
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, RefreshCw, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Website, ContentItem } from '@/types/website';
import { useWebsiteSeo } from '@/hooks/useWebsiteSeo';
import SeoScoreCard from './SeoScoreCard';
import SeoMetricsGrid from './SeoMetricsGrid';
import SeoIssuesSection from './SeoIssuesSection';
import QuickWins from './QuickWins';

interface SEODetailsProps {
  website: Website;
  contentItems?: ContentItem[];
  onRefresh?: () => void;
  onContentUpdate?: (items: ContentItem[]) => void;
  onEditContent?: (item: ContentItem) => void;
}

const SEODetails = ({ 
  website, 
  contentItems = [], 
  onRefresh,
  onContentUpdate,
  onEditContent
}: SEODetailsProps) => {
  const { seoAnalysis, isAnalyzing, refreshAnalysis } = useWebsiteSeo(contentItems, website.domain);

  const handleAutoFix = (updatedItem: ContentItem) => {
    if (onContentUpdate) {
      const updatedItems = contentItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      onContentUpdate(updatedItems);
    }
  };

  const handleNavigateToEdit = (item: ContentItem) => {
    if (onEditContent) {
      onEditContent(item);
    }
  };

  const handleRefresh = () => {
    refreshAnalysis();
    onRefresh?.();
  };

  // Dynamic header status based on overall score
  const getHeaderStatus = () => {
    if (!seoAnalysis) return { emoji: '📊', status: 'Analyzing...', color: 'text-gray-600 dark:text-gray-400' };
    
    const score = seoAnalysis.overallScore;
    if (score >= 90) return { emoji: '🚀', status: 'Excellent Performance', color: 'text-green-600 dark:text-green-400' };
    if (score >= 75) return { emoji: '✨', status: 'Good Performance', color: 'text-blue-600 dark:text-blue-400' };
    if (score >= 60) return { emoji: '⚡', status: 'Needs Optimization', color: 'text-yellow-600 dark:text-yellow-400' };
    return { emoji: '🔧', status: 'Requires Attention', color: 'text-red-600 dark:text-red-400' };
  };

  const headerStatus = getHeaderStatus();

  return (
    <Card className="transition-all duration-300 hover:shadow-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3 text-gray-900 dark:text-white">
            <div className="flex items-center space-x-2">
              <span className="text-2xl animate-pulse">{headerStatus.emoji}</span>
              <Activity className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <span>SEO Performance Details</span>
              {seoAnalysis && (
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant={seoAnalysis.overallScore >= 75 ? 'default' : 'secondary'}
                    className="text-xs animate-fade-in"
                  >
                    {headerStatus.status}
                  </Badge>
                  {seoAnalysis.criticalIssues > 0 && (
                    <Badge variant="destructive" className="text-xs animate-fade-in">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {seoAnalysis.criticalIssues} Critical
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isAnalyzing}
            className="transition-all duration-200 hover:scale-105 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Score Card */}
          <SeoScoreCard 
            website={website}
            seoAnalysis={seoAnalysis}
            isAnalyzing={isAnalyzing}
          />

          {/* Enhanced Metrics Grid */}
          <SeoMetricsGrid 
            seoAnalysis={seoAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Quick Wins Section */}
        {seoAnalysis && (
          <QuickWins 
            seoAnalysis={seoAnalysis}
            contentItems={contentItems}
            onAutoFix={handleAutoFix}
            onEditContent={handleNavigateToEdit}
          />
        )}

        {/* Enhanced Issues Section */}
        <SeoIssuesSection
          contentItems={contentItems}
          onAutoFix={handleAutoFix}
          onNavigateToEdit={handleNavigateToEdit}
        />
      </CardContent>
    </Card>
  );
};

export default SEODetails;
