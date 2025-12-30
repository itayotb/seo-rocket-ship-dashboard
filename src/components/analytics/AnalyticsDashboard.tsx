
import React, { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnalyticsKPICard from './AnalyticsKPICard';
import PerformersTable from './PerformersTable';
import TopKeywordsTable from './TopKeywordsTable';
import DomainsTable from './DomainsTable';
import AnalyticsChart from './AnalyticsChart';
import { getAnalyticsDashboardData } from '@/utils/analytics';
import { AnalyticsFilters } from '@/types/analytics';

interface AnalyticsDashboardProps {
  masterCategoryFilter: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ masterCategoryFilter }) => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    timeframe: '30d',
    category: masterCategoryFilter,
    performanceLevel: 'all'
  });

  // Sync with master category filter
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: masterCategoryFilter
    }));
  }, [masterCategoryFilter]);

  // Memoize dashboard data to avoid unnecessary recalculations
  const dashboardData = useMemo(() => {
    return getAnalyticsDashboardData(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof AnalyticsFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Search Console insights across {dashboardData.totalWebsites} websites
            {filters.category !== 'all' && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                (filtered by {filters.category})
              </span>
            )}
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Select value={filters.timeframe} onValueChange={(value) => handleFilterChange('timeframe', value)}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="food">Food</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {dashboardData.kpis.map((kpi) => (
          <AnalyticsKPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Traffic Chart with Traffic and Impressions */}
      <div className="grid grid-cols-1 gap-6">
        <AnalyticsChart 
          data={dashboardData.timeSeriesData}
          title="Traffic & Impressions Trends"
          dataKeys={['traffic', 'impressions']}
          colors={['#3b82f6', '#10b981']}
        />
      </div>

      {/* Domains Performance Table - New Section */}
      <div className="grid grid-cols-1 gap-6">
        <DomainsTable domains={dashboardData.domainsTableData} />
      </div>

      {/* Top Keywords Section */}
      <div className="grid grid-cols-1 gap-6">
        <TopKeywordsTable keywords={dashboardData.topKeywords} />
      </div>

      {/* Top Performers - Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <PerformersTable 
          title="Top Performers"
          websites={dashboardData.topPerformers}
          type="top"
        />
      </div>

      {/* Needs Attention - Separate Section */}
      <div className="grid grid-cols-1 gap-6">
        <PerformersTable 
          title="Needs Attention"
          websites={dashboardData.bottomPerformers}
          type="bottom"
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
