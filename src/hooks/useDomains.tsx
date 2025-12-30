import { useState, useEffect } from 'react';
import { Domain } from '@/types/domain';
import { useToast } from '@/hooks/use-toast';
import { addCustomDomainCategory } from '@/utils/domainCategories';

export const useDomains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load domains from localStorage on mount
  useEffect(() => {
    const savedDomains = localStorage.getItem('domains');
    if (savedDomains) {
      try {
        const parsed = JSON.parse(savedDomains);
        setDomains(parsed);
      } catch (error) {
        console.error('Failed to parse saved domains:', error);
      }
    }
  }, []);

  const saveDomains = (newDomains: Domain[]) => {
    localStorage.setItem('domains', JSON.stringify(newDomains));
    setDomains(newDomains);
  };

  const addDomain = async (domainName: string, category: string, cloudflareAccountId?: string): Promise<Domain> => {
    setIsLoading(true);
    try {
      // Check if it's a custom category and add it to the custom categories list
      const isCustomCategory = !['business', 'ecommerce', 'blog', 'portfolio', 'landing-page', 'news', 'educational', 'nonprofit', 'other'].includes(category);
      if (isCustomCategory) {
        addCustomDomainCategory(category);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newDomain: Domain = {
        id: `domain_${Date.now()}`,
        name: domainName,
        category: category,
        status: 'pending',
        cloudflareStatus: 'not_added',
        dnsStatus: 'not_configured',
        searchConsoleStatus: 'not_added',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        verificationToken: `verify_${Math.random().toString(36).substring(2, 15)}`,
        cloudflareAccountId,
        nameservers: cloudflareAccountId ? ['ns1.cloudflare.com', 'ns2.cloudflare.com'] : undefined
      };

      const updatedDomains = [...domains, newDomain];
      saveDomains(updatedDomains);
      
      toast({
        title: "Domain Added",
        description: `${domainName} has been added to your domains.`,
      });

      return newDomain;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDomain = async (domainId: string, updates: Partial<Domain>) => {
    const updatedDomains = domains.map(domain =>
      domain.id === domainId
        ? { ...domain, ...updates, updatedAt: new Date().toISOString() }
        : domain
    );
    saveDomains(updatedDomains);
  };

  const deleteDomain = async (domainId: string) => {
    const domain = domains.find(d => d.id === domainId);
    const updatedDomains = domains.filter(domain => domain.id !== domainId);
    saveDomains(updatedDomains);
    
    toast({
      title: "Domain Deleted",
      description: `${domain?.name} has been removed from your domains.`,
    });
  };

  const checkDomainStatus = async (domainId: string) => {
    setIsLoading(true);
    try {
      // Simulate status check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock status update (in real app, this would call APIs)
      const randomStatus = Math.random() > 0.5 ? 'active' : 'error';
      await updateDomain(domainId, {
        status: randomStatus,
        cloudflareStatus: randomStatus === 'active' ? 'active' : 'error',
        dnsStatus: randomStatus === 'active' ? 'active' : 'error'
      });
      
      toast({
        title: "Status Updated",
        description: `Domain status has been refreshed.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    domains,
    isLoading,
    addDomain,
    updateDomain,
    deleteDomain,
    checkDomainStatus
  };
};
