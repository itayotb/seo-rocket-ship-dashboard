
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import DeleteKeywordDialog from './DeleteKeywordDialog';

interface KeywordActionsProps {
  keywordId: string;
  keywordTerm: string;
  editingKeyword: string | null;
  onEdit: (keywordId: string, currentTerm: string) => void;
  onRemove: (keywordId: string) => void;
}

const KeywordActions: React.FC<KeywordActionsProps> = ({
  keywordId,
  keywordTerm,
  editingKeyword,
  onEdit,
  onRemove
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteConfirm = () => {
    onRemove(keywordId);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(keywordId, keywordTerm)}
          disabled={editingKeyword === keywordId}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <span className="h-4 w-4 text-sm">×</span>
        </Button>
      </div>

      <DeleteKeywordDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        keywordTerm={keywordTerm}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default KeywordActions;
