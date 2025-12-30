import React, { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, PieChart, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const totalPercentage = distribution.reduce((sum, d) => sum + d.percentage, 0);
  const isValid = totalPercentage === 100;

  // Get unique categories from lead forms
  const categories = useMemo(() => {
    const cats = new Set(leadForms.map((f) => f.category).filter(Boolean));
    return Array.from(cats);
  }, [leadForms]);

  // Filter lead forms by search and category
  const filteredLeadForms = useMemo(() => {
    let filtered = leadForms;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [leadForms, selectedCategory, searchQuery]);

  // Group filtered forms by category
  const groupedForms = useMemo(() => {
    const groups: Record<string, LeadForm[]> = {};
    filteredLeadForms.forEach((form) => {
      const category = form.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(form);
    });
    return groups;
  }, [filteredLeadForms]);

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

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Lead Form Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Distribute lead forms across your {totalKeywords} websites. Total must equal 100%.
        </p>
      </div>

      {!isValid && distribution.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Distribution total is {totalPercentage}%. Must equal 100%.
          </span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lead forms..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('all')}
          >
            All ({leadForms.length})
          </Badge>
          {categories.map((cat) => {
            const count = leadForms.filter((f) => f.category === cat).length;
            return (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} ({count})
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4 max-h-[400px] overflow-auto pr-2">
          {Object.entries(groupedForms).map(([category, forms]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1">
                {category} ({forms.length})
              </h4>
              {forms.map((form, index) => {
                const percentage = getDistributionForForm(form.id);
                const sitesCount = getSitesCount(percentage);
                const colorIndex = distribution.findIndex((d) => d.leadFormId === form.id);
                
                return (
                  <Card key={form.id}>
                    <CardHeader className="pb-2 pt-3 px-4">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {percentage > 0 && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: colors[colorIndex % colors.length] }}
                            />
                          )}
                          <span className="line-clamp-1">{form.name}</span>
                        </span>
                        <Badge variant={percentage > 0 ? 'default' : 'outline'} className="ml-2">
                          {percentage}%
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-3 px-4">
                      <Slider
                        value={[percentage]}
                        onValueChange={([value]) => handlePercentageChange(form.id, value)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {form.category}
                        </Badge>
                        <span className="font-medium">
                          {sitesCount} site{sitesCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))}

          {filteredLeadForms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              {leadForms.length === 0 
                ? 'No lead forms available. Create lead forms first.'
                : 'No lead forms match your search.'}
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
                  const form = leadForms.find((f) => f.id === d.leadFormId);
                  return (
                    <div key={d.leadFormId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <div>
                          <span className="text-sm">{d.leadFormName}</span>
                          {form?.category && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({form.category})
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {sitesCount} ({d.percentage}%)
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
            <p>• Search forms by name or category</p>
            <p>• Filter by category badges</p>
            <p>• Total distribution must equal 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkStepLeadForms;
