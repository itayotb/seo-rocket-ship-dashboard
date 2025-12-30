
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Info } from 'lucide-react';
import { AppUser, UserRole, RolePermission } from '@/types/permission';
import UsersList from './UsersList';
import UserDialog from './UserDialog';
import RolePermissionsCard from './RolePermissionsCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PermissionsManagementProps {
  users: AppUser[];
  rolePermissions: RolePermission[];
  onAddUser: (email: string, fullName: string, role: UserRole) => void;
  onUpdateUser: (id: string, data: Partial<Omit<AppUser, 'id' | 'createdAt'>>) => void;
  onDeleteUser: (id: string) => void;
}

const PermissionsManagement: React.FC<PermissionsManagementProps> = ({
  users,
  rolePermissions,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: AppUser) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleSaveUser = (email: string, fullName: string, role: UserRole, isActive: boolean) => {
    if (editingUser) {
      onUpdateUser(editingUser.id, { email, fullName, role, isActive });
    } else {
      onAddUser(email, fullName, role);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Permissions</h2>
        <p className="text-muted-foreground mt-1">
          Manage users and their access permissions
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This is a demo interface. In production, user management would be connected to a real authentication system.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <UsersList
        users={filteredUsers}
        onEditUser={handleEditUser}
        onDeleteUser={onDeleteUser}
      />

      <RolePermissionsCard rolePermissions={rolePermissions} />

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default PermissionsManagement;
