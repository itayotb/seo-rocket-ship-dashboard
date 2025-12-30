
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, List } from 'lucide-react';

interface KeywordFormData {
  term: string;
  geo: string;
  language: string;
}

interface KeywordFormProps {
  onAdd: (data: KeywordFormData) => void;
  onBulkAdd: (data: { terms: string[]; geo: string; language: string }) => void;
  onCancel: () => void;
}

const geoOptions = [
  { value: 'us', label: 'United States (google.com)', flag: '🇺🇸' },
  { value: 'uk', label: 'United Kingdom (google.co.uk)', flag: '🇬🇧' },
  { value: 'ca', label: 'Canada (google.ca)', flag: '🇨🇦' },
  { value: 'au', label: 'Australia (google.com.au)', flag: '🇦🇺' },
  { value: 'de', label: 'Germany (google.de)', flag: '🇩🇪' },
  { value: 'fr', label: 'France (google.fr)', flag: '🇫🇷' },
  { value: 'es', label: 'Spain (google.es)', flag: '🇪🇸' },
  { value: 'it', label: 'Italy (google.it)', flag: '🇮🇹' },
  { value: 'nl', label: 'Netherlands (google.nl)', flag: '🇳🇱' },
  { value: 'br', label: 'Brazil (google.com.br)', flag: '🇧🇷' },
  { value: 'mx', label: 'Mexico (google.com.mx)', flag: '🇲🇽' },
  { value: 'jp', label: 'Japan (google.co.jp)', flag: '🇯🇵' },
  { value: 'in', label: 'India (google.co.in)', flag: '🇮🇳' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'nl', label: 'Dutch' },
  { value: 'ja', label: 'Japanese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ar', label: 'Arabic' },
];

const KeywordForm: React.FC<KeywordFormProps> = ({ onAdd, onBulkAdd, onCancel }) => {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [singleKeyword, setSingleKeyword] = useState('');
  const [bulkKeywords, setBulkKeywords] = useState('');
  const [geo, setGeo] = useState('us');
  const [language, setLanguage] = useState('en');

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (singleKeyword.trim()) {
      onAdd({
        term: singleKeyword.trim(),
        geo,
        language
      });
      setSingleKeyword('');
    }
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkKeywords.trim()) {
      const terms = bulkKeywords
        .split(/[\n,]/)
        .map(term => term.trim())
        .filter(term => term.length > 0);
      
      if (terms.length > 0) {
        onBulkAdd({
          terms,
          geo,
          language
        });
        setBulkKeywords('');
      }
    }
  };

  return (
    <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Add Keywords</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsBulkMode(!isBulkMode)}
            >
              <List className="h-4 w-4 mr-2" />
              {isBulkMode ? 'Single Entry' : 'Bulk Add'}
            </Button>
          </div>

          <form onSubmit={isBulkMode ? handleBulkSubmit : handleSingleSubmit} className="space-y-4">
            {!isBulkMode ? (
              <div className="space-y-2">
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="Enter keyword to track"
                  value={singleKeyword}
                  onChange={(e) => setSingleKeyword(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="bulk-keywords">Keywords (one per line or comma-separated)</Label>
                <Textarea
                  id="bulk-keywords"
                  placeholder="Enter multiple keywords&#10;Example:&#10;SEO optimization&#10;content marketing&#10;digital strategy"
                  value={bulkKeywords}
                  onChange={(e) => setBulkKeywords(e.target.value)}
                  rows={6}
                  className="resize-none"
                  required
                />
                <p className="text-xs text-gray-500">
                  Separate keywords with new lines or commas. Duplicates will be automatically filtered out.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Geographic Location</Label>
                <Select value={geo} onValueChange={setGeo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {geoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <span>{option.flag}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button 
                type="submit" 
                disabled={isBulkMode ? !bulkKeywords.trim() : !singleKeyword.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isBulkMode ? 'Add All Keywords' : 'Add Keyword'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordForm;
