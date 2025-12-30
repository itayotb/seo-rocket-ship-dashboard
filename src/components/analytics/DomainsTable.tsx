
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { DomainTableData } from '@/types/analytics';

interface DomainsTableProps {
  domains: DomainTableData[];
}

const DomainsTable: React.FC<DomainsTableProps> = ({ domains }) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortBy, setSortBy] = useState<'clicks' | 'impressions' | 'domain'>('clicks');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const sortedDomains = [...domains].sort((a, b) => {
    const multiplier = sortOrder === 'desc' ? -1 : 1;
    switch (sortBy) {
      case 'clicks':
        return (a.totalClicks - b.totalClicks) * multiplier;
      case 'impressions':
        return (a.totalImpressions - b.totalImpressions) * multiplier;
      case 'domain':
        return a.domain.localeCompare(b.domain) * multiplier;
      default:
        return 0;
    }
  });

  const visibleDomains = sortedDomains.slice(0, visibleCount);
  const hasMore = visibleCount < domains.length;

  const handleSort = (column: 'clicks' | 'impressions' | 'domain') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, domains.length));
  };

  const showLess = () => {
    setVisibleCount(10);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Domains Performance</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clicks">Sort by Clicks</SelectItem>
                <SelectItem value="impressions">Sort by Impressions</SelectItem>
                <SelectItem value="domain">Sort by Domain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 min-w-[200px]"
                  onClick={() => handleSort('domain')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Domain</span>
                    {getSortIcon('domain')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-right"
                  onClick={() => handleSort('clicks')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Total Clicks</span>
                    {getSortIcon('clicks')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-right"
                  onClick={() => handleSort('impressions')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Total Impressions</span>
                    {getSortIcon('impressions')}
                  </div>
                </TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="hidden sm:table-cell">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleDomains.map((domain, index) => (
                <TableRow key={domain.domain}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 hidden sm:inline">#{index + 1}</span>
                      <span className="font-medium break-all">{domain.domain}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">{formatNumber(domain.totalClicks)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-gray-600">{formatNumber(domain.totalImpressions)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">{domain.ctr.toFixed(1)}%</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm text-gray-500">{domain.lastUpdated}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing {visibleCount} of {domains.length} domains
          </div>
          
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            {hasMore && (
              <Button variant="outline" onClick={loadMore} size="sm">
                Load 10 More
              </Button>
            )}
            {visibleCount > 10 && (
              <Button variant="ghost" onClick={showLess} size="sm">
                Show Less
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainsTable;
