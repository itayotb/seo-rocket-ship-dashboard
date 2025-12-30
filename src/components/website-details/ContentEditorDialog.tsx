
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  FileText, 
  Clock
} from 'lucide-react';
import { ContentItem } from '@/types/website';
import BulkKeywordInsertion from './BulkKeywordInsertion';
import ContentEditForm from './ContentEditForm';
import AiAssistant from './AiAssistant';
import SeoAnalytics from './SeoAnalytics';

interface ContentEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentItem: ContentItem | null;
  onSave: (updatedItem: ContentItem) => void;
}

const ContentEditorDialog = ({ isOpen, onClose, contentItem, onSave }: ContentEditorDialogProps) => {
  const [editedItem, setEditedItem] = useState<ContentItem | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (contentItem) {
      setEditedItem({ ...contentItem });
      setHasUnsavedChanges(false);
    }
  }, [contentItem]);

  const handleFieldChange = (field: keyof ContentItem, value: string) => {
    if (!editedItem) return;
    
    const updatedItem = { ...editedItem, [field]: value };
    
    // Update word count for content changes
    if (field === 'content') {
      updatedItem.wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
    
    setEditedItem(updatedItem);
    setHasUnsavedChanges(true);
  };

  const handleContentUpdate = (newContent: string) => {
    handleFieldChange('content', newContent);
  };

  const calculateSeoScore = (item: ContentItem) => {
    let score = 0;
    
    // Title optimization (0-25 points)
    if (item.title.length >= 30 && item.title.length <= 60) score += 25;
    else if (item.title.length >= 20) score += 15;
    
    // Meta description (0-25 points)
    if (item.metaDescription.length >= 120 && item.metaDescription.length <= 160) score += 25;
    else if (item.metaDescription.length >= 80) score += 15;
    
    // Content length (0-25 points)
    if (item.wordCount >= 300) score += 25;
    else if (item.wordCount >= 150) score += 15;
    
    // Content quality indicators (0-25 points)
    const hasHeaders = /#{1,6}\s/.test(item.content) || /<h[1-6]/.test(item.content);
    const hasLists = /[-*+]\s/.test(item.content) || /<[uo]l/.test(item.content);
    const hasLinks = /\[.*\]\(.*\)/.test(item.content) || /<a/.test(item.content);
    
    if (hasHeaders) score += 8;
    if (hasLists) score += 8;
    if (hasLinks) score += 9;
    
    return Math.min(score, 100);
  };

  const handleItemUpdate = (updatedItem: ContentItem) => {
    setEditedItem(updatedItem);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!editedItem) return;
    
    const finalItem = {
      ...editedItem,
      seoScore: calculateSeoScore(editedItem),
      lastModified: 'Just now'
    };
    
    onSave(finalItem);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Content Saved",
      description: "Your changes have been saved successfully.",
    });
  };

  if (!editedItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5" />
              <span>Edit Content: {editedItem.title}</span>
              <Badge variant={editedItem.status === 'published' ? 'default' : 'secondary'}>
                {editedItem.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-orange-600">
                  <Clock className="h-3 w-3 mr-1" />
                  Unsaved changes
                </Badge>
              )}
              <Button onClick={handleSave} size="sm" disabled={!hasUnsavedChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            <TabsTrigger value="seo">SEO & Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6">
            <ContentEditForm
              editedItem={editedItem}
              onFieldChange={handleFieldChange}
            />
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <BulkKeywordInsertion 
              content={editedItem.content}
              onContentUpdate={handleContentUpdate}
            />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <AiAssistant
              editedItem={editedItem}
              onItemUpdate={handleItemUpdate}
              calculateSeoScore={calculateSeoScore}
            />
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <SeoAnalytics
              editedItem={editedItem}
              calculateSeoScore={calculateSeoScore}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ContentEditorDialog;
