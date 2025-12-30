
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RolePermission } from '@/types/permission';
import { Check, X } from 'lucide-react';
import RoleBadge from './RoleBadge';

interface RolePermissionsCardProps {
  rolePermissions: RolePermission[];
}

const RolePermissionsCard: React.FC<RolePermissionsCardProps> = ({ rolePermissions }) => {
  const sections = [
    { key: 'websites', label: 'Websites' },
    { key: 'templates', label: 'Templates' },
    { key: 'leadForms', label: 'Lead Forms' },
    { key: 'credentials', label: 'Credentials' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'reports', label: 'Reports' },
    { key: 'settings', label: 'Settings' },
    { key: 'permissions', label: 'Permissions' },
  ];

  const actions = ['view', 'create', 'edit', 'delete', 'manage'];

  const getPermissionValue = (
    permissions: RolePermission['permissions'],
    section: string,
    action: string
  ): boolean | undefined => {
    const sectionPerms = permissions[section as keyof typeof permissions];
    if (!sectionPerms) return undefined;
    return (sectionPerms as Record<string, boolean>)[action];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Role Permissions Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Section</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Action</th>
                {rolePermissions.map((rp) => (
                  <th key={rp.role} className="text-center py-3 px-2">
                    <RoleBadge role={rp.role} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => {
                const sectionActions = actions.filter((action) =>
                  rolePermissions.some((rp) => {
                    const val = getPermissionValue(rp.permissions, section.key, action);
                    return val !== undefined;
                  })
                );

                return sectionActions.map((action, actionIdx) => (
                  <tr
                    key={`${section.key}-${action}`}
                    className="border-b last:border-0"
                  >
                    {actionIdx === 0 && (
                      <td
                        className="py-2 px-2 font-medium"
                        rowSpan={sectionActions.length}
                      >
                        {section.label}
                      </td>
                    )}
                    <td className="py-2 px-2 text-muted-foreground capitalize">
                      {action}
                    </td>
                    {rolePermissions.map((rp) => {
                      const hasPermission = getPermissionValue(
                        rp.permissions,
                        section.key,
                        action
                      );
                      return (
                        <td key={rp.role} className="py-2 px-2 text-center">
                          {hasPermission === undefined ? (
                            <span className="text-muted-foreground">—</span>
                          ) : hasPermission ? (
                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-red-500 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolePermissionsCard;
