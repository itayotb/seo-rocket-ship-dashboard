
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye } from 'lucide-react';
import { Template } from '@/types/websiteCreation';
import { getCategoryLabel } from '@/utils/templateData';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
}

const TemplateCard = ({ template, isSelected, onSelect }: TemplateCardProps) => {
  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Preview template:', template.name);
    // TODO: Implement preview functionality
  };

  return (
    <Card
      className={`cursor-pointer border-2 transition-all hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(template.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            {isSelected && (
              <CheckCircle className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <Badge variant="secondary" className="text-xs">
            {getCategoryLabel(template.category)}
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Preview Image */}
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group">
            <img
              src={template.preview}
              alt={template.name}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                size="sm" 
                variant="secondary"
                onClick={handlePreview}
                className="pointer-events-auto"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
          
          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {template.features.map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          
          {/* Pages Count */}
          <div className="text-sm text-gray-500">
            {template.pages.length} page{template.pages.length !== 1 ? 's' : ''} included
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
