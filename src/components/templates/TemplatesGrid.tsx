
import React from 'react';
import { Template } from './TemplateGallery';
import TemplateGridCard from './TemplateGridCard';

interface TemplatesGridProps {
  templates: Template[];
  onPreview: (template: Template) => void;
  onEdit: (template: Template) => void;
  onApply: (template: Template) => void;
  onToggleFavorite: (templateId: string) => void;
}

const TemplatesGrid: React.FC<TemplatesGridProps> = ({
  templates,
  onPreview,
  onEdit,
  onApply,
  onToggleFavorite
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateGridCard
          key={template.id}
          template={template}
          onPreview={onPreview}
          onEdit={onEdit}
          onApply={onApply}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default TemplatesGrid;
