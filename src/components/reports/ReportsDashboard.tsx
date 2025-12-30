import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, BarChart3, Globe, TrendingUp, Users } from 'lucide-react';
import ReportTemplateCard from './ReportTemplateCard';
import ReportFilters from './ReportFilters';
import RecentReports from './RecentReports';
import HistoricalChartsSection from './HistoricalChartsSection';
import { ReportTemplate, ReportFilters as ReportFiltersType } from '@/types/reports';

interface ReportsDashboardProps {
  masterCategoryFilter: string;
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ masterCategoryFilter }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [filters, setFilters] = useState<ReportFiltersType>({
    timeframe: '30d',
    websites: []
  });

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'seo-overview',
      name: 'SEO Overview Report',
      description: 'Comprehensive SEO health report across all websites',
      type: 'seo-overview',
      icon: 'BarChart3',
      includeCharts: true,
      defaultTimeframe: '30d'
    },
    {
      id: 'keyword-performance',
      name: 'Keyword Performance Report',
      description: 'Detailed keyword rankings and performance metrics',
      type: 'keyword-performance',
      icon: 'TrendingUp',
      includeCharts: true,
      defaultTimeframe: '90d'
    },
    {
      id: 'website-health',
      name: 'Website Health Report',
      description: 'Technical SEO issues and recommendations',
      type: 'website-health',
      icon: 'Globe',
      includeCharts: false,
      defaultTimeframe: '7d'
    },
    {
      id: 'ranking-history',
      name: 'Ranking History Report',
      description: 'Historical ranking trends and changes over time',
      type: 'ranking-history',
      icon: 'Calendar',
      includeCharts: true,
      defaultTimeframe: '1y'
    }
  ];

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setFilters(prev => ({
      ...prev,
      timeframe: template.defaultTimeframe
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and export SEO reports for your websites
            {masterCategoryFilter !== 'all' && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                (filtered by {masterCategoryFilter})
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={filters.timeframe} onValueChange={(value: any) => setFilters(prev => ({ ...prev, timeframe: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTemplates.map((template) => (
          <ReportTemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={() => handleTemplateSelect(template)}
          />
        ))}
      </div>

      {/* Report Configuration */}
      {selectedTemplate && (
        <ReportFilters
          template={selectedTemplate}
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      {/* Historical Charts Section */}
      <HistoricalChartsSection filters={filters} />

      {/* Recent Reports */}
      <RecentReports />
    </div>
  );
};

export default ReportsDashboard;
