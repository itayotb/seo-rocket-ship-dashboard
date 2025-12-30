
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { WebsitePerformance } from '@/types/analytics';

interface PerformersTableProps {
  title: string;
  websites: WebsitePerformance[];
  type: 'top' | 'bottom';
}

const PerformersTable: React.FC<PerformersTableProps> = ({ title, websites, type }) => {
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

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Website</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>SEO Score</TableHead>
                <TableHead className="text-right">Traffic</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {websites.map((website) => (
                <TableRow key={website.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{website.name}</div>
                      <div className="text-sm text-muted-foreground break-all">{website.domain}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="capitalize">
                      {website.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getSeoScoreColor(website.seoScore)}>
                      {website.seoScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(website.traffic)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">{getTrendIcon(website.trend)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformersTable;
