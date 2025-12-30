
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, List, Sparkles } from 'lucide-react';
import { generateLongTailKeywords } from '@/utils/longTailKeywords';

interface KeywordManagementProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}

const KeywordManagement: React.FC<KeywordManagementProps> = ({
  keywords,
  onAddKeyword,
  onRemoveKeyword
}) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [bulkKeywords, setBulkKeywords] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [longTailSuggestions, setLongTailSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (keywordInput.trim() && keywordInput.length > 2) {
      const suggestions = generateLongTailKeywords(keywordInput.trim());
      setLongTailSuggestions(suggestions);
    } else {
      setLongTailSuggestions([]);
    }
  }, [keywordInput]);

  const handleAddKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !keywords.includes(keyword)) {
      onAddKeyword(keyword);
      setKeywordInput('');
      setLongTailSuggestions([]);
    }
  };

  const handleBulkAdd = () => {
    const keywordList = bulkKeywords
      .split(/[\n,]/)
      .map(keyword => keyword.trim())
      .filter(keyword => keyword && !keywords.includes(keyword));
    
    keywordList.forEach(keyword => {
      onAddKeyword(keyword);
    });
    
    setBulkKeywords('');
    setShowBulkInput(false);
  };

  const addLongTailKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      onAddKeyword(keyword);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Keywords to Insert</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBulkInput(!showBulkInput)}
        >
          <List className="h-4 w-4 mr-2" />
          {showBulkInput ? 'Single Entry' : 'Bulk Add'}
        </Button>
      </div>

      {!showBulkInput ? (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Enter keyword or phrase"
              onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
            <Button onClick={handleAddKeyword} disabled={!keywordInput.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {longTailSuggestions.length > 0 && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2 text-purple-800 dark:text-purple-200">
                  <Sparkles className="h-4 w-4" />
                  <span>Long-tail Keyword Suggestions for "{keywordInput}"</span>
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
        </div>
      ) : (
        <div className="space-y-3">
          <Textarea
            value={bulkKeywords}
            onChange={(e) => setBulkKeywords(e.target.value)}
            placeholder="Enter multiple keywords (one per line or comma-separated)&#10;Example:&#10;SEO optimization&#10;content marketing&#10;digital strategy"
            rows={6}
            className="resize-none"
          />
          <div className="flex space-x-2">
            <Button onClick={handleBulkAdd} disabled={!bulkKeywords.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add All Keywords
            </Button>
            <Button variant="outline" onClick={() => setShowBulkInput(false)}>
              Cancel
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Separate keywords with new lines or commas. Duplicates will be automatically filtered out.
          </p>
        </div>
      )}
      
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
              <span>{keyword}</span>
              <button
                onClick={() => onRemoveKeyword(keyword)}
                className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordManagement;
