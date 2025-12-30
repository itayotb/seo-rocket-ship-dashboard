
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { CloudflareConnectionStatus } from '@/types/cloudflare';

interface CloudflareHeaderProps {
  connectionStatus: CloudflareConnectionStatus;
}

const CloudflareHeader = ({ connectionStatus }: CloudflareHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Cloudflare Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Configure your Cloudflare integration for enhanced SEO and performance optimization
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {connectionStatus.isConnected ? (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Not Connected
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CloudflareHeader;
