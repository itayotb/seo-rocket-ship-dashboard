
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Target } from 'lucide-react';
import { KeywordSettings } from '@/types/keyword';
import { processContentWithKeywords } from '@/utils/keywordInsertion';
import KeywordManagement from './KeywordManagement';
import UsageTips from './UsageTips';

interface BulkKeywordInsertionProps {
  content: string;
  onContentUpdate: (newContent: string) => void;
}

const BulkKeywordInsertion: React.FC<BulkKeywordInsertionProps> = ({
  content,
  onContentUpdate
}) => {
  const [settings, setSettings] = useState<KeywordSettings>({
    keywords: [],
    frequency: 50,
    avoidDuplicates: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const addKeyword = (keyword: string) => {
    setSettings(prev => ({
      ...prev,
      keywords: [...prev.keywords, keyword]
    }));
  };

  const removeKeyword = (keyword: string) => {
    setSettings(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const processContent = () => {
    if (settings.keywords.length === 0) {
      toast({
        title: "No Keywords",
        description: "Please add at least one keyword to insert.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const { newContent, targetCount } = processContentWithKeywords(content, settings);
      onContentUpdate(newContent);
      
      toast({
        title: "Keywords Inserted",
        description: `Successfully inserted keywords into ${targetCount} paragraphs.`,
      });
    } catch (error) {
      toast({
        title: "Insertion Failed",
        description: "Failed to insert keywords. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const targetParagraphCount = Math.ceil((content.split('\n').filter(p => p.trim()).length) * (settings.frequency / 100));

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center">
          <Target className="h-4 w-4 mr-2" />
          Bulk Keyword Insertion
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Insert keywords naturally across multiple paragraphs to improve SEO.
        </p>
      </div>

      <KeywordManagement
        keywords={settings.keywords}
        onAddKeyword={addKeyword}
        onRemoveKeyword={removeKeyword}
      />

      <Separator />

      <Button 
        onClick={processContent} 
        disabled={isProcessing || settings.keywords.length === 0}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Target className="h-4 w-4 mr-2 animate-pulse" />
            Inserting Keywords...
          </>
        ) : (
          <>
            <Target className="h-4 w-4 mr-2" />
            Insert Keywords ({settings.keywords.length} keywords into {targetParagraphCount} paragraphs)
          </>
        )}
      </Button>

      <UsageTips />
    </div>
  );
};

export default BulkKeywordInsertion;
