import React, { useState } from 'react';
import { Credential } from '@/types/credential';
import { Key, Copy, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

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
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch =
      cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      masterCategoryFilter === 'all' || cred.category === masterCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCredentials.map(credential => (
            <TableRow key={credential.id}>
              <TableCell className="font-medium">{credential.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{credential.username}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(credential.username, 'Username')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {visiblePasswords.has(credential.id) ? credential.password : '••••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => togglePasswordVisibility(credential.id)}
                  >
                    {visiblePasswords.has(credential.id) ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(credential.password, 'Password')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {credential.apiKey ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm truncate max-w-[100px]">
                      {credential.apiKey.substring(0, 8)}...
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(credential.apiKey!, 'API Key')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{credential.category}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(credential)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(credential.id)}
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

export default CredentialsList;
