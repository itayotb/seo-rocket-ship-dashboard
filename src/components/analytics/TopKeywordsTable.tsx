
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Search, ExternalLink } from 'lucide-react';
import { KeywordPerformance } from '@/types/analytics';

interface TopKeywordsTableProps {
  keywords: KeywordPerformance[];
}

const TopKeywordsTable: React.FC<TopKeywordsTableProps> = ({ keywords }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'bg-green-100 text-green-800';
    if (position <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Top Keywords by Clicks</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword, index) => (
              <TableRow key={keyword.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="font-medium">{keyword.keyword}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer">{keyword.websiteUrl}</span>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{formatNumber(keyword.clicks)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">{formatNumber(keyword.impressions)}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{keyword.ctr.toFixed(1)}%</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getPositionColor(keyword.position)}>
                    {keyword.position.toFixed(1)}
                  </Badge>
                </TableCell>
                <TableCell>{getTrendIcon(keyword.trend)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopKeywordsTable;
