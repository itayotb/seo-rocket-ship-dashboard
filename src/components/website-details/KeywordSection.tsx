
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Calendar } from 'lucide-react';
import { Website } from '@/types/website';
import KeywordForm from './KeywordForm';
import KeywordTable from './KeywordTable';
import { useKeywords } from '@/hooks/useKeywords';

interface KeywordSectionProps {
  website: Website;
}

const KeywordSection = ({ website }: KeywordSectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('28days');

  const {
    keywords,
    handleAddKeyword,
    handleBulkAddKeywords,
    handleUpdateKeyword,
    handleRemoveKeyword,
    handleBulkRemoveKeywords,
    getGeoFlag,
    getLanguageName,
    refreshKeywordsData
  } = useKeywords();

  const handleAdd = (formData: { term: string; geo: string; language: string }) => {
    handleAddKeyword(formData);
    setIsAdding(false);
  };

  const handleBulkAdd = (formData: { terms: string[]; geo: string; language: string }) => {
    handleBulkAddKeywords(formData);
    setIsAdding(false);
  };

  const handleStartEdit = (keywordId: string, currentTerm: string) => {
    setEditingKeyword(keywordId);
  };

  const handleUpdate = (keywordId: string, newTerm: string) => {
    handleUpdateKeyword(keywordId, newTerm);
    setEditingKeyword(null);
  };

  const handleCancelEdit = () => {
    setEditingKeyword(null);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    refreshKeywordsData(period);
  };

  const periodLabels: { [key: string]: string } = {
    '24hours': 'Last 24 Hours',
    '7days': 'Last 7 Days',
    '28days': 'Last 28 Days',
    '3months': 'Last 3 Months',
    'custom': 'Custom Range'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Keyword Tracking</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(periodLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsAdding(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Keyword
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isAdding && (
            <KeywordForm
              onAdd={handleAdd}
              onBulkAdd={handleBulkAdd}
              onCancel={() => setIsAdding(false)}
            />
          )}

          <KeywordTable
            keywords={keywords}
            editingKeyword={editingKeyword}
            onStartEdit={handleStartEdit}
            onUpdate={handleUpdate}
            onCancelEdit={handleCancelEdit}
            onRemove={handleRemoveKeyword}
            onBulkRemove={handleBulkRemoveKeywords}
            getGeoFlag={getGeoFlag}
            getLanguageName={getLanguageName}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordSection;
