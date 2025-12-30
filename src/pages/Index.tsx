
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardRouter from '@/components/dashboard/DashboardRouter';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useWebsiteData } from '@/hooks/useWebsiteData';

const Index = () => {
  const { websites, addWebsite } = useWebsiteData();
  const {
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
    bulkActions
  } = useDashboardState(websites);

  return (
    <DashboardLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      showResultsModal={showResultsModal}
      onShowResultsModalChange={setShowResultsModal}
      results={results}
      currentOperationType={currentOperationType}
      deleteWebsiteId={deleteWebsiteId}
      onDeleteWebsiteIdChange={setDeleteWebsiteId}
      websites={websites}
      onConfirmDeleteWebsite={confirmDeleteWebsite}
    >
      <DashboardRouter
        activeSection={activeSection}
        websites={websites}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showBulkActions={showBulkActions}
        onToggleBulkActions={handleToggleBulkActions}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        selectedWebsites={selectedWebsites}
        onDeleteWebsite={handleDeleteWebsite}
        onToggleSelection={toggleSelection}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        isProcessing={isProcessing}
        onBulkOperation={handleBulkOperation}
        onSectionChange={setActiveSection}
        bulkActions={bulkActions}
        onWebsiteCreated={addWebsite}
      />
    </DashboardLayout>
  );
};

export default Index;
