import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Wand2 } from 'lucide-react';
import { Website, ContentItem } from '@/types/website';
import ContentEditorDialog from './ContentEditorDialog';
import ContentList from './ContentList';
import AiBlogPageGenerator from './AiBlogPageGenerator';
import { useToast } from '@/hooks/use-toast';

interface ContentManagementProps {
  website: Website;
  contentItems?: ContentItem[];
  onContentUpdate?: (items: ContentItem[]) => void;
}

const ContentManagement: React.FC<ContentManagementProps> = ({ 
  website, 
  contentItems = [],
  onContentUpdate 
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [showAiGenerator, setShowAiGenerator] = useState<boolean>(false);
  const { toast } = useToast();

  // Use passed content items or fall back to internal state
  const [internalItems, setInternalItems] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'page',
      title: 'About Us',
      url: '/about',
      status: 'published',
      seoScore: 92,
      lastModified: '2 days ago',
      content: 'Welcome to our company! We are a leading technology solutions provider dedicated to helping businesses transform their digital presence. Our team of experienced professionals brings together years of expertise in web development, digital marketing, and business strategy.\n\nFounded in 2015, we have successfully helped over 500 businesses achieve their online goals. Our comprehensive approach combines cutting-edge technology with proven marketing strategies to deliver measurable results.\n\nOur mission is to empower businesses with the tools and knowledge they need to succeed in the digital age. We believe that every business, regardless of size, deserves access to professional-grade digital solutions.',
      metaDescription: 'Learn about our company, mission, and the experienced team behind our innovative technology solutions. Discover how we help businesses succeed online.',
      wordCount: 142
    },
    {
      id: '2',
      type: 'post',
      title: 'Latest Technology Trends',
      url: '/blog/tech-trends',
      status: 'published',
      seoScore: 78,
      lastModified: '1 week ago',
      content: 'The technology landscape is constantly evolving, and staying ahead of the curve is crucial for business success. In this comprehensive guide, we explore the most significant technology trends that are shaping the future of business.\n\nArtificial Intelligence and Machine Learning continue to revolutionize how businesses operate. From chatbots to predictive analytics, AI is becoming an integral part of modern business strategy.\n\nCloud computing has reached new heights of adoption, with businesses of all sizes migrating to cloud-first architectures for better scalability and cost efficiency.',
      metaDescription: 'Discover the latest technology trends shaping business success. Learn about AI, cloud computing, and emerging technologies.',
      wordCount: 98
    },
    {
      id: '3',
      type: 'page',
      title: 'Services',
      url: '/services',
      status: 'review',
      seoScore: 65,
      lastModified: '3 days ago',
      content: 'Our comprehensive suite of services is designed to meet all your digital needs. We offer web development, digital marketing, SEO optimization, and strategic consulting.\n\nWeb Development: Custom websites and applications built with modern technologies.\nDigital Marketing: Complete marketing strategies to grow your online presence.\nSEO Services: Improve your search engine rankings and organic traffic.',
      metaDescription: 'Explore our comprehensive digital services including web development, marketing, and SEO optimization.',
      wordCount: 67
    }
  ]);

  const items = contentItems.length > 0 ? contentItems : internalItems;
  const setItems = onContentUpdate || setInternalItems;

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleAdvancedEdit = (item: ContentItem) => {
    setSelectedItem(item);
    setIsEditorOpen(true);
  };

  const handleDelete = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    const newItems = items.filter(item => item.id !== itemId);
    setItems(newItems);
    
    toast({
      title: "Content Deleted",
      description: `${item?.title} has been deleted successfully.`,
    });
  };

  const handleSave = (itemId?: string) => {
    setEditingItem(null);
    setIsCreating(false);
    console.log('Saving changes for item:', itemId);
  };

  const handleSaveFromEditor = (updatedItem: ContentItem) => {
    const newItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
    setItems(newItems);
    setIsEditorOpen(false);
    setSelectedItem(null);
  };

  const handleAiPageGenerated = (newPage: ContentItem) => {
    const newItems = [newPage, ...items];
    setItems(newItems);
    setShowAiGenerator(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handleShowAiGenerator = () => {
    setShowAiGenerator(true);
  };

  if (showAiGenerator) {
    return (
      <Card>
        <CardContent className="p-6">
          <AiBlogPageGenerator
            onPageGenerated={handleAiPageGenerated}
            onClose={() => setShowAiGenerator(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Content Management</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button onClick={handleShowAiGenerator} size="sm" variant="outline">
                <Wand2 className="h-4 w-4 mr-2" />
                AI Blog Generator
              </Button>
              <Button onClick={handleCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ContentList
            contentItems={items}
            editingItem={editingItem}
            isCreating={isCreating}
            onEdit={handleEdit}
            onAdvancedEdit={handleAdvancedEdit}
            onDelete={handleDelete}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>

      <ContentEditorDialog
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        contentItem={selectedItem}
        onSave={handleSaveFromEditor}
      />
    </>
  );
};

export default ContentManagement;
