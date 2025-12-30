
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Key, Search } from 'lucide-react';
import CredentialsList from './CredentialsList';
import CredentialDialog from './CredentialDialog';
import { Credential } from '@/types/credential';
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

interface CredentialsManagementProps {
  credentials: Credential[];
  masterCategoryFilter: string;
  onAddCredential: (name: string, username: string, password: string, apiKey: string, category: string) => void;
  onUpdateCredential: (id: string, name: string, username: string, password: string, apiKey: string, category: string) => void;
  onDeleteCredential: (id: string) => void;
}

const CredentialsManagement: React.FC<CredentialsManagementProps> = ({
  credentials,
  masterCategoryFilter,
  onAddCredential,
  onUpdateCredential,
  onDeleteCredential
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (credential: Credential) => {
    setEditingCredential(credential);
    setIsDialogOpen(true);
  };

  const handleSave = (name: string, username: string, password: string, apiKey: string, category: string) => {
    if (editingCredential) {
      onUpdateCredential(editingCredential.id, name, username, password, apiKey, category);
    } else {
      onAddCredential(name, username, password, apiKey, category);
    }
    setEditingCredential(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCredential(null);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDeleteCredential(deleteId);
      toast.success('Credential deleted');
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Key className="h-8 w-8" />
            Credentials
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your account credentials and API keys
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Credential
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <CredentialsList
        credentials={credentials}
        searchQuery={searchQuery}
        masterCategoryFilter={masterCategoryFilter}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
      />

      <CredentialDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingCredential={editingCredential}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Credential?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the credential.
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

export default CredentialsManagement;
