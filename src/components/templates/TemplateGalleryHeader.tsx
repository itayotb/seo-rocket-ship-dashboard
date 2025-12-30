
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface TemplateGalleryHeaderProps {
  onManageCategories: () => void;
}

const TemplateGalleryHeader: React.FC<TemplateGalleryHeaderProps> = ({ 
  onManageCategories 
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Website Templates</h2>
      <div className="flex space-x-2">
        <Button 
          variant="outline"
          onClick={onManageCategories}
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage Categories
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Upload Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateGalleryHeader;
