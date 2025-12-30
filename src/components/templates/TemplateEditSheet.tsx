import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Template } from './TemplateGallery';
import { getAllCategories } from '@/utils/templateCategories';

interface TemplateEditSheetProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Template) => void;
}

const TemplateEditSheet = ({ template, isOpen, onClose, onSave }: TemplateEditSheetProps) => {
  const [formData, setFormData] = useState<Partial<Template>>({});
  const categories = getAllCategories();

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        category: template.category,
        description: template.description,
        preview: template.preview,
        previewUrl: template.previewUrl
      });
    }
  }, [template]);

  const handleSave = () => {
    if (template && formData.name && formData.category) {
      const updatedTemplate: Template = {
        ...template,
        name: formData.name,
        category: formData.category,
        description: formData.description || '',
        preview: formData.preview || template.preview,
        previewUrl: formData.previewUrl || template.previewUrl
      };
      onSave(updatedTemplate);
    }
  };

  if (!template) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Template</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter template name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-category">Category</Label>
            <Select 
              value={formData.category || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.label}>
                    {category.label}
                    {category.isCustom && <span className="ml-2 text-xs text-gray-500">(Custom)</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter template description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-preview">Preview Image URL</Label>
            <Input
              id="template-preview"
              value={formData.preview || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, preview: e.target.value }))}
              placeholder="Enter preview image URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-preview-url">Live Preview URL</Label>
            <Input
              id="template-preview-url"
              value={formData.previewUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, previewUrl: e.target.value }))}
              placeholder="Enter live preview URL"
            />
          </div>

          {formData.preview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <img 
                src={formData.preview} 
                alt="Template preview" 
                className="w-full h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TemplateEditSheet;
