
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { ReportFilters } from '@/types/reports';

interface HistoricalChartsSectionProps {
  filters: ReportFilters;
}

const HistoricalChartsSection: React.FC<HistoricalChartsSectionProps> = ({ filters }) => {
  // Mock historical data
  const rankingHistory = [
    { date: '2024-01-01', position: 15, keyword: 'react components', clicks: 120 },
    { date: '2024-01-15', position: 12, keyword: 'react components', clicks: 150 },
    { date: '2024-02-01', position: 8, keyword: 'react components', clicks: 200 },
    { date: '2024-02-15', position: 6, keyword: 'react components', clicks: 280 },
    { date: '2024-03-01', position: 4, keyword: 'react components', clicks: 350 },
    { date: '2024-03-15', position: 3, keyword: 'react components', clicks: 420 },
  ];

  const trafficTrends = [
    { date: '2024-01-01', organic: 1200, direct: 800, referral: 400 },
    { date: '2024-01-15', organic: 1350, direct: 750, referral: 450 },
    { date: '2024-02-01', organic: 1500, direct: 900, referral: 500 },
    { date: '2024-02-15', organic: 1800, direct: 950, referral: 550 },
    { date: '2024-03-01', organic: 2100, direct: 1000, referral: 600 },
    { date: '2024-03-15', organic: 2400, direct: 1100, referral: 650 },
  ];

  const chartConfig = {
    position: {
      label: 'Position',
      color: '#ef4444',
    },
    clicks: {
      label: 'Clicks',
      color: '#3b82f6',
    },
    organic: {
      label: 'Organic',
      color: '#10b981',
    },
    direct: {
      label: 'Direct',
      color: '#f59e0b',
    },
    referral: {
      label: 'Referral',
      color: '#8b5cf6',
    }
  };

  if (filters.websites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Historical Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Select websites to view historical performance charts
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center space-x-2">
        <Calendar className="h-5 w-5" />
        <span>Historical Performance</span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keyword Ranking History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Keyword Ranking Trends</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Improved by 12 positions</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Top keyword: "react components"</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart data={rankingHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  domain={[1, 20]}
                  reversed={true}
                  tickFormatter={(value) => `#${value}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="position" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Traffic Source Trends</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Organic traffic +100%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={trafficTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Bar dataKey="organic" fill="#10b981" />
                <Bar dataKey="direct" fill="#f59e0b" />
                <Bar dataKey="referral" fill="#8b5cf6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoricalChartsSection;
