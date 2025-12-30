
import React from 'react';
import { CloudflareAccount } from '@/types/cloudflare';
import DomainStepOne from './DomainStepOne';
import DomainStepTwo from './DomainStepTwo';
import DomainStepThree from './DomainStepThree';
import DomainStepFour from './DomainStepFour';

interface DomainWizardContentProps {
  currentStep: number;
  domainName: string;
  onDomainNameChange: (domain: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  selectedAccountId: string;
  onAccountSelect: (accountId: string) => void;
  accounts: CloudflareAccount[];
  nameservers: string[];
}

const DomainWizardContent = ({
  currentStep,
  domainName,
  onDomainNameChange,
  category,
  onCategoryChange,
  selectedAccountId,
  onAccountSelect,
  accounts,
  nameservers
}: DomainWizardContentProps) => {
  switch (currentStep) {
    case 0:
      return (
        <DomainStepOne
          domainName={domainName}
          onDomainNameChange={onDomainNameChange}
          category={category}
          onCategoryChange={onCategoryChange}
        />
      );
    case 1:
      return (
        <DomainStepTwo
          domainName={domainName}
          selectedAccountId={selectedAccountId}
          accounts={accounts}
          onAccountSelect={onAccountSelect}
        />
      );
    case 2:
      return <DomainStepThree nameservers={nameservers} />;
    case 3:
      return <DomainStepFour domainName={domainName} />;
    default:
      return null;
  }
};

export default DomainWizardContent;
