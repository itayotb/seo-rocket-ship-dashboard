import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Check, PieChart, AlertCircle } from 'lucide-react';
import { Template } from '@/types/websiteCreation';
import { TemplateDistribution } from '@/types/bulkWebsiteCreation';
import { TEMPLATE_CATEGORIES } from '@/utils/templateCategories';

interface BulkStepTemplateProps {
  templates: Template[];
  templateDistribution: TemplateDistribution[];
  selectedCategory: string;
  totalKeywords: number;
  onTemplateDistributionChange: (distribution: TemplateDistribution[]) => void;
  onCategoryChange: (category: string) => void;
}

const BulkStepTemplate = ({
  templates,
  templateDistribution,
  selectedCategory,
  totalKeywords,
  onTemplateDistributionChange,
  onCategoryChange,
}: BulkStepTemplateProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const totalPercentage = templateDistribution.reduce((sum, d) => sum + d.percentage, 0);
  const isValid = totalPercentage === 100;

  const filteredTemplates = useMemo(() => {
    let filtered = templates;
    
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [templates, selectedCategory, searchQuery]);

  const handleTemplateToggle = (templateId: string, checked: boolean) => {
    if (checked) {
      const template = templates.find((t) => t.id === templateId);
      if (template && templateDistribution.length < 5) {
        // Auto-balance: new template gets equal share, others adjust
        const newCount = templateDistribution.length + 1;
        const equalShare = Math.floor(100 / newCount);
        const remainder = 100 - (equalShare * newCount);
        
        const updated = templateDistribution.map((d, idx) => ({
          ...d,
          percentage: equalShare + (idx === 0 ? remainder : 0),
        }));
        
        onTemplateDistributionChange([
          ...updated,
          { templateId, templateName: template.name, percentage: equalShare },
        ]);
      }
    } else {
      const remaining = templateDistribution.filter((d) => d.templateId !== templateId);
      if (remaining.length > 0) {
        // Redistribute 100% among remaining
        const equalShare = Math.floor(100 / remaining.length);
        const remainder = 100 - (equalShare * remaining.length);
        const updated = remaining.map((d, idx) => ({
          ...d,
          percentage: equalShare + (idx === 0 ? remainder : 0),
        }));
        onTemplateDistributionChange(updated);
      } else {
        onTemplateDistributionChange([]);
      }
    }
  };

  const handlePercentageChange = (templateId: string, newPercentage: number) => {
    const otherItems = templateDistribution.filter((d) => d.templateId !== templateId);
    const currentItem = templateDistribution.find((d) => d.templateId === templateId);
    
    if (!currentItem || otherItems.length === 0) {
      // Only one item, force to 100%
      onTemplateDistributionChange(
        templateDistribution.map((d) => ({ ...d, percentage: 100 }))
      );
      return;
    }

    // Calculate how much is left for others
    const remainingForOthers = 100 - newPercentage;
    
    // Distribute remaining proportionally among others
    const currentOtherTotal = otherItems.reduce((sum, d) => sum + d.percentage, 0);
    
    const updated = templateDistribution.map((d) => {
      if (d.templateId === templateId) {
        return { ...d, percentage: newPercentage };
      }
      // Distribute remaining proportionally
      if (currentOtherTotal > 0) {
        const proportion = d.percentage / currentOtherTotal;
        return { ...d, percentage: Math.round(remainingForOthers * proportion) };
      }
      // Equal distribution if all others were 0
      return { ...d, percentage: Math.round(remainingForOthers / otherItems.length) };
    });

    // Fix rounding errors
    const total = updated.reduce((sum, d) => sum + d.percentage, 0);
    if (total !== 100 && updated.length > 0) {
      const diff = 100 - total;
      // Add difference to the first non-changed item
      const firstOtherIdx = updated.findIndex((d) => d.templateId !== templateId);
      if (firstOtherIdx >= 0) {
        updated[firstOtherIdx].percentage += diff;
      }
    }

    onTemplateDistributionChange(updated);
  };

  const isTemplateSelected = (templateId: string) => {
    return templateDistribution.some((d) => d.templateId === templateId);
  };

  const getDistributionForTemplate = (templateId: string) => {
    return templateDistribution.find((d) => d.templateId === templateId);
  };

  const getSitesCount = (percentage: number): number => {
    return Math.round((percentage / 100) * totalKeywords);
  };

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Template Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Select up to 5 templates and distribute them across your {totalKeywords} websites. Total must equal 100%.
        </p>
      </div>

      {!isValid && templateDistribution.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Distribution total is {totalPercentage}%. Must equal 100%.
          </span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Category</Label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onCategoryChange('all')}
            >
              All
            </Badge>
            {TEMPLATE_CATEGORIES.map((cat) => (
              <Badge
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onCategoryChange(cat.value)}
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-auto pr-2">
            {filteredTemplates.map((template) => {
              const isSelected = isTemplateSelected(template.id);
              const distribution = getDistributionForTemplate(template.id);
              const colorIndex = templateDistribution.findIndex((d) => d.templateId === template.id);

              return (
                <Label
                  key={template.id}
                  htmlFor={`template-${template.id}`}
                  className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:bg-muted/50 ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  } ${templateDistribution.length >= 5 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Checkbox
                    id={`template-${template.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleTemplateToggle(template.id, !!checked)}
                    disabled={templateDistribution.length >= 5 && !isSelected}
                    className="absolute top-2 left-2"
                  />
                  {isSelected && (
                    <div
                      className="absolute top-2 right-2 h-4 w-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors[colorIndex % colors.length] }}
                    >
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                  <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden mt-4">
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-xs line-clamp-1">{template.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </Label>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No templates found. Try a different search or category.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Distribution ({templateDistribution.length}/5)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {templateDistribution.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Select templates to distribute
                </p>
              ) : (
                templateDistribution.map((dist, index) => {
                  const sitesCount = getSitesCount(dist.percentage);
                  return (
                    <div key={dist.templateId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          />
                          <span className="text-sm font-medium line-clamp-1">{dist.templateName}</span>
                        </div>
                        <Badge variant={dist.percentage > 0 ? 'default' : 'outline'}>
                          {dist.percentage}%
                        </Badge>
                      </div>
                      <Slider
                        value={[dist.percentage]}
                        onValueChange={([value]) => handlePercentageChange(dist.templateId, value)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {sitesCount} site{sitesCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                })
              )}

              {templateDistribution.length > 0 && (
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span className={isValid ? 'text-green-500' : 'text-destructive'}>
                      {totalPercentage}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Select up to 5 templates</p>
            <p>• Adjust sliders to set percentage per template</p>
            <p>• Total must equal 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkStepTemplate;
