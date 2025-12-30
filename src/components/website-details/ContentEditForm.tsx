
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { ContentItem } from '@/types/website';

interface ContentEditFormProps {
  editedItem: ContentItem;
  onFieldChange: (field: keyof ContentItem, value: string) => void;
}

const ContentEditForm: React.FC<ContentEditFormProps> = ({
  editedItem,
  onFieldChange
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={editedItem.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="Enter page title"
          />
          <p className="text-xs text-gray-500 mt-1">
            {editedItem.title.length}/60 characters (ideal: 30-60)
          </p>
        </div>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={editedItem.url}
            onChange={(e) => onFieldChange('url', e.target.value)}
            placeholder="/page-url"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="meta-description">Meta Description</Label>
        <Textarea
          id="meta-description"
          value={editedItem.metaDescription}
          onChange={(e) => onFieldChange('metaDescription', e.target.value)}
          placeholder="Enter meta description for search engines"
          rows={2}
        />
        <p className="text-xs text-gray-500 mt-1">
          {editedItem.metaDescription.length}/160 characters (ideal: 120-160)
        </p>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="content">Content</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>
        </div>
        
        {isPreviewMode ? (
          <div className="border rounded-md p-4 min-h-[300px] bg-gray-50 dark:bg-gray-800">
            <div className="prose dark:prose-invert max-w-none">
              {editedItem.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <Textarea
            id="content"
            value={editedItem.content}
            onChange={(e) => onFieldChange('content', e.target.value)}
            placeholder="Enter your content here..."
            rows={15}
            className="resize-none"
          />
        )}
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Word count: {editedItem.wordCount} words
          </p>
          <p className="text-xs text-gray-500">
            Last modified: {editedItem.lastModified}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentEditForm;
