
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Globe, Target } from 'lucide-react';
import { AnalyticsKPI } from '@/types/analytics';

interface AnalyticsKPICardProps {
  kpi: AnalyticsKPI;
}

const AnalyticsKPICard: React.FC<AnalyticsKPICardProps> = ({ kpi }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trending-up':
        return TrendingUp;
      case 'trending-down':
        return TrendingDown;
      case 'globe':
        return Globe;
      case 'target':
        return Target;
      default:
        return TrendingUp;
    }
  };

  const Icon = getIcon(kpi.icon);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'green':
        return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'orange':
        return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      case 'purple':
        return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {kpi.title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${getColorClasses(kpi.color)}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.value}</div>
        <div className="flex items-center space-x-2 text-sm">
          <span className={`font-medium ${
            kpi.changeType === 'positive' 
              ? 'text-green-600' 
              : kpi.changeType === 'negative' 
                ? 'text-red-600' 
                : 'text-gray-600'
          }`}>
            {kpi.changeType === 'positive' ? '+' : ''}{kpi.change}%
          </span>
          <span className="text-muted-foreground">from last period</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsKPICard;
