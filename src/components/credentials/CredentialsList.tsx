
import React from 'react';
import { Credential } from '@/types/credential';
import CredentialCard from './CredentialCard';
import { Key } from 'lucide-react';

interface CredentialsListProps {
  credentials: Credential[];
  searchQuery: string;
  masterCategoryFilter: string;
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
}

const CredentialsList: React.FC<CredentialsListProps> = ({
  credentials,
  searchQuery,
  masterCategoryFilter,
  onEdit,
  onDelete
}) => {
  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch =
      cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      masterCategoryFilter === 'all' || cred.category === masterCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (filteredCredentials.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground">No credentials found</h3>
        <p className="text-muted-foreground mt-1">
          {searchQuery || masterCategoryFilter !== 'all'
            ? 'Try adjusting your search or filter'
            : 'Add your first credential to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredCredentials.map(credential => (
        <CredentialCard
          key={credential.id}
          credential={credential}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CredentialsList;
