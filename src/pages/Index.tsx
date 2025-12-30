
import React, { useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardRouter from '@/components/dashboard/DashboardRouter';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useWebsiteData } from '@/hooks/useWebsiteData';
import { useLeadForms } from '@/hooks/useLeadForms';

const Index = () => {
  const { websites, addWebsite, bulkUpdateLeadForm } = useWebsiteData();
  const { leadForms, addLeadForm, updateLeadForm, deleteLeadForm } = useLeadForms();
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
    masterCategoryFilter,
    setMasterCategoryFilter,
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

  // Filter websites by master category
  const filteredWebsites = useMemo(() => {
    if (masterCategoryFilter === 'all') return websites;
    return websites.filter(website => website.category === masterCategoryFilter);
  }, [websites, masterCategoryFilter]);

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
      masterCategoryFilter={masterCategoryFilter}
      onMasterCategoryFilterChange={setMasterCategoryFilter}
    >
      <DashboardRouter
        activeSection={activeSection}
        websites={filteredWebsites}
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
        masterCategoryFilter={masterCategoryFilter}
        leadForms={leadForms}
        onAddLeadForm={addLeadForm}
        onUpdateLeadForm={updateLeadForm}
        onDeleteLeadForm={deleteLeadForm}
        onBulkLeadFormChange={bulkUpdateLeadForm}
      />
    </DashboardLayout>
  );
};

export default Index;

