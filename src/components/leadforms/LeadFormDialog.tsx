
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LeadForm } from '@/types/leadForm';
import { toast } from 'sonner';

interface LeadFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, code: string) => void;
  editingLeadForm?: LeadForm | null;
}

const LeadFormDialog: React.FC<LeadFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLeadForm
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (editingLeadForm) {
      setName(editingLeadForm.name);
      setCode(editingLeadForm.code);
    } else {
      setName('');
      setCode('');
    }
  }, [editingLeadForm, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    
    if (!code.trim()) {
      toast.error('Please enter the code');
      return;
    }

    onSave(name.trim(), code.trim());
    onClose();
    toast.success(editingLeadForm ? 'Lead form updated' : 'Lead form created');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingLeadForm ? 'Edit Lead Form' : 'Create New Lead Form'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter lead form name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code Snippet</Label>
              <Textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your lead form code here..."
                className="font-mono text-sm min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingLeadForm ? 'Save Changes' : 'Create Lead Form'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadFormDialog;
