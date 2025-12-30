
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteKeywordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keywordTerm: string;
  onConfirm: () => void;
}

const DeleteKeywordDialog: React.FC<DeleteKeywordDialogProps> = ({
  open,
  onOpenChange,
  keywordTerm,
  onConfirm
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Keyword</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the keyword "{keywordTerm}"? This action cannot be undone and all tracking data for this keyword will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete Keyword
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteKeywordDialog;
