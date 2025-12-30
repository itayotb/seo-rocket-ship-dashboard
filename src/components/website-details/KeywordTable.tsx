import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { KeywordData } from '@/types/keyword';
import KeywordTableRow from './KeywordTableRow';
import BulkDeleteDialog from './BulkDeleteDialog';

interface KeywordTableProps {
  keywords: KeywordData[];
  editingKeyword: string | null;
  onStartEdit: (keywordId: string, currentTerm: string) => void;
  onUpdate: (keywordId: string, newTerm: string) => void;
  onCancelEdit: () => void;
  onRemove: (keywordId: string) => void;
  onBulkRemove: (keywordIds: string[]) => void;
  getGeoFlag: (geo: string) => string;
  getLanguageName: (code: string) => string;
}

const KeywordTable: React.FC<KeywordTableProps> = ({
  keywords,
  editingKeyword,
  onStartEdit,
  onUpdate,
  onCancelEdit,
  onRemove,
  onBulkRemove,
  getGeoFlag,
  getLanguageName
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedKeywords(keywords.map(k => k.id));
    } else {
      setSelectedKeywords([]);
    }
  };

  const handleSelectKeyword = (keywordId: string, checked: boolean) => {
    if (checked) {
      setSelectedKeywords([...selectedKeywords, keywordId]);
    } else {
      setSelectedKeywords(selectedKeywords.filter(id => id !== keywordId));
    }
  };

  const handleBulkDelete = () => {
    onBulkRemove(selectedKeywords);
    setSelectedKeywords([]);
    setShowBulkDeleteDialog(false);
  };

  if (keywords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No keywords tracked yet. Add some keywords to start monitoring their rankings.
      </div>
    );
  }

  const allSelected = selectedKeywords.length === keywords.length;
  const someSelected = selectedKeywords.length > 0 && selectedKeywords.length < keywords.length;

  return (
    <>
      <div className="space-y-4">
        {selectedKeywords.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <span className="text-sm font-medium">
              {selectedKeywords.length} keyword{selectedKeywords.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 w-8">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left p-2">Keyword</th>
                <th className="text-left p-2">Location & Language</th>
                <th className="text-left p-2">Position</th>
                <th className="text-left p-2">Volume</th>
                <th className="text-left p-2">Difficulty</th>
                <th className="text-left p-2">Impressions</th>
                <th className="text-left p-2">Clicks</th>
                <th className="text-left p-2">CTR</th>
                <th className="text-left p-2">Trend</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((keyword) => (
                <KeywordTableRow
                  key={keyword.id}
                  keyword={keyword}
                  editingKeyword={editingKeyword}
                  onStartEdit={onStartEdit}
                  onUpdate={onUpdate}
                  onCancelEdit={onCancelEdit}
                  onRemove={onRemove}
                  getGeoFlag={getGeoFlag}
                  getLanguageName={getLanguageName}
                  isSelected={selectedKeywords.includes(keyword.id)}
                  onSelect={(checked) => handleSelectKeyword(keyword.id, checked)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BulkDeleteDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        selectedCount={selectedKeywords.length}
        onConfirm={handleBulkDelete}
      />
    </>
  );
};

export default KeywordTable;
