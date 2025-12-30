
import React, { useState } from 'react';
import { useDomains } from '@/hooks/useDomains';
import { Domain } from '@/types/domain';
import DomainsHeader from './DomainsHeader';
import DomainsList from './DomainsList';
import DomainWizard from './DomainWizard';

const DomainsManagement = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | undefined>(undefined);
  const { domains, isLoading, addDomain, updateDomain, deleteDomain, checkDomainStatus } = useDomains();

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
        domainCount={domains.length}
        onAddDomain={handleAddDomain}
      />
      
      <DomainsList
        domains={domains}
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
