
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileCode } from 'lucide-react';
import { LeadForm } from '@/types/leadForm';

interface LeadFormSelectorProps {
  currentLeadFormId?: string;
  leadForms: LeadForm[];
  onLeadFormChange: (leadFormId: string | undefined) => void;
}

const LeadFormSelector: React.FC<LeadFormSelectorProps> = ({
  currentLeadFormId,
  leadForms,
  onLeadFormChange
}) => {
  const selectedLeadForm = leadForms.find(form => form.id === currentLeadFormId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-5 w-5" />
          Lead Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="leadForm">Select Lead Form</Label>
          <Select
            value={currentLeadFormId || 'none'}
            onValueChange={(value) => onLeadFormChange(value === 'none' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a lead form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Lead Form</SelectItem>
              {leadForms.map((form) => (
                <SelectItem key={form.id} value={form.id}>
                  {form.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedLeadForm && (
          <div className="space-y-2">
            <Label>Current Code</Label>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto max-h-32 overflow-y-auto">
              <code>{selectedLeadForm.code}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadFormSelector;
