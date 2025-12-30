
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Sparkles } from 'lucide-react';
import { WebsiteCreationData } from '@/types/websiteCreation';
import { generateLongTailKeywords } from '@/utils/longTailKeywords';
import KeywordManagement from '@/components/website-details/KeywordManagement';

interface WebsiteStepTwoProps {
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
}

const WebsiteStepTwo = ({ data, onUpdate }: WebsiteStepTwoProps) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [longTailSuggestions, setLongTailSuggestions] = useState<string[]>([]);
  const [keywordsToInsert, setKeywordsToInsert] = useState<string[]>([]);

  useEffect(() => {
    if (newKeyword.trim() && newKeyword.length > 2) {
      const suggestions = generateLongTailKeywords(newKeyword.trim(), data.category);
      setLongTailSuggestions(suggestions);
    } else {
      setLongTailSuggestions([]);
    }
  }, [newKeyword, data.category]);

  const addKeyword = () => {
    if (newKeyword.trim() && !data.keywords.includes(newKeyword.trim())) {
      onUpdate({ 
        keywords: [...data.keywords, newKeyword.trim()] 
      });
      setNewKeyword('');
      setLongTailSuggestions([]);
    }
  };

  const removeKeyword = (keyword: string) => {
    onUpdate({ 
      keywords: data.keywords.filter(k => k !== keyword) 
    });
  };

  const addLongTailKeyword = (keyword: string) => {
    if (!data.keywords.includes(keyword)) {
      onUpdate({ 
        keywords: [...data.keywords, keyword] 
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleAddKeywordToInsert = (keyword: string) => {
    if (!keywordsToInsert.includes(keyword)) {
      setKeywordsToInsert([...keywordsToInsert, keyword]);
    }
  };

  const handleRemoveKeywordToInsert = (keyword: string) => {
    setKeywordsToInsert(keywordsToInsert.filter(k => k !== keyword));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="keyword">Add Keywords</Label>
        <div className="flex space-x-2 mt-1">
          <Input
            id="keyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a keyword..."
            className="flex-1"
          />
          <Button onClick={addKeyword} disabled={!newKeyword.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Add keywords that describe your business or content
        </p>
      </div>

      {longTailSuggestions.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2 text-purple-800 dark:text-purple-200">
              <Sparkles className="h-4 w-4" />
              <span>Long-tail Keyword Suggestions for "{newKeyword}"</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {longTailSuggestions.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-800 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300"
                  onClick={() => addLongTailKeyword(keyword)}
                >
                  {keyword}
                  <Plus className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
              Click on any suggestion to add it to your keywords list
            </p>
          </CardContent>
        </Card>
      )}

      {data.keywords.length > 0 && (
        <div>
          <Label>Selected Keywords ({data.keywords.length})</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="px-3 py-1">
                {keyword}
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="border-t pt-6">
        <KeywordManagement
          keywords={keywordsToInsert}
          onAddKeyword={handleAddKeywordToInsert}
          onRemoveKeyword={handleRemoveKeywordToInsert}
        />
      </div>
    </div>
  );
};

export default WebsiteStepTwo;
