
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  BarChart3,
  Globe,
  Smartphone,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Website } from '@/types/website';
import { useSearchConsole } from '@/hooks/useSearchConsole';
import PerformanceOverview from './PerformanceOverview';
import QueriesTable from './QueriesTable';
import PagesTable from './PagesTable';
import DrillDownView from './DrillDownView';
import PerformanceChart from './PerformanceChart';

interface SearchConsoleProps {
  website: Website;
}

const SearchConsole = ({ website }: SearchConsoleProps) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('28days');
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  const { 
    searchConsoleData, 
    drillDownContext, 
    getPerformanceMetrics, 
    getTopQueries, 
    getTopPages,
    getDrillDownMetrics,
    setDrillDown,
    clearDrillDown 
  } = useSearchConsole();

  const timePeriodOptions = [
    { value: '24hours', label: '24 Hours' },
    { value: '7days', label: '7 Days' },
    { value: '28days', label: '28 Days' },
    { value: '3months', label: '3 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const performance = getPerformanceMetrics(timePeriod);
  const drillDownData = getDrillDownMetrics(drillDownContext, timePeriod);
  const isDrillDown = drillDownContext.type !== null;

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

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
    if (value === 'custom') {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
      setCustomDateRange({ from: undefined, to: undefined });
    }
  };

  const handleQueryClick = (query: string, queryName: string) => {
    setDrillDown('query', query, queryName);
    setSelectedTab('overview');
  };

  const handlePageClick = (page: string, pageName: string) => {
    setDrillDown('page', page, pageName);
    setSelectedTab('overview');
  };

  const handleBackToOverview = () => {
    clearDrillDown();
  };

  const getDateRangeLabel = () => {
    if (timePeriod !== 'custom') {
      return timePeriodOptions.find(option => option.value === timePeriod)?.label;
    }
    
    if (customDateRange.from && customDateRange.to) {
      return `${format(customDateRange.from, 'MMM dd')} - ${format(customDateRange.to, 'MMM dd')}`;
    }
    
    if (customDateRange.from) {
      return `From ${format(customDateRange.from, 'MMM dd, yyyy')}`;
    }
    
    return 'Custom Range';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Google Search Console</span>
            {isDrillDown && (
              <Badge variant="outline" className="ml-2">
                {drillDownContext.type === 'query' ? 'Query' : 'Page'}: {drillDownContext.name}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timePeriodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {showCustomDatePicker && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-auto justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getDateRangeLabel()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={customDateRange.from}
                    selected={{
                      from: customDateRange.from,
                      to: customDateRange.to,
                    }}
                    onSelect={(range) => {
                      setCustomDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                    }}
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isDrillDown ? (
          <DrillDownView
            context={drillDownContext}
            data={drillDownData}
            onBack={handleBackToOverview}
            formatNumber={formatNumber}
            formatChange={formatChange}
          />
        ) : (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="queries">
                <Search className="h-4 w-4 mr-2" />
                Queries
              </TabsTrigger>
              <TabsTrigger value="pages">
                <Globe className="h-4 w-4 mr-2" />
                Pages
              </TabsTrigger>
              <TabsTrigger value="countries">
                <Smartphone className="h-4 w-4 mr-2" />
                Geographic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <PerformanceOverview performance={performance} />
              <PerformanceChart performance={performance} />
            </TabsContent>

            <TabsContent value="queries" className="space-y-6">
              <QueriesTable 
                queries={getTopQueries()} 
                onQueryClick={handleQueryClick}
                showClickableHint={true}
              />
            </TabsContent>

            <TabsContent value="pages" className="space-y-6">
              <PagesTable 
                pages={getTopPages()} 
                onPageClick={handlePageClick}
                showClickableHint={true}
              />
            </TabsContent>

            <TabsContent value="countries" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Top Countries</h4>
                  <div className="space-y-3">
                    {performance.countries.map((country, index) => (
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
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Device Breakdown</h4>
                  <div className="space-y-3">
                    {performance.devices.map((device, index) => (
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
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchConsole;
