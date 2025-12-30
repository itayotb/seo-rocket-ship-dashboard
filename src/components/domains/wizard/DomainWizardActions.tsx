
import React from 'react';
import { Button } from '@/components/ui/button';
import { DomainWizardStepConfig } from './DomainWizardSteps';

interface DomainWizardActionsProps {
  currentStep: number;
  steps: DomainWizardStepConfig[];
  isLoading: boolean;
  isEditing: boolean;
  onBack: () => void;
  onNext: () => void;
}

const DomainWizardActions = ({
  currentStep,
  steps,
  isLoading,
  isEditing,
  onBack,
  onNext
}: DomainWizardActionsProps) => {
  const getNextButtonText = () => {
    if (isLoading) return 'Loading...';
    if (isEditing && currentStep === 0) return 'Update';
    if (currentStep === steps.length - 1) return 'Close';
    return 'Next';
  };

  const getBackButtonText = () => {
    return currentStep === 0 ? 'Cancel' : 'Back';
  };

  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onBack}
      >
        {getBackButtonText()}
      </Button>
      <Button onClick={onNext} disabled={isLoading}>
        {getNextButtonText()}
      </Button>
    </div>
  );
};

export default DomainWizardActions;
