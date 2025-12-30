
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Eye, MousePointer, BarChart3, Target } from 'lucide-react';
import { PerformanceData } from '@/types/searchConsole';

interface PerformanceChartProps {
  performance: PerformanceData;
}

const PerformanceChart = ({ performance }: PerformanceChartProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['clicks', 'impressions']);

  // Generate time series data (last 28 days)
  const generateChartData = () => {
    const data = [];
    const baseDate = new Date();
    
    for (let i = 27; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      // Simulate realistic daily variations
      const dayFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
      const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1.0; // Weekend reduction
      
      data.push({
        date: date.toISOString().split('T')[0],
        dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        clicks: Math.round(performance.totalClicks / 28 * dayFactor * weekendFactor),
        impressions: Math.round(performance.totalImpressions / 28 * dayFactor * weekendFactor),
        ctr: performance.averageCTR + (Math.random() - 0.5) * 2, // CTR with some variation
        position: performance.averagePosition + (Math.random() - 0.5) * 1, // Position with some variation
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  const metricConfig = {
    clicks: {
      label: 'Clicks',
      color: '#3b82f6',
      icon: MousePointer,
      yAxisId: 'left'
    },
    impressions: {
      label: 'Impressions',
      color: '#10b981',
      icon: Eye,
      yAxisId: 'left'
    },
    ctr: {
      label: 'CTR (%)',
      color: '#8b5cf6',
      icon: BarChart3,
      yAxisId: 'right'
    },
    position: {
      label: 'Avg Position',
      color: '#f59e0b',
      icon: Target,
      yAxisId: 'right'
    }
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      if (!data) return null;

      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{data.dateLabel}</p>
          {selectedMetrics.map((metric) => {
            const config = metricConfig[metric as keyof typeof metricConfig];
            const value = data[metric];
            const Icon = config.icon;
            
            return (
              <div key={metric} className="flex items-center space-x-2 text-sm">
                <Icon className="h-3 w-3" style={{ color: config.color }} />
                <span>{config.label}:</span>
                <span className="font-semibold">
                  {metric === 'ctr' ? `${value.toFixed(1)}%` : 
                   metric === 'position' ? value.toFixed(1) :
                   formatNumber(value)}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Performance Trend</CardTitle>
          <div className="flex flex-wrap gap-2">
            {Object.entries(metricConfig).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = selectedMetrics.includes(key);
              
              return (
                <Button
                  key={key}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleMetric(key)}
                  className="text-xs"
                  style={isSelected ? { backgroundColor: config.color, borderColor: config.color } : {}}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="dateLabel" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              
              {/* Left Y-Axis for Clicks & Impressions */}
              {(selectedMetrics.includes('clicks') || selectedMetrics.includes('impressions')) && (
                <YAxis 
                  yAxisId="left" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatNumber}
                />
              )}
              
              {/* Right Y-Axis for CTR & Position */}
              {(selectedMetrics.includes('ctr') || selectedMetrics.includes('position')) && (
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => 
                    selectedMetrics.includes('ctr') && selectedMetrics.includes('position')
                      ? value.toFixed(1)
                      : selectedMetrics.includes('ctr') 
                        ? `${value.toFixed(1)}%`
                        : value.toFixed(1)
                  }
                />
              )}
              
              <ChartTooltip content={<CustomTooltip />} />
              
              {selectedMetrics.map((metric) => {
                const config = metricConfig[metric as keyof typeof metricConfig];
                return (
                  <Line
                    key={metric}
                    yAxisId={config.yAxisId}
                    type="monotone"
                    dataKey={metric}
                    stroke={config.color}
                    strokeWidth={2}
                    dot={{ fill: config.color, strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: config.color, strokeWidth: 2 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>Click the metric buttons above to toggle them on/off in the chart. Data shows the last 28 days.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
