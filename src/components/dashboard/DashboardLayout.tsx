
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BulkResultsModal from '@/components/dashboard/BulkResultsModal';
import DeleteWebsiteDialog from '@/components/dashboard/DeleteWebsiteDialog';
import { Website } from '@/types/website';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  showResultsModal: boolean;
  onShowResultsModalChange: (show: boolean) => void;
  results: any[];
  currentOperationType: string;
  deleteWebsiteId: string | null;
  onDeleteWebsiteIdChange: (id: string | null) => void;
  websites: Website[];
  onConfirmDeleteWebsite: () => void;
  masterCategoryFilter: string;
  onMasterCategoryFilterChange: (category: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  showResultsModal,
  onShowResultsModalChange,
  results,
  currentOperationType,
  deleteWebsiteId,
  onDeleteWebsiteIdChange,
  websites,
  onConfirmDeleteWebsite,
  masterCategoryFilter,
  onMasterCategoryFilterChange
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row w-full">
      <Navigation activeSection={activeSection} onSectionChange={onSectionChange} />
      
      <div className="flex-1 flex flex-col">
        {/* Desktop Header - Hidden on mobile since mobile has its own header in Navigation */}
        <div className="hidden md:block">
          <DashboardHeader 
            masterCategoryFilter={masterCategoryFilter}
            onMasterCategoryFilterChange={onMasterCategoryFilterChange}
          />
        </div>
        
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

      <BulkResultsModal
        open={showResultsModal}
        onOpenChange={onShowResultsModalChange}
        results={results}
        operationType={currentOperationType}
      />

      <DeleteWebsiteDialog
        open={!!deleteWebsiteId}
        onOpenChange={(open) => !open && onDeleteWebsiteIdChange(null)}
        onConfirm={onConfirmDeleteWebsite}
        websiteName={websites.find(w => w.id === deleteWebsiteId)?.name || ''}
      />
    </div>
  );
};

export default DashboardLayout;
