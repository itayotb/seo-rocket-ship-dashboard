
import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { WebsiteCreationStep } from '@/types/websiteCreation';

interface WebsiteCreationProgressProps {
  steps: WebsiteCreationStep[];
  currentStep: number;
}

const WebsiteCreationProgress = ({ steps, currentStep }: WebsiteCreationProgressProps) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center space-y-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index < currentStep
                ? 'bg-green-500 text-white'
                : index === currentStep
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}>
              {index < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </div>
            <div className="text-center">
              <p className={`text-xs font-medium ${
                index <= currentStep ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WebsiteCreationProgress;
