
export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface RolePermission {
  role: UserRole;
  label: string;
  color: string;
  description: string;
  permissions: {
    websites: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    templates: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    leadForms: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    credentials: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    domains: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    keywordResearch: { view: boolean; analyze: boolean; export: boolean };
    bulkCreation: { view: boolean; create: boolean; manage: boolean };
    cloudflare: { view: boolean; manage: boolean };
    analytics: { view: boolean };
    reports: { view: boolean; create: boolean };
    settings: { view: boolean; edit: boolean };
    permissions: { view: boolean; manage: boolean };
  };
}
