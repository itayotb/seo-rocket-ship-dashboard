
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
import { WebsiteCreationData } from '@/types/websiteCreation';
import { LeadForm } from '@/types/leadForm';

interface WebsiteStepSixProps {
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
  leadForms: LeadForm[];
}

const WebsiteStepSix: React.FC<WebsiteStepSixProps> = ({ data, onUpdate, leadForms }) => {
  const selectedLeadForm = leadForms.find(form => form.id === data.leadFormId);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileCode className="h-12 w-12 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">Select Lead Form</h2>
        <p className="text-muted-foreground mt-2">
          {data.leadFormId 
            ? 'A lead form was auto-selected based on your template. You can change it if needed.'
            : 'Choose a lead form to embed in your website (optional)'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leadForm">Select a Lead Form</Label>
            <Select
              value={data.leadFormId || 'none'}
              onValueChange={(value) => onUpdate({ leadFormId: value === 'none' ? undefined : value })}
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
              <Label>Code Preview</Label>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-40 overflow-y-auto">
                <code>{selectedLeadForm.code}</code>
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteStepSix;
