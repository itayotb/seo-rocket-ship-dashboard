
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WebsiteSeoAnalysis } from '@/utils/websiteSeoAnalyzer';
import SeoStatusIndicator from './SeoStatusIndicator';

interface SeoMetricsGridProps {
  seoAnalysis: WebsiteSeoAnalysis | null;
  isAnalyzing: boolean;
}

const SeoMetricsGrid: React.FC<SeoMetricsGridProps> = ({
  seoAnalysis,
  isAnalyzing
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusFromScore = (score: number): 'good' | 'warning' | 'critical' => {
    if (score >= 90) return 'good';
    if (score >= 70) return 'warning';
    return 'critical';
  };

  const getMetricEmoji = (label: string) => {
    switch (label) {
      case 'Title Tags': return '📝';
      case 'Meta Descriptions': return '📄';
      case 'Header Structure': return '🏗️';
      case 'Alt Text': return '🖼️';
      case 'Internal Links': return '🔗';
      case 'External Links': return '🌐';
      case 'Sitemap': return '🗺️';
      case 'Robots.txt': return '🤖';
      default: return '📊';
    }
  };

  const getMetricMotivation = (label: string, score: number) => {
    if (score >= 90) return 'Perfect! 🎉';
    if (score >= 70) return 'Almost there! 💪';
    return 'Let\'s fix this! 🔧';
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">📈</span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Metrics</h3>
      </div>
      
      <div className="space-y-3">
        {seoAnalysis ? (
          seoAnalysis.metrics.map((metric, index) => {
            // Special handling for Sitemap and Robots.txt metrics
            if (metric.label === 'Sitemap' || metric.label === 'Robots.txt') {
              const status = getStatusFromScore(metric.score);
              const value = metric.label === 'Sitemap' 
                ? (metric.score >= 90 ? 'Available ✅' : 'Issues Found ⚠️')
                : (metric.score >= 90 ? 'Allowing Crawlers ✅' : metric.score >= 70 ? 'Minor Issues ⚠️' : 'Blocking Bots 🚫');
              
              return (
                <div key={index} className="transition-all duration-300 hover:scale-[1.02]">
                  <SeoStatusIndicator
                    status={status}
                    label={`${getMetricEmoji(metric.label)} ${metric.label}`}
                    value={value}
                  />
                </div>
              );
            }

            // Standard metrics display (including Alt Text) - Mobile responsive layout
            return (
              <div 
                key={index} 
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-[1.02] space-y-2 sm:space-y-0"
              >
                <div className="flex items-center space-x-2 flex-shrink-0 min-w-0">
                  <span className="text-lg">{getMetricEmoji(metric.label)}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{metric.label}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 sm:ml-auto">
                  <div className="flex items-center space-x-2">
                    <Progress value={metric.score} className="w-16" />
                    <span className={`text-sm font-medium ${getScoreColor(metric.score)} transition-colors duration-300`}>
                      {metric.score}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                    {getMetricMotivation(metric.label, metric.score)}
                  </div>
                  
                  {metric.issues > 0 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="destructive" className="text-xs cursor-help animate-pulse">
                          🔴 {metric.issues} issues
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600">
                        <p className="text-sm">{metric.issueDetails}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="text-4xl animate-pulse">⏳</div>
            <div className="text-gray-500 dark:text-gray-400">
              {isAnalyzing ? 'Analyzing SEO metrics...' : 'No content available for analysis'}
            </div>
            {isAnalyzing && (
              <div className="w-32 mx-auto bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full animate-pulse" style={{ width: '40%' }}></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoMetricsGrid;
