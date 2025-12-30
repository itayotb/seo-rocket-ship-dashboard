
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import WebsiteCreationWizard from '@/components/website-creation/WebsiteCreationWizard';
import { CreatedWebsite } from '@/types/websiteCreation';
import { LeadForm } from '@/types/leadForm';

interface CreateWebsiteButtonProps {
  onWebsiteCreated?: (website: CreatedWebsite) => void;
  onNavigateToDomains?: () => void;
  leadForms?: LeadForm[];
}

const CreateWebsiteButton = ({ onWebsiteCreated, onNavigateToDomains, leadForms = [] }: CreateWebsiteButtonProps) => {
  const [showWizard, setShowWizard] = useState(false);

  const handleWebsiteCreated = (website: CreatedWebsite) => {
    onWebsiteCreated?.(website);
    console.log('Website created:', website);
  };

  return (
    <>
      <Button 
        onClick={() => setShowWizard(true)}
        className="flex items-center space-x-2"
      >
        <Wand2 className="h-4 w-4" />
        <span>Create Website</span>
      </Button>

      <WebsiteCreationWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onComplete={handleWebsiteCreated}
        onNavigateToDomains={onNavigateToDomains}
        leadForms={leadForms}
      />
    </>
  );
};

export default CreateWebsiteButton;
