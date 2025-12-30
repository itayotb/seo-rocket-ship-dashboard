
import React from 'react';
import { Button } from '@/components/ui/button';

interface WebsiteCreationActionsProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
}

const WebsiteCreationActions = ({ 
  currentStep, 
  totalSteps, 
  isLoading, 
  onBack, 
  onNext, 
  onCancel 
}: WebsiteCreationActionsProps) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between pt-4 border-t">
      <Button
        variant="outline"
        onClick={isFirstStep ? onCancel : onBack}
        disabled={isLoading}
      >
        {isFirstStep ? 'Cancel' : 'Back'}
      </Button>
      <Button 
        onClick={onNext} 
        disabled={isLoading}
        className="min-w-[120px]"
      >
        {isLoading ? 'Creating...' : 
         isLastStep ? 'Create and deploy Website' : 'Next'}
      </Button>
    </div>
  );
};

export default WebsiteCreationActions;
