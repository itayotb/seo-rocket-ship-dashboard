
export interface CloudflareSettings {
  apiToken: string;
  email: string;
}

export interface CloudflareZone {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'initializing' | 'moved' | 'deleted' | 'deactivated';
  type: 'full' | 'partial' | 'secondary';
}

export interface CloudflareAccount {
  id: string;
  name: string;
  type: 'standard' | 'enterprise';
  status: 'active' | 'suspended';
  createdOn: string;
}

export interface CloudflareConnectionStatus {
  isConnected: boolean;
  lastChecked?: Date;
  error?: string;
  accounts?: CloudflareAccount[];
}
