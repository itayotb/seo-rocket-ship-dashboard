
import React from 'react';
import { WebsiteCreationData } from '@/types/websiteCreation';
import { LeadForm } from '@/types/leadForm';
import WebsiteStepOne from './steps/WebsiteStepOne';
import WebsiteStepTwo from './steps/WebsiteStepTwo';
import WebsiteStepTwoPointFive from './steps/WebsiteStepTwoPointFive';
import WebsiteStepThree from './steps/WebsiteStepThree';
import WebsiteStepFive from './steps/WebsiteStepFive';
import WebsiteStepSix from './steps/WebsiteStepSix';

interface WebsiteCreationFormProps {
  currentStep: number;
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
  onNavigateToDomains?: () => void;
  leadForms: LeadForm[];
}

const WebsiteCreationForm = ({ currentStep, data, onUpdate, onNavigateToDomains, leadForms }: WebsiteCreationFormProps) => {
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <WebsiteStepOne 
            data={data} 
            onUpdate={onUpdate} 
            onNavigateToDomains={onNavigateToDomains}
          />
        );
      case 1:
        return <WebsiteStepTwo data={data} onUpdate={onUpdate} />;
      case 2:
        return <WebsiteStepTwoPointFive data={data} onUpdate={onUpdate} />;
      case 3:
        return <WebsiteStepThree data={data} onUpdate={onUpdate} />;
      case 4:
        return <WebsiteStepSix data={data} onUpdate={onUpdate} leadForms={leadForms} />;
      case 5:
        return <WebsiteStepFive data={data} onUpdate={onUpdate} />;
      default:
        return null;
    }
  };

  return <div className="space-y-6">{renderStep()}</div>;
};

export default WebsiteCreationForm;
