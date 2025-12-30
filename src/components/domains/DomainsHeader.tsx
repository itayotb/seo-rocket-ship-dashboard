
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Globe } from 'lucide-react';

interface DomainsHeaderProps {
  domainCount: number;
  onAddDomain: () => void;
}

const DomainsHeader = ({ domainCount, onAddDomain }: DomainsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Domain Management</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your domains and their integration with Cloudflare and Google Search Console
        </p>
        <div className="flex items-center space-x-2 mt-2">
          <Globe className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {domainCount} {domainCount === 1 ? 'domain' : 'domains'} configured
          </span>
        </div>
      </div>
      <Button onClick={onAddDomain} className="flex items-center space-x-2">
        <Plus className="h-4 w-4" />
        <span>Add Domain</span>
      </Button>
    </div>
  );
};

export default DomainsHeader;
