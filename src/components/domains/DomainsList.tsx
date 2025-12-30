import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Domain } from '@/types/domain';
import { RefreshCw, Trash2, Settings, Globe, Edit } from 'lucide-react';

interface DomainsListProps {
  domains: Domain[];
  isLoading: boolean;
  onUpdateDomain: (domainId: string, updates: Partial<Domain>) => void;
  onDeleteDomain: (domainId: string) => void;
  onCheckStatus: (domainId: string) => void;
  onEditDomain: (domain: Domain) => void;
}

const DomainsList = ({ domains, isLoading, onUpdateDomain, onDeleteDomain, onCheckStatus, onEditDomain }: DomainsListProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      active: { variant: 'default' as const, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      error: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      setup_required: { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      not_added: { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      not_configured: { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      verified: { variant: 'default' as const, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    // Handle undefined or null category
    if (!category) {
      category = 'other';
    }

    const categoryColors = {
      business: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ecommerce: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      blog: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      portfolio: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'landing-page': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'news': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      educational: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      nonprofit: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };

    const colorClass = categoryColors[category as keyof typeof categoryColors] || categoryColors.other;
    
    return (
      <Badge variant="secondary" className={colorClass}>
        {category.replace('-', ' ')}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (domains.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Your Domains</span>
          </CardTitle>
          <CardDescription>
            No domains configured yet. Add your first domain to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Your Domains</span>
        </CardTitle>
        <CardDescription>
          Manage your domains and their integration status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cloudflare</TableHead>
              <TableHead>DNS</TableHead>
              <TableHead>Search Console</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id}>
                <TableCell className="font-medium">{domain.name}</TableCell>
                <TableCell>{getCategoryBadge(domain.category)}</TableCell>
                <TableCell>{getStatusBadge(domain.status)}</TableCell>
                <TableCell>{getStatusBadge(domain.cloudflareStatus)}</TableCell>
                <TableCell>{getStatusBadge(domain.dnsStatus)}</TableCell>
                <TableCell>{getStatusBadge(domain.searchConsoleStatus)}</TableCell>
                <TableCell className="text-gray-500 dark:text-gray-400">
                  {formatDate(domain.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditDomain(domain)}
                      title="Edit domain"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCheckStatus(domain.id)}
                      disabled={isLoading}
                      title="Refresh status"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Configure domain:', domain.id)}
                      title="Configure domain"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteDomain(domain.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete domain"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DomainsList;
