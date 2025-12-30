
import { useState } from 'react';
import { useBulkActions } from '@/hooks/useBulkActions';
import { useToast } from '@/hooks/use-toast';
import { Website } from '@/types/website';

export const useDashboardState = (websites: Website[]) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [currentOperationType, setCurrentOperationType] = useState('');
  const [timeframe, setTimeframe] = useState('28days');
  const [deleteWebsiteId, setDeleteWebsiteId] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    selectedWebsites,
    isProcessing,
    results,
    toggleSelection,
    selectAll: bulkSelectAll,
    clearSelection,
    checkAllParameters,
    bulkKeywordUpdate,
    bulkPlagiarismScan,
    bulkSpeedTest,
    bulkSeoAnalysis,
    bulkStatusCheck
  } = useBulkActions();

  const handleToggleBulkActions = () => {
    // Calculate the new state value before using it
    const newShowBulkActions = !showBulkActions;
    setShowBulkActions(newShowBulkActions);
    
    // Use the calculated value instead of the potentially stale state
    if (!newShowBulkActions) {
      clearSelection();
    }
  };

  // Wrapper for selectAll that uses websites from the hook parameter
  const selectAll = () => {
    bulkSelectAll(websites);
  };

  const handleDeleteWebsite = (websiteId: string) => {
    setDeleteWebsiteId(websiteId);
  };

  const confirmDeleteWebsite = (): void => {
    if (deleteWebsiteId) {
      toast({
        title: "Website Deleted",
        description: `Website has been successfully deleted.`,
      });
      setDeleteWebsiteId(null);
    }
  };

  const handleBulkOperation = async (operation: () => Promise<void>, operationType: string) => {
    setCurrentOperationType(operationType);
    await operation();
    setShowResultsModal(true);
  };

  return {
    activeSection,
    setActiveSection,
    viewMode,
    setViewMode,
    showBulkActions,
    handleToggleBulkActions,
    showResultsModal,
    setShowResultsModal,
    currentOperationType,
    timeframe,
    setTimeframe,
    deleteWebsiteId,
    setDeleteWebsiteId,
    selectedWebsites,
    isProcessing,
    results,
    toggleSelection,
    selectAll,
    clearSelection,
    handleDeleteWebsite,
    confirmDeleteWebsite,
    handleBulkOperation,
    bulkActions: {
      checkAllParameters,
      bulkKeywordUpdate,
      bulkPlagiarismScan,
      bulkSpeedTest,
      bulkSeoAnalysis,
      bulkStatusCheck
    }
  };
};
