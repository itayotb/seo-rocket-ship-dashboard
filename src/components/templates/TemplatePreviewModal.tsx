
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Globe } from 'lucide-react';
import { Template } from './TemplateGallery';

interface TemplatePreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

const TemplatePreviewModal = ({ template, isOpen, onClose }: TemplatePreviewModalProps) => {
  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {template.name}
              </h2>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                {template.category}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" asChild>
                <a href={template.previewUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open in New Tab
                </a>
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Globe className="h-4 w-4 mr-1" />
                Use Template
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative bg-gray-100 dark:bg-gray-800">
            {template.previewUrl ? (
              <iframe
                src={template.previewUrl}
                className="w-full h-full border-0"
                title={`Preview of ${template.name}`}
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-96 h-64 object-cover rounded-lg mx-auto mb-4"
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    Full preview not available for this template
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewModal;
