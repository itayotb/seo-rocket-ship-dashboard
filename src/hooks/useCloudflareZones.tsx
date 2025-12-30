
import { useState } from 'react';
import { useCloudflareSettings } from './useCloudflareSettings';
import { CloudflareAccount } from '@/types/cloudflare';

export interface CloudflareZone {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'initializing';
  nameservers: string[];
  accountId: string;
}

export const useCloudflareZones = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { connectionStatus } = useCloudflareSettings();

  const createZone = async (domainName: string, accountId: string): Promise<CloudflareZone> => {
    setIsLoading(true);
    try {
      // Simulate API call to create Cloudflare zone
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock zone creation response
      const newZone: CloudflareZone = {
        id: `zone_${Date.now()}`,
        name: domainName,
        status: 'pending',
        nameservers: [
          'ns1.cloudflare.com',
          'ns2.cloudflare.com'
        ],
        accountId
      };
      
      return newZone;
    } finally {
      setIsLoading(false);
    }
  };

  const getNameserversForAccount = async (accountId: string): Promise<string[]> => {
    // Return default Cloudflare nameservers for the account
    // In a real implementation, this would fetch account-specific nameservers
    return [
      'ns1.cloudflare.com',
      'ns2.cloudflare.com'
    ];
  };

  return {
    isLoading,
    createZone,
    getNameserversForAccount,
    accounts: connectionStatus.accounts || []
  };
};
