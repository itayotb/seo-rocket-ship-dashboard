
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCloudflareZones } from '@/hooks/useCloudflareZones';
import { Domain } from '@/types/domain';

export const useDomainWizard = (
  onAddDomain: (domain: string, category: string) => Promise<Domain>,
  editingDomain?: Domain,
  onUpdateDomain?: (domainId: string, updates: Partial<Domain>) => void,
  onComplete?: () => void,
  onClose?: () => void
) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [domainName, setDomainName] = useState(editingDomain?.name || '');
  const [category, setCategory] = useState(editingDomain?.category || '');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [nameservers, setNameservers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { createZone, getNameserversForAccount, accounts } = useCloudflareZones();

  const isEditing = !!editingDomain;

  const validateDomain = (domain: string) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(domain);
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setDomainName('');
    setCategory('');
    setSelectedAccountId('');
    setNameservers([]);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!domainName.trim()) {
        toast({
          title: "Error",
          description: "Please enter a domain name.",
          variant: "destructive"
        });
        return;
      }

      if (!validateDomain(domainName.trim())) {
        toast({
          title: "Error",
          description: "Please enter a valid domain name (e.g., example.com).",
          variant: "destructive"
        });
        return;
      }

      if (!category) {
        toast({
          title: "Error",
          description: "Please select a domain category.",
          variant: "destructive"
        });
        return;
      }

      if (isEditing && onUpdateDomain) {
        // For editing, just update the domain and close
        onUpdateDomain(editingDomain.id, {
          name: domainName.trim(),
          category: category
        });
        toast({
          title: "Domain Updated",
          description: "Domain information has been updated successfully.",
        });
        handleClose();
        return;
      }

      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (!selectedAccountId) {
        toast({
          title: "Error",
          description: "Please select a Cloudflare account.",
          variant: "destructive"
        });
        return;
      }

      setIsLoading(true);
      try {
        const accountNameservers = await getNameserversForAccount(selectedAccountId);
        setNameservers(accountNameservers);
        setCurrentStep(2);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch nameservers. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      setIsLoading(true);
      try {
        const domain = await onAddDomain(domainName.trim(), category);
        setCurrentStep(3);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add domain. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    resetWizard();
    if (onComplete) onComplete();
    if (onClose) onClose();
  };

  const handleBack = () => {
    if (currentStep === 0) {
      if (onClose) onClose();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    domainName,
    setDomainName,
    category,
    setCategory,
    selectedAccountId,
    setSelectedAccountId,
    nameservers,
    setNameservers,
    isLoading,
    isEditing,
    accounts,
    handleNext,
    handleBack,
    handleClose,
    resetWizard
  };
};
