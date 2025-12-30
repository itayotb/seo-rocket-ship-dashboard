import React from 'react';
import { LeadForm } from '@/types/leadForm';
import { FileCode, Copy, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface LeadFormsListProps {
  leadForms: LeadForm[];
  onEdit: (leadForm: LeadForm) => void;
  onDelete: (id: string) => void;
}

const LeadFormsList: React.FC<LeadFormsListProps> = ({ leadForms, onEdit, onDelete }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard');
  };

  if (leadForms.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <FileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground">No lead forms yet</h3>
        <p className="text-muted-foreground mt-1">Create your first lead form to get started</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leadForms.map((leadForm) => (
            <TableRow key={leadForm.id}>
              <TableCell className="font-medium">{leadForm.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm truncate max-w-[200px]">
                    {leadForm.code.substring(0, 30)}...
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(leadForm.code)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(leadForm.createdAt), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(leadForm.updatedAt), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(leadForm)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(leadForm.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadFormsList;
