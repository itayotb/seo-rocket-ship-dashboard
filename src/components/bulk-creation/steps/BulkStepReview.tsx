import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Globe, Layout, FileText, Calendar, AlertCircle, Server } from 'lucide-react';
import { BulkCreationData, REGISTRAR_OPTIONS } from '@/types/bulkWebsiteCreation';
import { calculateCompletionEstimate } from '@/utils/bulkCreationMock';
import { format } from 'date-fns';

interface BulkStepReviewProps {
  data: BulkCreationData;
}

const BulkStepReview = ({ data }: BulkStepReviewProps) => {
  const estimate = calculateCompletionEstimate(data.keywords.length, data.scheduling);
  
  const validKeywords = data.keywords.filter((kw) => kw.keyword.trim());
  const totalLeadFormDistribution = data.leadFormDistribution.reduce((sum, d) => sum + d.percentage, 0);
  const totalTemplateDistribution = data.templateDistribution.reduce((sum, d) => sum + d.percentage, 0);
  const totalRegistrarDistribution = data.registrarDistribution.reduce((sum, d) => sum + d.percentage, 0);
  
  const hasTemplates = data.templateDistribution.length > 0 && totalTemplateDistribution === 100;
  const hasLeadForms = totalLeadFormDistribution === 100;
  const hasRegistrars = data.registrarDistribution.length === 0 || totalRegistrarDistribution === 100;
  
  const isValid = validKeywords.length > 0 && hasTemplates && hasLeadForms && hasRegistrars;

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

  const availableCount = validKeywords.filter((kw) => kw.domainStatus === 'available').length;

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
            {!hasTemplates && ' Select templates (total must be 100%).'}
            {!hasLeadForms && ' Lead form distribution must equal 100%.'}
            {!hasRegistrars && ' Registrar distribution must equal 100%.'}
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
                <span className="text-sm text-muted-foreground">Available Domains</span>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  {availableCount}/{validKeywords.length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Domain Mode</span>
                <Badge variant="secondary">
                  {data.domainMode === 'auto' ? `Auto (${data.defaultTld})` : 'Manual'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Templates ({data.templateDistribution.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.templateDistribution.filter((d) => d.percentage > 0).map((d) => (
                <div key={d.templateId} className="flex justify-between">
                  <span className="text-sm text-muted-foreground line-clamp-1">{d.templateName}</span>
                  <span className="font-medium">{d.percentage}%</span>
                </div>
              ))}
              {data.templateDistribution.length === 0 && (
                <span className="text-sm text-muted-foreground">No templates selected</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4" />
              Registrars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.registrarDistribution.filter((d) => d.percentage > 0).map((d) => (
                <div key={d.registrarId} className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{d.registrarName}</span>
                  <span className="font-medium">{d.percentage}%</span>
                </div>
              ))}
              {data.registrarDistribution.filter((d) => d.percentage > 0).length === 0 && (
                <span className="text-sm text-muted-foreground">No registrar distribution set</span>
              )}
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

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Mode</p>
                <p className="font-medium">{getSchedulingDescription()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Duration</p>
                <p className="font-medium">{estimate.days} days</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="font-medium">{format(estimate.completionDate, 'MMM d, yyyy')}</p>
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
                  <TableHead>TLD</TableHead>
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
                    <TableCell className="font-mono text-xs">{kw.tld}</TableCell>
                    <TableCell className="font-mono text-xs">{kw.domain || '-'}</TableCell>
                    <TableCell>
                      {kw.domainStatus === 'available' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Badge variant="outline" className="text-xs">{kw.domainStatus}</Badge>
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
