import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import { BULK_WIZARD_STEPS, BulkCreationData } from '@/types/bulkWebsiteCreation';
import { Template } from '@/types/websiteCreation';
import { LeadForm } from '@/types/leadForm';
import BulkStepKeywords from './steps/BulkStepKeywords';
import BulkStepDomains from './steps/BulkStepDomains';
import BulkStepTemplate from './steps/BulkStepTemplate';
import BulkStepLeadForms from './steps/BulkStepLeadForms';
import BulkStepScheduling from './steps/BulkStepScheduling';
import BulkStepReview from './steps/BulkStepReview';

interface BulkCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Template[];
  leadForms: LeadForm[];
  onComplete: (data: BulkCreationData) => void;
}

const initialData: BulkCreationData = {
  keywords: [],
  domainMode: 'auto',
  defaultTld: '.com',
  templateDistribution: [],
  registrarDistribution: [],
  category: 'all',
  leadFormDistribution: [],
  scheduling: { mode: 'immediate' },
};

const BulkCreationWizard = ({ open, onOpenChange, templates, leadForms, onComplete }: BulkCreationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<BulkCreationData>(initialData);

  const updateData = (updates: Partial<BulkCreationData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleComplete = () => {
    onComplete(data);
    onOpenChange(false);
    setCurrentStep(1);
    setData(initialData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: 
        return data.keywords.some((kw) => kw.keyword.trim());
      case 2: 
        // Can proceed even if searching - registrar distribution is optional or must be 100%
        const registrarTotal = data.registrarDistribution.reduce((sum, d) => sum + d.percentage, 0);
        return data.registrarDistribution.length === 0 || registrarTotal === 100;
      case 3: 
        const templateTotal = data.templateDistribution.reduce((sum, d) => sum + d.percentage, 0);
        return data.templateDistribution.length > 0 && templateTotal === 100;
      case 4: 
        return data.leadFormDistribution.reduce((sum, d) => sum + d.percentage, 0) === 100;
      case 5: 
        return true;
      case 6: 
        return true;
      default: 
        return true;
    }
  };

  const validKeywordsCount = data.keywords.filter((kw) => kw.keyword.trim()).length;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BulkStepKeywords
            keywords={data.keywords}
            onKeywordsChange={(keywords) => updateData({ keywords: keywords.map(kw => ({ ...kw, tld: kw.tld || data.defaultTld })) })}
          />
        );
      case 2:
        return (
          <BulkStepDomains
            keywords={data.keywords}
            domainMode={data.domainMode}
            defaultTld={data.defaultTld}
            registrarDistribution={data.registrarDistribution}
            onDomainModeChange={(domainMode) => updateData({ domainMode })}
            onDefaultTldChange={(defaultTld) => updateData({ defaultTld })}
            onKeywordsChange={(keywords) => updateData({ keywords })}
            onRegistrarDistributionChange={(registrarDistribution) => updateData({ registrarDistribution })}
          />
        );
      case 3:
        return (
          <BulkStepTemplate
            templates={templates}
            templateDistribution={data.templateDistribution}
            selectedCategory={data.category}
            totalKeywords={validKeywordsCount}
            onTemplateDistributionChange={(templateDistribution) => updateData({ templateDistribution })}
            onCategoryChange={(category) => updateData({ category })}
          />
        );
      case 4:
        return (
          <BulkStepLeadForms
            leadForms={leadForms}
            distribution={data.leadFormDistribution}
            totalKeywords={validKeywordsCount}
            onDistributionChange={(leadFormDistribution) => updateData({ leadFormDistribution })}
          />
        );
      case 5:
        return (
          <BulkStepScheduling
            totalKeywords={validKeywordsCount}
            scheduling={data.scheduling}
            onSchedulingChange={(scheduling) => updateData({ scheduling })}
          />
        );
      case 6:
        return <BulkStepReview data={data} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Create Websites</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            {BULK_WIZARD_STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex-1 text-center text-xs ${
                  step.id === currentStep
                    ? 'text-primary font-medium'
                    : step.id < currentStep
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/50'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / 6) * 100} className="h-2" />
        </div>

        <div className="flex-1 overflow-y-auto px-1">{renderStep()}</div>

        <div className="flex justify-between pt-4 border-t mt-4">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {currentStep < 6 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={!canProceed()}>
              <Rocket className="h-4 w-4 mr-2" />
              Start Bulk Creation
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkCreationWizard;
