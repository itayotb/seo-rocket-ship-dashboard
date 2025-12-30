
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Eye, EyeOff } from 'lucide-react';
import { WebsiteCreationData, TemplatePage } from '@/types/websiteCreation';

interface PageEditorProps {
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
  selectedPage: TemplatePage;
  onPageUpdate: (pageId: string, updates: Partial<TemplatePage>) => void;
}

const PageEditor = ({ data, onUpdate, selectedPage, onPageUpdate }: PageEditorProps) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [localContent, setLocalContent] = useState(selectedPage.content);
  const [localSeoTitle, setLocalSeoTitle] = useState(selectedPage.seoTitle);
  const [localSeoDescription, setLocalSeoDescription] = useState(selectedPage.seoDescription);

  const handleSave = () => {
    onPageUpdate(selectedPage.id, {
      content: localContent,
      seoTitle: localSeoTitle,
      seoDescription: localSeoDescription
    });
  };

  const generateSeoContent = () => {
    // Auto-generate SEO content based on website data
    const keywords = data.keywords.slice(0, 3).join(', ');
    const siteName = data.websiteName;
    
    const autoSeoTitle = `${selectedPage.name} - ${siteName}`;
    const autoSeoDescription = `${selectedPage.name} page for ${siteName}. ${keywords ? `Key topics: ${keywords}` : ''}`;
    
    setLocalSeoTitle(autoSeoTitle);
    setLocalSeoDescription(autoSeoDescription);
  };

  const handleAiEnhance = () => {
    // Simulate AI content enhancement
    if (data.aiPrompt) {
      const enhancedContent = `${localContent}\n\nAI Enhancement based on: "${data.aiPrompt}"`;
      setLocalContent(enhancedContent);
    }
  };

  const insertKeywords = () => {
    if (data.keywords.length > 0) {
      const keywordText = `\n\nKey focus areas: ${data.keywords.join(', ')}`;
      setLocalContent(localContent + keywordText);
    }
  };

  // Website-specific variables for content generation
  const websiteVars = {
    siteName: data.websiteName,
    domain: data.domain,
    category: data.category,
    keywords: data.keywords.join(', '),
    // Remove reference to description as it doesn't exist
    pageName: selectedPage.name
  };

  const replaceVariables = (text: string) => {
    let result = text;
    Object.entries(websiteVars).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value || '');
    });
    return result;
  };

  const processedContent = replaceVariables(localContent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleAiEnhance}>
            Enhance with AI
          </Button>
          <Button variant="outline" size="sm" onClick={insertKeywords}>
            Insert Keywords
          </Button>
          <Button variant="default" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Preview
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="content">Page Content</Label>
              <Textarea
                id="content"
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                placeholder="Enter your page content..."
                className="min-h-[200px] mt-1"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" onClick={generateSeoContent}>
                Auto-Generate SEO
              </Button>
            </div>
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={localSeoTitle}
                onChange={(e) => setLocalSeoTitle(e.target.value)}
                placeholder="Enter SEO title..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={localSeoDescription}
                onChange={(e) => setLocalSeoDescription(e.target.value)}
                placeholder="Enter SEO description..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h1>{localSeoTitle || selectedPage.name}</h1>
              <div className="whitespace-pre-wrap">
                {isPreviewMode ? processedContent : localContent}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageEditor;
