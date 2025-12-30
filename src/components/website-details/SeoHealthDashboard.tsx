
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { SeoMetric } from '@/types/seo';

interface SeoHealthDashboardProps {
  metrics: SeoMetric[];
  overallScore: number;
}

const SeoHealthDashboard: React.FC<SeoHealthDashboardProps> = ({
  metrics,
  overallScore
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  const getMetricIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>SEO Health Dashboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}/100
          </div>
          <div className="text-lg text-gray-600 mb-4">
            {getScoreStatus(overallScore)}
          </div>
          <Progress value={overallScore} className="h-3" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getMetricIcon(metric.status)}
                <div>
                  <div className="font-medium">{metric.label}</div>
                  <div className="text-sm text-gray-600">Target: {metric.target}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{metric.value}</div>
                {metric.improvement && (
                  <div className="text-xs text-gray-500 max-w-32">
                    {metric.improvement}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {metrics.filter(m => m.status === 'good').length}
            </div>
            <div className="text-sm text-gray-600">Optimized</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-600">
              {metrics.filter(m => m.status === 'warning').length}
            </div>
            <div className="text-sm text-gray-600">Needs Work</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {metrics.filter(m => m.status === 'critical').length}
            </div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoHealthDashboard;
