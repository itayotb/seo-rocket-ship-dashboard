
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LeadForm } from '@/types/leadForm';
import { toast } from 'sonner';

interface BulkLeadFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  leadForms: LeadForm[];
  onApply: (leadFormId: string | undefined) => void;
}

const BulkLeadFormDialog: React.FC<BulkLeadFormDialogProps> = ({
  isOpen,
  onClose,
  selectedCount,
  leadForms,
  onApply
}) => {
  const [selectedLeadFormId, setSelectedLeadFormId] = useState<string>('none');

  const handleApply = () => {
    onApply(selectedLeadFormId === 'none' ? undefined : selectedLeadFormId);
    toast.success(`Lead form updated for ${selectedCount} website${selectedCount !== 1 ? 's' : ''}`);
    onClose();
    setSelectedLeadFormId('none');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Lead Form</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Applying to:</span>
            <Badge>{selectedCount} website{selectedCount !== 1 ? 's' : ''}</Badge>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leadForm">Select Lead Form</Label>
            <Select
              value={selectedLeadFormId}
              onValueChange={setSelectedLeadFormId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a lead form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Lead Form (Remove)</SelectItem>
                {leadForms.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply to Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkLeadFormDialog;
