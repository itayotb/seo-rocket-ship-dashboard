
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, Eye, MousePointer } from 'lucide-react';
import { DrillDownContext } from '@/hooks/useSearchConsole';
import QueriesTable from './QueriesTable';
import PagesTable from './PagesTable';

interface DrillDownViewProps {
  context: DrillDownContext;
  data: any;
  onBack: () => void;
  formatNumber: (num: number) => string;
  formatChange: (change: number) => React.ReactNode;
}

const DrillDownView = ({ context, data, onBack, formatNumber, formatChange }: DrillDownViewProps) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <div className="text-sm text-gray-500">
            / {context.type === 'query' ? 'Query' : 'Page'}: {context.name}
          </div>
        </div>
      </div>

      {/* Drill-down Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold">{formatNumber(data.totalClicks)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold">{formatNumber(data.totalImpressions)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded bg-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Average CTR</p>
                <p className="text-2xl font-bold">{data.averageCTR.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded bg-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Average Position</p>
                <p className="text-2xl font-bold">{data.averagePosition.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic and Device Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Countries Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.countries.map((country: any, index: number) => (
                <div key={country.countryCode} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.countryCode === 'US' ? '🇺🇸' : country.countryCode === 'GB' ? '🇬🇧' : '🇨🇦'}</span>
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatNumber(country.clicks)}</div>
                    <div className="text-sm text-gray-500">{country.ctr.toFixed(1)}% CTR</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.devices.map((device: any, index: number) => (
                <div key={device.device} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">
                      {device.device === 'mobile' ? '📱' : device.device === 'desktop' ? '💻' : '📱'}
                    </div>
                    <span className="font-medium capitalize">{device.device}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatNumber(device.clicks)}</div>
                    <div className="text-sm text-gray-500">{device.ctr.toFixed(1)}% CTR</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Queries or Pages */}
      {context.type === 'query' && data.pages && (
        <PagesTable pages={data.pages.slice(0, 5)} />
      )}
      
      {context.type === 'page' && data.queries && (
        <QueriesTable queries={data.queries.slice(0, 5)} />
      )}
    </div>
  );
};

export default DrillDownView;
