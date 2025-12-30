
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Globe, CheckCircle, XCircle, Clock } from 'lucide-react';
import { WebsiteCreationData } from '@/types/websiteCreation';
import { useDomains } from '@/hooks/useDomains';

interface WebsiteStepOneProps {
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
  onNavigateToDomains?: () => void;
}

const WEBSITE_CATEGORIES = [
  { value: 'business', label: 'Business' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'blog', label: 'Blog' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'news', label: 'News/Media' },
  { value: 'educational', label: 'Educational' },
  { value: 'nonprofit', label: 'Non-profit' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'other', label: 'Other' }
];

const WebsiteStepOne = ({ data, onUpdate, onNavigateToDomains }: WebsiteStepOneProps) => {
  const { domains } = useDomains();
  const [showDomainInput, setShowDomainInput] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  // Filter domains to show all domains, not just active ones
  const availableDomains = domains.filter(domain => 
    domain.status === 'active' || domain.status === 'pending' || domain.status === 'setup_required'
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'pending':
      case 'setup_required':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Globe className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      pending: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      setup_required: { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      error: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return config.variant;
  };

  const handleDomainSelect = (domainName: string) => {
    if (domainName === 'add_new') {
      if (onNavigateToDomains) {
        onNavigateToDomains();
      } else {
        setShowDomainInput(true);
      }
    } else {
      onUpdate({ domain: domainName });
      setShowDomainInput(false);
    }
  };

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      onUpdate({ domain: newDomain.trim() });
      setNewDomain('');
      setShowDomainInput(false);
    }
  };

  // Auto-select category based on website name
  const handleWebsiteNameChange = (name: string) => {
    onUpdate({ websiteName: name });
    
    // Auto-detect category based on keywords in name
    const lowerName = name.toLowerCase();
    if (lowerName.includes('shop') || lowerName.includes('store') || lowerName.includes('market')) {
      onUpdate({ category: 'ecommerce' });
    } else if (lowerName.includes('blog') || lowerName.includes('news')) {
      onUpdate({ category: 'blog' });
    } else if (lowerName.includes('portfolio') || lowerName.includes('gallery')) {
      onUpdate({ category: 'portfolio' });
    } else if (lowerName.includes('restaurant') || lowerName.includes('cafe') || lowerName.includes('food')) {
      onUpdate({ category: 'restaurant' });
    } else if (lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('wellness')) {
      onUpdate({ category: 'health' });
    } else if (!data.category) {
      onUpdate({ category: 'business' });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="websiteName">Website Name *</Label>
        <Input
          id="websiteName"
          value={data.websiteName}
          onChange={(e) => handleWebsiteNameChange(e.target.value)}
          placeholder="My Awesome Website"
          className="mt-1"
        />
        <p className="text-sm text-gray-500 mt-1">
          This will be displayed as your website title
        </p>
      </div>

      <div>
        <Label htmlFor="domain">Domain *</Label>
        {!showDomainInput ? (
          <Select value={data.domain} onValueChange={handleDomainSelect}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a domain from your domains" />
            </SelectTrigger>
            <SelectContent>
              {availableDomains.map((domain) => (
                <SelectItem key={domain.id} value={domain.name}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(domain.status)}
                      <span>{domain.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant={getStatusBadge(domain.status)} className="text-xs">
                        {domain.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {domain.category}
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="add_new">
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>{onNavigateToDomains ? 'Go to Domains tab to add new domain' : 'Add new domain'}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex space-x-2 mt-1">
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="example.com"
              className="flex-1"
            />
            <Button onClick={handleAddDomain} size="sm">
              Add
            </Button>
            <Button 
              onClick={() => setShowDomainInput(false)} 
              variant="outline" 
              size="sm"
            >
              Cancel
            </Button>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {availableDomains.length === 0 ? 
            "No domains found. Go to the Domains tab to add domains first, or add a new one here." :
            `${availableDomains.length} domain(s) available from your domains list`
          }
        </p>
      </div>
      
      <div>
        <Label htmlFor="category">Website Category *</Label>
        <Select value={data.category} onValueChange={(value) => onUpdate({ category: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {WEBSITE_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-1">
          {data.websiteName ? "Category was auto-detected from your website name" : "Category will be auto-detected when you enter a website name"}
        </p>
      </div>
    </div>
  );
};

export default WebsiteStepOne;
