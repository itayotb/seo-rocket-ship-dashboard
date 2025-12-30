
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Wand2, Edit3, Target, TrendingUp } from 'lucide-react';
import { WebsiteSeoAnalysis } from '@/utils/websiteSeoAnalyzer';
import { ContentItem } from '@/types/website';
import { analyzeSeoIssues } from '@/utils/seo';

interface QuickWinsProps {
  seoAnalysis: WebsiteSeoAnalysis;
  contentItems: ContentItem[];
  onAutoFix: (updatedItem: ContentItem) => void;
  onEditContent: (item: ContentItem) => void;
}

const QuickWins: React.FC<QuickWinsProps> = ({
  seoAnalysis,
  contentItems,
  onAutoFix,
  onEditContent
}) => {
  // Generate actionable insights based on the analysis
  const getQuickWins = () => {
    const wins: Array<{
      id: string;
      emoji: string;
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      effort: 'easy' | 'medium' | 'hard';
      action: () => void;
      actionLabel: string;
    }> = [];

    // Check for auto-fixable issues
    const autoFixableIssues = contentItems.flatMap(item => 
      analyzeSeoIssues(item, onAutoFix, onEditContent)
        .filter(issue => issue.canAutoFix && issue.autoFixAction)
        .map(issue => ({ ...issue, sourceItem: item }))
    );

    if (autoFixableIssues.length > 0) {
      wins.push({
        id: 'auto-fix',
        emoji: '🪄',
        title: 'Auto-Fix Available Issues',
        description: `${autoFixableIssues.length} issues can be automatically fixed with one click`,
        impact: 'high',
        effort: 'easy',
        action: () => {
          autoFixableIssues.forEach(issue => {
            if (issue.autoFixAction) {
              issue.autoFixAction();
            }
          });
        },
        actionLabel: 'Fix All'
      });
    }

    // Check for critical issues that need manual attention
    if (seoAnalysis.criticalIssues > 0) {
      const criticalItems = contentItems.filter(item => 
        analyzeSeoIssues(item).some(issue => issue.severity === 'critical')
      );

      if (criticalItems.length > 0) {
        wins.push({
          id: 'critical-fix',
          emoji: '🚨',
          title: 'Fix Critical SEO Issues',
          description: `${seoAnalysis.criticalIssues} critical issues need immediate attention`,
          impact: 'high',
          effort: 'medium',
          action: () => onEditContent(criticalItems[0]),
          actionLabel: 'Edit Content'
        });
      }
    }

    // Check for content length improvements
    const shortContent = contentItems.filter(item => item.wordCount < 300);
    if (shortContent.length > 0) {
      wins.push({
        id: 'content-length',
        emoji: '📝',
        title: 'Expand Short Content',
        description: `${shortContent.length} pages have less than 300 words`,
        impact: 'medium',
        effort: 'medium',
        action: () => onEditContent(shortContent[0]),
        actionLabel: 'Expand Content'
      });
    }

    // Check for meta description improvements
    const poorMeta = contentItems.filter(item => 
      item.metaDescription.length < 120 || item.metaDescription.length > 160
    );
    if (poorMeta.length > 0) {
      wins.push({
        id: 'meta-desc',
        emoji: '📄',
        title: 'Optimize Meta Descriptions',
        description: `${poorMeta.length} pages need better meta descriptions`,
        impact: 'medium',
        effort: 'easy',
        action: () => onEditContent(poorMeta[0]),
        actionLabel: 'Optimize Meta'
      });
    }

    return wins.slice(0, 4); // Limit to top 4 wins
  };

  const quickWins = getQuickWins();

  if (quickWins.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-100">
            <span className="text-2xl">🏆</span>
            <span>Excellent Work!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 dark:text-green-300">
            Your SEO is in great shape! No immediate action items needed. Keep up the excellent work! 🎉
          </p>
        </CardContent>
      </Card>
    );
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-100">
          <span className="text-2xl animate-bounce">⚡</span>
          <Zap className="h-5 w-5" />
          <span>Quick Wins</span>
          <Badge variant="secondary" className="ml-2 animate-pulse">
            <Target className="h-3 w-3 mr-1" />
            {quickWins.length} Actions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickWins.map((win, index) => (
            <div 
              key={win.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{win.emoji}</span>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{win.title}</h4>
                </div>
                <div className="flex space-x-1">
                  <Badge className={`text-xs ${getImpactColor(win.impact)}`}>
                    {win.impact} impact
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{win.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`text-xs ${getEffortColor(win.effort)}`}>
                  {win.effort} effort
                </Badge>
                <Button 
                  size="sm" 
                  onClick={win.action}
                  className="transition-all duration-200 hover:scale-105"
                >
                  {win.actionLabel === 'Fix All' && <Wand2 className="h-3 w-3 mr-1" />}
                  {win.actionLabel.includes('Edit') && <Edit3 className="h-3 w-3 mr-1" />}
                  {win.actionLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Pro Tip:</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Start with high-impact, easy-effort wins for the biggest SEO boost with minimal time investment! 🚀
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickWins;
