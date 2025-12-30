import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wand2 } from 'lucide-react';
import { CreatedWebsite } from '@/types/websiteCreation';
import { useWebsiteCreation } from '@/hooks/useWebsiteCreation';
import { validateStep, getValidationMessage } from '@/utils/websiteCreationValidation';
import { getWebsiteCreationSteps } from '@/utils/websiteCreationSteps';
import WebsiteCreationProgress from './WebsiteCreationProgress';
import WebsiteCreationForm from './WebsiteCreationForm';
import WebsiteCreationActions from './WebsiteCreationActions';

interface WebsiteCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (website: CreatedWebsite) => void;
  onNavigateToDomains?: () => void;
}

const WebsiteCreationWizard = ({ open, onOpenChange, onComplete, onNavigateToDomains }: WebsiteCreationWizardProps) => {
  const steps = getWebsiteCreationSteps();
  
  const {
    currentStep,
    setCurrentStep,
    isLoading,
    websiteData,
    updateWebsiteData,
    resetWizard,
    createWebsite,
    toast
  } = useWebsiteCreation(onComplete, () => onOpenChange(false));

  const handleNext = async () => {
    if (!validateStep(currentStep, websiteData)) {
      toast({
        title: "Incomplete Information",
        description: getValidationMessage(currentStep),
        variant: "destructive"
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await createWebsite();
    }
  };

  const handleClose = () => {
    resetWizard();
    onOpenChange(false);
  };

  const handleNavigateToDomains = () => {
    handleClose();
    if (onNavigateToDomains) {
      onNavigateToDomains();
    }
  };

  const getStepTitle = () => {
    return steps[currentStep]?.title || 'Create Website';
  };

  const getStepDescription = () => {
    return steps[currentStep]?.description || 'Complete the form to create your website';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-blue-600" />
            <span>{getStepTitle()}</span>
          </DialogTitle>
          <DialogDescription>
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <WebsiteCreationProgress steps={steps} currentStep={currentStep} />
          
          <WebsiteCreationForm
            currentStep={currentStep}
            data={websiteData}
            onUpdate={updateWebsiteData}
            onNavigateToDomains={handleNavigateToDomains}
          />

          <WebsiteCreationActions
            currentStep={currentStep}
            totalSteps={steps.length}
            isLoading={isLoading}
            onBack={() => setCurrentStep(currentStep - 1)}
            onNext={handleNext}
            onCancel={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebsiteCreationWizard;
