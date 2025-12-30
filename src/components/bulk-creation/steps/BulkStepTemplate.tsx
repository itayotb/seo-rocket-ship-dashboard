import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Search, Check } from 'lucide-react';
import { Template } from '@/types/websiteCreation';
import { TEMPLATE_CATEGORIES } from '@/utils/templateCategories';

interface BulkStepTemplateProps {
  templates: Template[];
  selectedTemplateId: string;
  selectedCategory: string;
  onTemplateChange: (templateId: string, templateName: string) => void;
  onCategoryChange: (category: string) => void;
}

const BulkStepTemplate = ({
  templates,
  selectedTemplateId,
  selectedCategory,
  onTemplateChange,
  onCategoryChange,
}: BulkStepTemplateProps) => {
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Template & Category</h3>
        <p className="text-sm text-muted-foreground">
          Choose a template and category that will apply to all websites.
        </p>
      </div>

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

      <RadioGroup
        value={selectedTemplateId}
        onValueChange={(value) => {
          const template = templates.find((t) => t.id === value);
          if (template) {
            onTemplateChange(value, template.name);
          }
        }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {filteredTemplates.map((template) => (
          <Label
            key={template.id}
            htmlFor={template.id}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-muted/50 ${
              selectedTemplateId === template.id
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
          >
            <RadioGroupItem
              value={template.id}
              id={template.id}
              className="sr-only"
            />
            {selectedTemplateId === template.id && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
            <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
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
              <p className="font-medium text-sm">{template.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {template.description}
              </p>
              <Badge variant="secondary" className="text-xs">
                {template.category}
              </Badge>
            </div>
          </Label>
        ))}
      </RadioGroup>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No templates found. Try a different search or category.
        </div>
      )}
    </div>
  );
};

export default BulkStepTemplate;
