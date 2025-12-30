
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Filter,
  BarChart3
} from 'lucide-react';
import { ContentItem } from '@/types/website';
import { analyzeSeoIssues, calculateSeoMetrics } from '@/utils/seo';
import SeoIssueCard from './SeoIssueCard';
import SeoHealthDashboard from './SeoHealthDashboard';

interface SeoAnalyticsProps {
  editedItem: ContentItem;
  calculateSeoScore: (item: ContentItem) => number;
}

const SeoAnalytics: React.FC<SeoAnalyticsProps> = ({
  editedItem,
  calculateSeoScore
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const seoScore = calculateSeoScore(editedItem);
  const issues = analyzeSeoIssues(editedItem);
  const metrics = calculateSeoMetrics(editedItem);

  const filteredIssues = issues.filter(issue => {
    const severityMatch = severityFilter === 'all' || issue.severity === severityFilter;
    const categoryMatch = categoryFilter === 'all' || issue.category === categoryFilter;
    return severityMatch && categoryMatch;
  });

  const issuesByPriority = {
    critical: issues.filter(i => i.severity === 'critical'),
    warning: issues.filter(i => i.severity === 'warning'),
    info: issues.filter(i => i.severity === 'info')
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="issues">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Issues ({issues.length})
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Target className="h-4 w-4 mr-2" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <SeoHealthDashboard metrics={metrics} overallScore={seoScore} />
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={severityFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('all')}
              >
                All Severities
              </Button>
              <Button
                variant={severityFilter === 'critical' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('critical')}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Critical ({issuesByPriority.critical.length})
              </Button>
              <Button
                variant={severityFilter === 'warning' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('warning')}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Warning ({issuesByPriority.warning.length})
              </Button>
              <Button
                variant={severityFilter === 'info' ? 'outline' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('info')}
              >
                <Info className="h-3 w-3 mr-1" />
                Info ({issuesByPriority.info.length})
              </Button>
            </div>
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            {filteredIssues.length > 0 ? (
              filteredIssues.map(issue => (
                <SeoIssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <div className="text-center py-8">
                {issues.length === 0 ? (
                  <div className="text-green-600">
                    <Target className="h-12 w-12 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold">No SEO Issues Found!</h3>
                    <p className="text-gray-600">Your content meets all SEO best practices.</p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <Filter className="h-12 w-12 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold">No Issues Match Your Filters</h3>
                    <p>Try adjusting your filter criteria to see more results.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-4 text-blue-900">SEO Best Practices</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="font-medium text-blue-800">Content Optimization</h5>
                <ul className="text-sm space-y-2 text-blue-700">
                  <li>• Aim for 300+ words for better search ranking</li>
                  <li>• Use descriptive, keyword-rich titles (30-60 characters)</li>
                  <li>• Write compelling meta descriptions (120-160 characters)</li>
                  <li>• Include relevant internal and external links</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h5 className="font-medium text-green-800">Structure & Readability</h5>
                <ul className="text-sm space-y-2 text-green-700">
                  <li>• Use proper heading structure (H1, H2, H3)</li>
                  <li>• Break content into digestible paragraphs</li>
                  <li>• Add bullet points and numbered lists</li>
                  <li>• Include relevant images with alt text</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Priority Action Items */}
          {issuesByPriority.critical.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-3">Priority Action Items</h4>
              <div className="space-y-2">
                {issuesByPriority.critical.slice(0, 3).map(issue => (
                  <div key={issue.id} className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <span className="font-medium text-red-900">{issue.title}:</span>
                      <span className="text-red-800 ml-1">{issue.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeoAnalytics;
