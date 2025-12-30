
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TimeSeriesData } from '@/types/analytics';

interface AnalyticsChartProps {
  data: TimeSeriesData[];
  title: string;
  dataKeys?: (keyof TimeSeriesData)[];
  colors?: string[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
  data, 
  title, 
  dataKeys = ['traffic'], 
  colors = ['#3b82f6'] 
}) => {
  const chartConfig = dataKeys.reduce((config, key, index) => {
    config[key] = {
      label: key === 'traffic' ? 'Traffic' : key === 'impressions' ? 'Impressions' : key,
      color: colors[index] || '#3b82f6',
    };
    return config;
  }, {} as any);

  const formatValue = (value: number, dataKey?: string) => {
    if (dataKey === 'traffic' || dataKey === 'impressions') return `${(value / 1000).toFixed(1)}K`;
    if (dataKey === 'seoScore') return value.toString();
    return value.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis tickFormatter={(value) => formatValue(value)} />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            {dataKeys.map((dataKey, index) => (
              <Line 
                key={dataKey}
                type="monotone" 
                dataKey={dataKey} 
                stroke={colors[index] || '#3b82f6'} 
                strokeWidth={2}
                dot={{ fill: colors[index] || '#3b82f6', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
