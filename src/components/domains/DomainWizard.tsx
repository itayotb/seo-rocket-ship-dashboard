
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Domain } from '@/types/domain';
import { Globe } from 'lucide-react';
import { useDomainWizard } from '@/hooks/useDomainWizard';
import { getDomainWizardSteps } from './wizard/DomainWizardSteps';
import DomainWizardContent from './wizard/DomainWizardContent';
import DomainWizardActions from './wizard/DomainWizardActions';
import WizardProgress from './wizard/WizardProgress';

interface DomainWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onAddDomain: (domain: string, category: string) => Promise<Domain>;
  editingDomain?: Domain;
  onUpdateDomain?: (domainId: string, updates: Partial<Domain>) => void;
}

const DomainWizard = ({ 
  open, 
  onOpenChange, 
  onComplete, 
  onAddDomain, 
  editingDomain, 
  onUpdateDomain 
}: DomainWizardProps) => {
  const {
    currentStep,
    domainName,
    setDomainName,
    category,
    setCategory,
    selectedAccountId,
    setSelectedAccountId,
    nameservers,
    isLoading,
    isEditing,
    accounts,
    handleNext,
    handleBack,
    handleClose
  } = useDomainWizard(
    onAddDomain,
    editingDomain,
    onUpdateDomain,
    onComplete,
    () => onOpenChange(false)
  );

  const steps = getDomainWizardSteps(isEditing);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>{steps[currentStep].title}</span>
          </DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!isEditing && <WizardProgress steps={steps} currentStep={currentStep} />}
          
          <DomainWizardContent
            currentStep={currentStep}
            domainName={domainName}
            onDomainNameChange={setDomainName}
            category={category}
            onCategoryChange={setCategory}
            selectedAccountId={selectedAccountId}
            onAccountSelect={setSelectedAccountId}
            accounts={accounts}
            nameservers={nameservers}
          />

          <DomainWizardActions
            currentStep={currentStep}
            steps={steps}
            isLoading={isLoading}
            isEditing={isEditing}
            onBack={handleBack}
            onNext={handleNext}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DomainWizard;
