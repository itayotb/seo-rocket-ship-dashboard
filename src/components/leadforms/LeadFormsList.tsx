
import React from 'react';
import { LeadForm } from '@/types/leadForm';
import LeadFormCard from './LeadFormCard';

interface LeadFormsListProps {
  leadForms: LeadForm[];
  onEdit: (leadForm: LeadForm) => void;
  onDelete: (id: string) => void;
}

const LeadFormsList: React.FC<LeadFormsListProps> = ({ leadForms, onEdit, onDelete }) => {
  if (leadForms.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No lead forms yet</p>
        <p className="text-sm mt-1">Create your first lead form to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leadForms.map((leadForm) => (
        <LeadFormCard
          key={leadForm.id}
          leadForm={leadForm}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default LeadFormsList;
