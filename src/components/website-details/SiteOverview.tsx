
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Clock, TrendingUp, TrendingDown, Minus, CheckCircle, XCircle, MousePointer, Tag } from 'lucide-react';
import { Website } from '@/types/website';

interface SiteOverviewProps {
  website: Website;
}

const SiteOverview = ({ website }: SiteOverviewProps) => {
  const getRankingIcon = (change: string) => {
    switch (change) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatClicks = (clicks?: number) => {
    if (!clicks) return '0';
    if (clicks >= 1000000) return (clicks / 1000000).toFixed(1) + 'M';
    if (clicks >= 1000) return (clicks / 1000).toFixed(1) + 'K';
    return clicks.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Domain</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{website.domain}</div>
          <div className="flex items-center space-x-2 mt-2">
            {getStatusIcon(website.status)}
            <span className="text-sm text-muted-foreground capitalize">
              {website.status}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Category</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{website.category}</div>
          <p className="text-xs text-muted-foreground">
            Website category
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Google Position</CardTitle>
          {getRankingIcon(website.rankingChange)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#{website.googlePosition}</div>
          <p className="text-xs text-muted-foreground">
            Ranking {website.rankingChange === 'stable' ? 'stable' : `trending ${website.rankingChange}`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clicks</CardTitle>
          <MousePointer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatClicks(website.totalClicks)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total website clicks
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getScoreColor(website.seoScore)}`}>
            {website.seoScore}/100
          </div>
          <Badge variant={website.seoScore >= 80 ? 'default' : 'destructive'} className="mt-2">
            {website.seoScore >= 80 ? 'Good' : 'Needs Improvement'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{website.lastUpdated}</div>
          <p className="text-xs text-muted-foreground">
            Site analysis refresh
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteOverview;
