
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/permission';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const roleStyles: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  editor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
};

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  editor: 'Editor',
  viewer: 'Viewer',
};

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className }) => {
  return (
    <Badge 
      variant="outline" 
      className={cn('font-medium', roleStyles[role], className)}
    >
      {roleLabels[role]}
    </Badge>
  );
};

export default RoleBadge;
