
import React, { useState } from 'react';
import { Website } from '@/types/website';
import { LeadForm } from '@/types/leadForm';
import StatsOverview from '@/components/dashboard/StatsOverview';
import WebsiteCard from '@/components/dashboard/WebsiteCard';
import WebsiteTable from '@/components/dashboard/WebsiteTable';
import BulkActionsToolbar from '@/components/dashboard/BulkActionsToolbar';
import BulkLeadFormDialog from '@/components/dashboard/BulkLeadFormDialog';
import WebsiteTimeframePicker from '@/components/dashboard/WebsiteTimeframePicker';
import DashboardViewControls from '@/components/dashboard/DashboardViewControls';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface DashboardContentProps {
  websites: Website[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  showBulkActions: boolean;
  onToggleBulkActions: () => void;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  selectedWebsites: string[];
  onViewDetails: (websiteId: string) => void;
  onToggleStatus: (websiteId: string, status: boolean) => void;
  onDeleteWebsite: (websiteId: string) => void;
  onToggleSelection: (websiteId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  isProcessing: boolean;
  onBulkOperation: (operation: () => Promise<void>, operationType: string) => void;
  leadForms: LeadForm[];
  onBulkLeadFormChange: (websiteIds: string[], leadFormId: string | undefined) => void;
  bulkActions: {
    checkAllParameters: (websites: Website[]) => Promise<void>;
    bulkKeywordUpdate: (websites: Website[]) => Promise<void>;
    bulkPlagiarismScan: (websites: Website[]) => Promise<void>;
    bulkSpeedTest: (websites: Website[]) => Promise<void>;
    bulkSeoAnalysis: (websites: Website[]) => Promise<void>;
    bulkStatusCheck: (websites: Website[]) => Promise<void>;
  };
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  websites,
  viewMode,
  onViewModeChange,
  showBulkActions,
  onToggleBulkActions,
  timeframe,
  onTimeframeChange,
  selectedWebsites,
  onViewDetails,
  onToggleStatus,
  onDeleteWebsite,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  isProcessing,
  onBulkOperation,
  leadForms,
  onBulkLeadFormChange,
  bulkActions
}) => {
  const [showLeadFormDialog, setShowLeadFormDialog] = useState(false);

  const handleBulkLeadFormApply = (leadFormId: string | undefined) => {
    onBulkLeadFormChange(selectedWebsites, leadFormId);
  };

  return (
    <div className="space-y-6">
      <StatsOverview />
      
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Websites</h3>
        <div className="flex items-center space-x-4">
          <WebsiteTimeframePicker 
            timeframe={timeframe} 
            onTimeframeChange={onTimeframeChange} 
          />
          
          <Button
            variant={showBulkActions ? "default" : "outline"}
            size="sm"
            onClick={onToggleBulkActions}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showBulkActions ? 'Exit Bulk Mode' : 'Bulk Actions'}
          </Button>
          
          <DashboardViewControls 
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>
      </div>

      {showBulkActions && (
        <BulkActionsToolbar
          selectedCount={selectedWebsites.length}
          onClearSelection={onClearSelection}
          onCheckAllParameters={() => onBulkOperation(() => bulkActions.checkAllParameters(websites), 'Complete Parameter Check')}
          onBulkKeywordUpdate={() => onBulkOperation(() => bulkActions.bulkKeywordUpdate(websites), 'AI Keyword Update')}
          onBulkPlagiarismScan={() => onBulkOperation(() => bulkActions.bulkPlagiarismScan(websites), 'Plagiarism Scan')}
          onBulkSpeedTest={() => onBulkOperation(() => bulkActions.bulkSpeedTest(websites), 'Speed Test')}
          onBulkSeoAnalysis={() => onBulkOperation(() => bulkActions.bulkSeoAnalysis(websites), 'SEO Analysis')}
          onBulkStatusCheck={() => onBulkOperation(() => bulkActions.bulkStatusCheck(websites), 'Status Check')}
          onBulkLeadFormChange={() => setShowLeadFormDialog(true)}
          isProcessing={isProcessing}
        />
      )}
      
      {viewMode === 'list' ? (
        <WebsiteTable
          websites={websites}
          onViewDetails={onViewDetails}
          onToggleStatus={onToggleStatus}
          onDeleteWebsite={onDeleteWebsite}
          showBulkActions={showBulkActions}
          selectedWebsites={selectedWebsites}
          onToggleSelection={onToggleSelection}
          onSelectAll={onSelectAll}
          onClearSelection={onClearSelection}
        />
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {websites.map((website) => (
            <WebsiteCard
              key={website.id}
              website={{
                ...website,
                pageSpeed: website.desktopSpeed,
                ranking: website.googlePosition,
                plagiarismScore: website.uniqueContent,
                totalClicks: website.totalClicks
              }}
              onViewDetails={onViewDetails}
              onDeleteWebsite={onDeleteWebsite}
            />
          ))}
        </div>
      )}

      <BulkLeadFormDialog
        isOpen={showLeadFormDialog}
        onClose={() => setShowLeadFormDialog(false)}
        selectedCount={selectedWebsites.length}
        leadForms={leadForms}
        onApply={handleBulkLeadFormApply}
      />
    </div>
  );
};

export default DashboardContent;
