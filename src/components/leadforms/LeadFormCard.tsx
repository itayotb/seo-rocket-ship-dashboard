
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Copy, Check } from 'lucide-react';
import { LeadForm } from '@/types/leadForm';
import { useState } from 'react';
import { toast } from 'sonner';

interface LeadFormCardProps {
  leadForm: LeadForm;
  onEdit: (leadForm: LeadForm) => void;
  onDelete: (id: string) => void;
}

const LeadFormCard: React.FC<LeadFormCardProps> = ({ leadForm, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(leadForm.code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{leadForm.name}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              Updated: {leadForm.updatedAt}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(leadForm)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(leadForm.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto max-h-32 overflow-y-auto">
          <code>{leadForm.code}</code>
        </pre>
      </CardContent>
    </Card>
  );
};

export default LeadFormCard;
