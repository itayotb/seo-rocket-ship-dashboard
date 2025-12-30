
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Eye, Download, Edit, Globe } from 'lucide-react';
import { Template } from './TemplateGallery';

interface TemplateGridCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onEdit: (template: Template) => void;
  onApply: (template: Template) => void;
  onToggleFavorite: (templateId: string) => void;
}

const TemplateGridCard: React.FC<TemplateGridCardProps> = ({
  template,
  onPreview,
  onEdit,
  onApply,
  onToggleFavorite
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <div className="relative">
        <img 
          src={template.preview} 
          alt={template.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => onPreview(template)}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" onClick={() => onApply(template)}>
            Use Template
          </Button>
        </div>
        <button 
          onClick={() => onToggleFavorite(template.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Star className={`h-4 w-4 ${template.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full dark:bg-blue-900/20 dark:text-blue-400">
            {template.category}
          </span>
        </div>
        
        {template.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {template.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
              <span>{template.rating}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Download className="h-3 w-3 mr-1" />
              <span>{template.downloads}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(template)} className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => onApply(template)} className="flex-1">
            <Globe className="h-3 w-3 mr-1" />
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateGridCard;
