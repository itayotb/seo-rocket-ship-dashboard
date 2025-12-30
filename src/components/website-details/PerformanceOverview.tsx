
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Target,
  BarChart3
} from 'lucide-react';
import { PerformanceData } from '@/types/searchConsole';

interface PerformanceOverviewProps {
  performance: PerformanceData;
}

const PerformanceOverview = ({ performance }: PerformanceOverviewProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatChange = (change: number) => {
    const isPositive = change > 0;
    return (
      <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
        {change !== 0 && (isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)}
        <span className="text-xs">
          {isPositive ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>
    );
  };

  const metrics = [
    {
      title: 'Total Clicks',
      value: formatNumber(performance.totalClicks),
      change: performance.clicksChange,
      icon: MousePointer,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Impressions',
      value: formatNumber(performance.totalImpressions),
      change: performance.impressionsChange,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Average CTR',
      value: performance.averageCTR.toFixed(1) + '%',
      change: performance.ctrChange,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Average Position',
      value: performance.averagePosition.toFixed(1),
      change: -performance.positionChange, // Negative because lower position is better
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                {formatChange(metric.change)}
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.title}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PerformanceOverview;
