
import { useState } from 'react';
import { AppUser, UserRole, RolePermission } from '@/types/permission';

const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: 'admin',
    label: 'Admin',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    description: 'Full system access including user management',
    permissions: {
      websites: { view: true, create: true, edit: true, delete: true },
      templates: { view: true, create: true, edit: true, delete: true },
      leadForms: { view: true, create: true, edit: true, delete: true },
      credentials: { view: true, create: true, edit: true, delete: true },
      analytics: { view: true },
      reports: { view: true, create: true },
      settings: { view: true, edit: true },
      permissions: { view: true, manage: true },
    },
  },
  {
    role: 'manager',
    label: 'Manager',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    description: 'Full content management without user management',
    permissions: {
      websites: { view: true, create: true, edit: true, delete: true },
      templates: { view: true, create: true, edit: true, delete: true },
      leadForms: { view: true, create: true, edit: true, delete: true },
      credentials: { view: true, create: true, edit: true, delete: false },
      analytics: { view: true },
      reports: { view: true, create: true },
      settings: { view: true, edit: false },
      permissions: { view: false, manage: false },
    },
  },
  {
    role: 'editor',
    label: 'Editor',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    description: 'Can view, create, and edit content',
    permissions: {
      websites: { view: true, create: true, edit: true, delete: false },
      templates: { view: true, create: true, edit: true, delete: false },
      leadForms: { view: true, create: true, edit: true, delete: false },
      credentials: { view: true, create: false, edit: false, delete: false },
      analytics: { view: true },
      reports: { view: true, create: false },
      settings: { view: false, edit: false },
      permissions: { view: false, manage: false },
    },
  },
  {
    role: 'viewer',
    label: 'Viewer',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    description: 'Read-only access to content',
    permissions: {
      websites: { view: true, create: false, edit: false, delete: false },
      templates: { view: true, create: false, edit: false, delete: false },
      leadForms: { view: true, create: false, edit: false, delete: false },
      credentials: { view: false, create: false, edit: false, delete: false },
      analytics: { view: true },
      reports: { view: true, create: false },
      settings: { view: false, edit: false },
      permissions: { view: false, manage: false },
    },
  },
];

const INITIAL_USERS: AppUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    fullName: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-12-30T09:30:00Z',
    isActive: true,
  },
  {
    id: '2',
    email: 'sarah.manager@example.com',
    fullName: 'Sarah Manager',
    role: 'manager',
    createdAt: '2024-02-20T14:30:00Z',
    lastLogin: '2024-12-29T16:45:00Z',
    isActive: true,
  },
  {
    id: '3',
    email: 'john.editor@example.com',
    fullName: 'John Editor',
    role: 'editor',
    createdAt: '2024-03-10T09:15:00Z',
    lastLogin: '2024-12-28T11:20:00Z',
    isActive: true,
  },
  {
    id: '4',
    email: 'guest.viewer@example.com',
    fullName: 'Guest Viewer',
    role: 'viewer',
    createdAt: '2024-06-05T16:00:00Z',
    lastLogin: '2024-12-27T08:00:00Z',
    isActive: false,
  },
];

export const usePermissions = () => {
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);

  const addUser = (email: string, fullName: string, role: UserRole) => {
    const newUser: AppUser = {
      id: Date.now().toString(),
      email,
      fullName,
      role,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, data: Partial<Omit<AppUser, 'id' | 'createdAt'>>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...data } : user))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const changeRole = (id: string, newRole: UserRole) => {
    updateUser(id, { role: newRole });
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const getRolePermissions = (role: UserRole): RolePermission | undefined => {
    return ROLE_PERMISSIONS.find((rp) => rp.role === role);
  };

  return {
    users,
    rolePermissions: ROLE_PERMISSIONS,
    addUser,
    updateUser,
    deleteUser,
    changeRole,
    toggleUserStatus,
    getRolePermissions,
  };
};
