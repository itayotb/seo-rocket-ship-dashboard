
import React from 'react';
import { Filter } from 'lucide-react';
import { Template } from '@/types/websiteCreation';
import TemplateCard from './TemplateCard';

interface TemplateGridProps {
  templates: Template[];
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateGrid = ({ templates, selectedTemplate, onSelectTemplate }: TemplateGridProps) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-gray-500 dark:text-gray-400">
          <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No templates found</p>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isSelected={selectedTemplate === template.id}
          onSelect={onSelectTemplate}
        />
      ))}
    </div>
  );
};

export default TemplateGrid;
