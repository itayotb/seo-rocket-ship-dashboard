
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  addCustomCategory, 
  removeCustomCategory, 
  getAllCategories, 
  TemplateCategory 
} from '@/utils/templateCategories';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded?: (category: TemplateCategory) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  isOpen, 
  onClose, 
  onCategoryAdded 
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState<TemplateCategory[]>(getAllCategories());
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Invalid Category Name",
        description: "Please enter a valid category name.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newCategory = addCustomCategory(newCategoryName.trim());
      setCategories(getAllCategories());
      setNewCategoryName('');
      
      if (onCategoryAdded) {
        onCategoryAdded(newCategory);
      }
      
      toast({
        title: "Category Added",
        description: `"${newCategory.label}" category has been created.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category. It may already exist.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveCategory = (categoryValue: string) => {
    const success = removeCustomCategory(categoryValue);
    if (success) {
      setCategories(getAllCategories());
      toast({
        title: "Category Removed",
        description: "Category has been deleted successfully."
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Manage Template Categories</span>
          </DialogTitle>
          <DialogDescription>
            Add or remove custom categories for organizing your templates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">New Category Name</Label>
            <div className="flex space-x-2">
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter category name"
                className="flex-1"
              />
              <Button onClick={handleAddCategory} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Current Categories</Label>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {categories.map((category) => (
                <div
                  key={category.value}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Badge variant={category.isCustom ? "default" : "secondary"}>
                      {category.label}
                    </Badge>
                    {!category.isCustom && (
                      <span className="text-xs text-gray-500">Default</span>
                    )}
                  </div>
                  {category.isCustom && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCategory(category.value)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManager;
