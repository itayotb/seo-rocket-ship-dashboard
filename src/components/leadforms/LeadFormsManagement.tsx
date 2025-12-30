
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, FileCode, Search } from 'lucide-react';
import LeadFormsList from './LeadFormsList';
import LeadFormDialog from './LeadFormDialog';
import { LeadForm } from '@/types/leadForm';
import { Template } from '@/types/websiteCreation';
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
  masterCategoryFilter: string;
  templates: Template[];
  onAddLeadForm: (name: string, code: string, category: string, templateId?: string) => void;
  onUpdateLeadForm: (id: string, name: string, code: string, category: string, templateId?: string) => void;
  onDeleteLeadForm: (id: string) => void;
}

const LeadFormsManagement: React.FC<LeadFormsManagementProps> = ({
  leadForms,
  masterCategoryFilter,
  templates,
  onAddLeadForm,
  onUpdateLeadForm,
  onDeleteLeadForm
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLeadForm, setEditingLeadForm] = useState<LeadForm | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (leadForm: LeadForm) => {
    setEditingLeadForm(leadForm);
    setIsDialogOpen(true);
  };

  const handleSave = (name: string, code: string, category: string, templateId?: string) => {
    if (editingLeadForm) {
      onUpdateLeadForm(editingLeadForm.id, name, code, category, templateId);
    } else {
      onAddLeadForm(name, code, category, templateId);
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

  // Filter lead forms by master category filter
  const filteredLeadForms = leadForms.filter(form => {
    const matchesCategory = masterCategoryFilter === 'all' || form.category === masterCategoryFilter;
    const matchesSearch = 
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search lead forms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <LeadFormsList
        leadForms={filteredLeadForms}
        templates={templates}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
      />

      <LeadFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingLeadForm={editingLeadForm}
        templates={templates}
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
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadFormsManagement;
