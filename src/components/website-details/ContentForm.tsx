
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';
import { ContentItem } from '@/types/website';

interface ContentFormProps {
  item?: ContentItem;
  isCreating: boolean;
  onSave: (itemId?: string) => void;
  onCancel: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ item, isCreating, onSave, onCancel }) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={isCreating ? "new-title" : `title-${item?.id}`}>Title</Label>
          <Input 
            id={isCreating ? "new-title" : `title-${item?.id}`}
            placeholder="Enter content title" 
            defaultValue={item?.title || ''}
          />
        </div>
        <div>
          <Label htmlFor={isCreating ? "new-url" : `url-${item?.id}`}>URL</Label>
          <Input 
            id={isCreating ? "new-url" : `url-${item?.id}`}
            placeholder="/new-page" 
            defaultValue={item?.url || ''}
          />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor={isCreating ? "new-description" : `description-${item?.id}`}>Meta Description</Label>
        <Textarea 
          id={isCreating ? "new-description" : `description-${item?.id}`}
          placeholder="Enter meta description" 
          defaultValue={item?.metaDescription || ''}
        />
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={() => onSave(item?.id)}>
          <Save className="h-4 w-4 mr-2" />
          {isCreating ? 'Create' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default ContentForm;
