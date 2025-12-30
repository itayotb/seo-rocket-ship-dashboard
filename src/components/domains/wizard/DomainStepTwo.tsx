
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { CloudflareAccount } from '@/types/cloudflare';

interface DomainStepTwoProps {
  domainName: string;
  selectedAccountId: string;
  accounts: CloudflareAccount[];
  onAccountSelect: (accountId: string) => void;
}

const DomainStepTwo = ({ 
  domainName, 
  selectedAccountId, 
  accounts, 
  onAccountSelect 
}: DomainStepTwoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="account">Cloudflare Account</Label>
        <Select value={selectedAccountId} onValueChange={onAccountSelect}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a Cloudflare account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-xs text-gray-500">{account.type}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-1">
          Choose which Cloudflare account to use for {domainName}
        </p>
      </div>
    </div>
  );
};

export default DomainStepTwo;
