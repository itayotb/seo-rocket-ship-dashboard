
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { QueryPerformance } from '@/types/searchConsole';

interface QueriesTableProps {
  queries: QueryPerformance[];
  onQueryClick?: (query: string, queryName: string) => void;
  showClickableHint?: boolean;
}

const QueriesTable = ({ queries, onQueryClick, showClickableHint = false }: QueriesTableProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Top Performing Queries
          {showClickableHint && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              Click on a query to see detailed breakdown
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Query</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((query, index) => (
              <TableRow 
                key={index}
                className={onQueryClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" : ""}
                onClick={() => onQueryClick && onQueryClick(query.query, query.query)}
              >
                <TableCell>
                  <div className="font-medium">{query.query}</div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{formatNumber(query.clicks)}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600">{formatNumber(query.impressions)}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {query.ctr.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{query.position.toFixed(1)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(query.trend)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default QueriesTable;
