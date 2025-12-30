
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileCode } from 'lucide-react';
import LeadFormsList from './LeadFormsList';
import LeadFormDialog from './LeadFormDialog';
import { LeadForm } from '@/types/leadForm';
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
import { toast } from 'sonner';

interface LeadFormsManagementProps {
  leadForms: LeadForm[];
  onAddLeadForm: (name: string, code: string) => void;
  onUpdateLeadForm: (id: string, name: string, code: string) => void;
  onDeleteLeadForm: (id: string) => void;
}

const LeadFormsManagement: React.FC<LeadFormsManagementProps> = ({
  leadForms,
  onAddLeadForm,
  onUpdateLeadForm,
  onDeleteLeadForm
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLeadForm, setEditingLeadForm] = useState<LeadForm | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (leadForm: LeadForm) => {
    setEditingLeadForm(leadForm);
    setIsDialogOpen(true);
  };

  const handleSave = (name: string, code: string) => {
    if (editingLeadForm) {
      onUpdateLeadForm(editingLeadForm.id, name, code);
    } else {
      onAddLeadForm(name, code);
    }
    setEditingLeadForm(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLeadForm(null);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDeleteLeadForm(deleteId);
      toast.success('Lead form deleted');
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileCode className="h-8 w-8" />
            Lead Forms
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your lead form code snippets
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Lead Form
        </Button>
      </div>

      <LeadFormsList
        leadForms={leadForms}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
      />

      <LeadFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingLeadForm={editingLeadForm}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead Form?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadFormsManagement;
