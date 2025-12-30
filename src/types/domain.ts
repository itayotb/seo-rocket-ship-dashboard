
export interface Domain {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'active' | 'error' | 'setup_required';
  cloudflareStatus: 'not_added' | 'pending' | 'active' | 'error';
  dnsStatus: 'not_configured' | 'pending' | 'active' | 'error';
  searchConsoleStatus: 'not_added' | 'pending' | 'verified' | 'error';
  createdAt: string;
  updatedAt: string;
  cloudflareZoneId?: string;
  cloudflareAccountId?: string;
  verificationToken?: string;
  nameservers?: string[];
  errors?: string[];
}

export interface DomainWizardStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  component?: React.ComponentType<any>;
}

export interface DNSRecord {
  type: 'A' | 'CNAME' | 'TXT' | 'MX';
  name: string;
  value: string;
  ttl?: number;
  priority?: number;
}
