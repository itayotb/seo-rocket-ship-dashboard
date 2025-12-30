import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, PieChart } from 'lucide-react';
import { LeadForm } from '@/types/leadForm';
import { LeadFormDistribution } from '@/types/bulkWebsiteCreation';

interface BulkStepLeadFormsProps {
  leadForms: LeadForm[];
  distribution: LeadFormDistribution[];
  totalKeywords: number;
  onDistributionChange: (distribution: LeadFormDistribution[]) => void;
}

const BulkStepLeadForms = ({
  leadForms,
  distribution,
  totalKeywords,
  onDistributionChange,
}: BulkStepLeadFormsProps) => {
  const totalPercentage = distribution.reduce((sum, d) => sum + d.percentage, 0);
  const isValid = totalPercentage === 100;

  const handlePercentageChange = (leadFormId: string, percentage: number) => {
    const existingIndex = distribution.findIndex((d) => d.leadFormId === leadFormId);
    
    if (existingIndex >= 0) {
      const newDistribution = [...distribution];
      if (percentage === 0) {
        newDistribution.splice(existingIndex, 1);
      } else {
        newDistribution[existingIndex] = {
          ...newDistribution[existingIndex],
          percentage,
        };
      }
      onDistributionChange(newDistribution);
    } else if (percentage > 0) {
      const form = leadForms.find((f) => f.id === leadFormId);
      if (form) {
        onDistributionChange([
          ...distribution,
          { leadFormId, leadFormName: form.name, percentage },
        ]);
      }
    }
  };

  const getDistributionForForm = (formId: string): number => {
    return distribution.find((d) => d.leadFormId === formId)?.percentage || 0;
  };

  const getSitesCount = (percentage: number): number => {
    return Math.round((percentage / 100) * totalKeywords);
  };

  // Colors for the pie chart visualization
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Lead Form Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Distribute lead forms across your {totalKeywords} websites. Total must equal 100%.
        </p>
      </div>

      {!isValid && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Distribution total is {totalPercentage}%. Must equal 100%.
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {leadForms.map((form, index) => {
            const percentage = getDistributionForForm(form.id);
            const sitesCount = getSitesCount(percentage);
            
            return (
              <Card key={form.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      {form.name}
                    </span>
                    <Badge variant={percentage > 0 ? 'default' : 'outline'}>
                      {percentage}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Slider
                    value={[percentage]}
                    onValueChange={([value]) => handlePercentageChange(form.id, value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium">
                      {sitesCount} site{sitesCount !== 1 ? 's' : ''}
                    </span>
                    <span>100%</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {leadForms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              No lead forms available. Create lead forms first.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Distribution Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {distribution.filter((d) => d.percentage > 0).map((d, index) => {
                  const sitesCount = getSitesCount(d.percentage);
                  return (
                    <div key={d.leadFormId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-sm">{d.leadFormName}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {sitesCount} sites ({d.percentage}%)
                      </span>
                    </div>
                  );
                })}
                
                {distribution.filter((d) => d.percentage > 0).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Adjust sliders to distribute lead forms
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span className={isValid ? 'text-green-500' : 'text-destructive'}>
                    {totalPercentage}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Sites are distributed based on percentages</p>
            <p>• Rounding may cause slight variations</p>
            <p>• At least one form must have a percentage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkStepLeadForms;
