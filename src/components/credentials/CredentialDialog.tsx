
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Credential } from '@/types/credential';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface CredentialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, username: string, password: string, apiKey: string, category: string) => void;
  editingCredential: Credential | null;
}

const categories = [
  { value: 'business', label: 'Business' },
  { value: 'health', label: 'Health' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' },
];

const CredentialDialog: React.FC<CredentialDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCredential
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [category, setCategory] = useState('business');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editingCredential) {
      setName(editingCredential.name);
      setUsername(editingCredential.username);
      setPassword(editingCredential.password);
      setApiKey(editingCredential.apiKey || '');
      setCategory(editingCredential.category);
    } else {
      setName('');
      setUsername('');
      setPassword('');
      setApiKey('');
      setCategory('business');
    }
    setShowPassword(false);
  }, [editingCredential, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave(name.trim(), username.trim(), password.trim(), apiKey.trim(), category);
    toast.success(editingCredential ? 'Credential updated' : 'Credential created');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCredential ? 'Edit Credential' : 'New Credential'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Gmail, AWS, Cloudflare"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key (Optional)</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key if applicable"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCredential ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialDialog;
