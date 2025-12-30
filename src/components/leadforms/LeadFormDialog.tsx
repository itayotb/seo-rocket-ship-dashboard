
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeadForm } from '@/types/leadForm';
import { Template } from '@/types/websiteCreation';
import { toast } from 'sonner';
import { TEMPLATE_CATEGORIES } from '@/utils/templateCategories';

interface LeadFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, code: string, category: string, templateId?: string) => void;
  editingLeadForm?: LeadForm | null;
  templates: Template[];
}

const LeadFormDialog: React.FC<LeadFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLeadForm,
  templates
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [templateId, setTemplateId] = useState<string>('');

  useEffect(() => {
    if (editingLeadForm) {
      setName(editingLeadForm.name);
      setCode(editingLeadForm.code);
      setCategory(editingLeadForm.category);
      setTemplateId(editingLeadForm.templateId || '');
    } else {
      setName('');
      setCode('');
      setCategory('');
      setTemplateId('');
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

    if (!category) {
      toast.error('Please select a category');
      return;
    }

    onSave(name.trim(), code.trim(), category, templateId || undefined);
    onClose();
    toast.success(editingLeadForm ? 'Lead form updated' : 'Lead form created');
  };

  const filteredTemplates = templates.filter(t => 
    category ? t.category === category : true
  );

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_CATEGORIES.filter(c => c.value !== 'all').map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Template (Optional)</Label>
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {filteredTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
