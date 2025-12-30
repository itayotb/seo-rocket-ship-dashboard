import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wand2, ChevronDown, Globe, Layers } from 'lucide-react';
import WebsiteCreationWizard from '@/components/website-creation/WebsiteCreationWizard';
import BulkCreationWizard from '@/components/bulk-creation/BulkCreationWizard';
import { CreatedWebsite, Template } from '@/types/websiteCreation';
import { LeadForm } from '@/types/leadForm';
import { BulkCreationData } from '@/types/bulkWebsiteCreation';

interface CreateWebsiteButtonProps {
  onWebsiteCreated?: (website: CreatedWebsite) => void;
  onNavigateToDomains?: () => void;
  leadForms?: LeadForm[];
  templates?: Template[];
  onBulkCreate?: (data: BulkCreationData) => void;
}

const CreateWebsiteButton = ({ 
  onWebsiteCreated, 
  onNavigateToDomains, 
  leadForms = [],
  templates = [],
  onBulkCreate
}: CreateWebsiteButtonProps) => {
  const [showWizard, setShowWizard] = useState(false);
  const [showBulkWizard, setShowBulkWizard] = useState(false);

  const handleWebsiteCreated = (website: CreatedWebsite) => {
    onWebsiteCreated?.(website);
    console.log('Website created:', website);
  };

  const handleBulkComplete = (data: BulkCreationData) => {
    onBulkCreate?.(data);
    console.log('Bulk creation started:', data);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center space-x-2">
            <Wand2 className="h-4 w-4" />
            <span>Create Website</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowWizard(true)}>
            <Globe className="h-4 w-4 mr-2" />
            Single Website
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowBulkWizard(true)}>
            <Layers className="h-4 w-4 mr-2" />
            Bulk Create
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WebsiteCreationWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onComplete={handleWebsiteCreated}
        onNavigateToDomains={onNavigateToDomains}
        leadForms={leadForms}
      />

      <BulkCreationWizard
        open={showBulkWizard}
        onOpenChange={setShowBulkWizard}
        templates={templates}
        leadForms={leadForms}
        onComplete={handleBulkComplete}
      />
    </>
  );
};

export default CreateWebsiteButton;
