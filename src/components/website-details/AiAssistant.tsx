
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Wand2, RefreshCw, Plus } from 'lucide-react';
import { ContentItem } from '@/types/website';
import { GeneratedSection } from '@/types/aiSection';
import AiSectionGenerator from './AiSectionGenerator';

interface AiAssistantProps {
  editedItem: ContentItem;
  onItemUpdate: (updatedItem: ContentItem) => void;
  calculateSeoScore: (item: ContentItem) => number;
}

const AiAssistant: React.FC<AiAssistantProps> = ({
  editedItem,
  onItemUpdate,
  calculateSeoScore
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const { toast } = useToast();

  const handleAiImprovement = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a prompt for AI improvement.",
        variant: "destructive",
      });
      return;
    }

    setIsAiLoading(true);
    
    try {
      // Simulate AI API call - in real implementation, this would call ChatGPT API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI improvement
      const improvedContent = `${editedItem.content}\n\n[AI Enhanced Content] This content has been improved with better structure, clarity, and SEO optimization based on your prompt: "${aiPrompt}"`;
      
      const updatedItem = {
        ...editedItem,
        content: improvedContent,
        wordCount: improvedContent.trim().split(/\s+/).filter(word => word.length > 0).length,
        lastModified: 'Just now'
      };
      
      updatedItem.seoScore = calculateSeoScore(updatedItem);
      onItemUpdate(updatedItem);
      setAiPrompt('');
      
      toast({
        title: "Content Improved",
        description: "AI has successfully enhanced your content.",
      });
    } catch (error) {
      toast({
        title: "AI Enhancement Failed",
        description: "Failed to improve content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSectionGenerated = (section: GeneratedSection) => {
    const newContent = `${editedItem.content}\n\n${section.content}`;
    
    const updatedItem = {
      ...editedItem,
      content: newContent,
      wordCount: newContent.trim().split(/\s+/).filter(word => word.length > 0).length,
      lastModified: 'Just now'
    };
    
    updatedItem.seoScore = calculateSeoScore(updatedItem);
    onItemUpdate(updatedItem);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center">
          <Wand2 className="h-4 w-4 mr-2" />
          AI Content Assistant
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Use AI to improve your content quality, SEO optimization, and add new sections.
        </p>
      </div>

      <Tabs defaultValue="improve" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="improve">Improve Content</TabsTrigger>
          <TabsTrigger value="generate">Add Section</TabsTrigger>
        </TabsList>

        <TabsContent value="improve" className="space-y-4">
          <div>
            <Label htmlFor="ai-prompt">What would you like to improve?</Label>
            <Textarea
              id="ai-prompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., Make this content more engaging, improve SEO, add relevant keywords, etc."
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleAiImprovement} 
            disabled={isAiLoading || !aiPrompt.trim()}
            className="w-full"
          >
            {isAiLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Improving Content...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Improve with AI
              </>
            )}
          </Button>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2">AI Suggestions</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Add more descriptive headers and subheadings</li>
              <li>• Include relevant keywords naturally</li>
              <li>• Improve content structure and flow</li>
              <li>• Add call-to-action elements</li>
              <li>• Optimize for featured snippets</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <AiSectionGenerator onSectionGenerated={handleSectionGenerated} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiAssistant;
