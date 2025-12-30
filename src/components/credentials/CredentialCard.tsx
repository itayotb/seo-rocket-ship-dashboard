
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Copy, Check, Eye, EyeOff, Key } from 'lucide-react';
import { Credential } from '@/types/credential';
import { toast } from 'sonner';

interface CredentialCardProps {
  credential: Credential;
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credential, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ value, field }: { value: string; field: string }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      onClick={() => handleCopy(value, field)}
    >
      {copiedField === field ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{credential.name}</CardTitle>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(credential)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(credential.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Badge variant="secondary" className="mt-2 w-fit capitalize">
          {credential.category}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Username</p>
            <p className="text-sm font-medium truncate">{credential.username}</p>
          </div>
          <CopyButton value={credential.username} field="Username" />
        </div>

        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Password</p>
            <p className="text-sm font-medium font-mono">
              {showPassword ? credential.password : '••••••••'}
            </p>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
            <CopyButton value={credential.password} field="Password" />
          </div>
        </div>

        {credential.apiKey && (
          <div className="flex items-center justify-between bg-muted p-2 rounded-md">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">API Key</p>
              <p className="text-sm font-medium font-mono truncate">
                {credential.apiKey.substring(0, 12)}...
              </p>
            </div>
            <CopyButton value={credential.apiKey} field="API Key" />
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Updated: {credential.updatedAt}
        </p>
      </CardContent>
    </Card>
  );
};

export default CredentialCard;
