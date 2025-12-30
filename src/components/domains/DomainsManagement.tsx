
import React, { useState, useMemo } from 'react';
import { useDomains } from '@/hooks/useDomains';
import { Domain } from '@/types/domain';
import DomainsHeader from './DomainsHeader';
import DomainsList from './DomainsList';
import DomainWizard from './DomainWizard';

interface DomainsManagementProps {
  masterCategoryFilter: string;
}

const DomainsManagement: React.FC<DomainsManagementProps> = ({ masterCategoryFilter }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | undefined>(undefined);
  const { domains, isLoading, addDomain, updateDomain, deleteDomain, checkDomainStatus } = useDomains();

  // Filter domains by master category
  const filteredDomains = useMemo(() => {
    if (masterCategoryFilter === 'all') return domains;
    return domains.filter(domain => domain.category === masterCategoryFilter);
  }, [domains, masterCategoryFilter]);

  const handleAddDomain = () => {
    setEditingDomain(undefined);
    setShowWizard(true);
  };

  const handleEditDomain = (domain: Domain) => {
    setEditingDomain(domain);
    setShowWizard(true);
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
    setEditingDomain(undefined);
  };

  return (
    <div className="space-y-6">
      <DomainsHeader 
        domainCount={filteredDomains.length}
        onAddDomain={handleAddDomain}
      />
      
      <DomainsList
        domains={filteredDomains}
        isLoading={isLoading}
        onUpdateDomain={updateDomain}
        onDeleteDomain={deleteDomain}
        onCheckStatus={checkDomainStatus}
        onEditDomain={handleEditDomain}
      />

      <DomainWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onComplete={handleWizardComplete}
        onAddDomain={addDomain}
        editingDomain={editingDomain}
        onUpdateDomain={updateDomain}
      />
    </div>
  );
};

export default DomainsManagement;
