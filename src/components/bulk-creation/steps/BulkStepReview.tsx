import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Globe, Layout, FileText, Calendar, AlertCircle } from 'lucide-react';
import { BulkCreationData } from '@/types/bulkWebsiteCreation';
import { calculateCompletionEstimate } from '@/utils/bulkCreationMock';
import { format } from 'date-fns';

interface BulkStepReviewProps {
  data: BulkCreationData;
}

const BulkStepReview = ({ data }: BulkStepReviewProps) => {
  const estimate = calculateCompletionEstimate(data.keywords.length, data.scheduling);
  
  const validKeywords = data.keywords.filter((kw) => kw.keyword.trim());
  const totalDistribution = data.leadFormDistribution.reduce((sum, d) => sum + d.percentage, 0);
  const isValid = validKeywords.length > 0 && data.templateId && totalDistribution === 100;

  const getSchedulingDescription = () => {
    switch (data.scheduling.mode) {
      case 'immediate':
        return 'Create all sites immediately';
      case 'per_days':
        return `${data.scheduling.sitesPerInterval} site(s) every ${data.scheduling.intervalDays} day(s)`;
      case 'distribute_month':
        return `Distribute over ${data.scheduling.totalDays} days`;
      default:
        return '-';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Review & Confirm</h3>
        <p className="text-sm text-muted-foreground">
          Review your bulk creation settings before starting.
        </p>
      </div>

      {!isValid && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Please fix the following issues before proceeding:
            {validKeywords.length === 0 && ' Add at least one keyword.'}
            {!data.templateId && ' Select a template.'}
            {totalDistribution !== 100 && ' Lead form distribution must equal 100%.'}
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Keywords & Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Keywords</span>
                <span className="font-medium">{validKeywords.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Domain Mode</span>
                <Badge variant="secondary">
                  {data.domainMode === 'auto' ? `Auto (${data.tld})` : 'Manual'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Template & Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Template</span>
                <span className="font-medium">{data.templateName || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <Badge variant="secondary">{data.category || 'All'}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Lead Forms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.leadFormDistribution.filter((d) => d.percentage > 0).map((d) => (
                <div key={d.leadFormId} className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{d.leadFormName}</span>
                  <span className="font-medium">{d.percentage}%</span>
                </div>
              ))}
              {data.leadFormDistribution.filter((d) => d.percentage > 0).length === 0 && (
                <span className="text-sm text-muted-foreground">No distribution set</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Mode</span>
                <span className="font-medium">{getSchedulingDescription()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Est. Duration</span>
                <span className="font-medium">{estimate.days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completion</span>
                <span className="font-medium">{format(estimate.completionDate, 'MMM d, yyyy')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Sites to be Created (First 10 of {validKeywords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead>GEO</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead className="w-16">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validKeywords.slice(0, 10).map((kw, index) => (
                  <TableRow key={kw.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>{kw.keyword}</TableCell>
                    <TableCell>{kw.geo.toUpperCase()}</TableCell>
                    <TableCell className="font-mono text-xs">{kw.domain || '-'}</TableCell>
                    <TableCell>
                      {kw.domainStatus === 'available' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Badge variant="outline" className="text-xs">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          {validKeywords.length > 10 && (
            <p className="text-sm text-muted-foreground text-center mt-3">
              ...and {validKeywords.length - 10} more sites
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkStepReview;
