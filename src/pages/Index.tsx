import React, { useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardRouter from '@/components/dashboard/DashboardRouter';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useWebsiteData } from '@/hooks/useWebsiteData';
import { useLeadForms } from '@/hooks/useLeadForms';
import { useCredentials } from '@/hooks/useCredentials';
import { usePermissions } from '@/hooks/usePermissions';
import { useBulkCreation } from '@/hooks/useBulkCreation';
import { ALL_TEMPLATES } from '@/utils/templates';

const Index = () => {
  const { websites, addWebsite, bulkUpdateLeadForm } = useWebsiteData();
  const { leadForms, addLeadForm, updateLeadForm, deleteLeadForm, getLeadFormByTemplateId } = useLeadForms();
  const { credentials, addCredential, updateCredential, deleteCredential } = useCredentials();
  const { users, rolePermissions, addUser, updateUser, deleteUser } = usePermissions();
  const { jobs, currentData, createJob, startJob, pauseJob, resumeJob, cancelJob } = useBulkCreation();
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

  const handleBulkCreate = async (data: any) => {
    const job = await createJob();
    startJob(job.id);
  };

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
        templates={ALL_TEMPLATES}
        onAddLeadForm={addLeadForm}
        onUpdateLeadForm={updateLeadForm}
        onDeleteLeadForm={deleteLeadForm}
        onBulkLeadFormChange={bulkUpdateLeadForm}
        credentials={credentials}
        onAddCredential={addCredential}
        onUpdateCredential={updateCredential}
        onDeleteCredential={deleteCredential}
        users={users}
        rolePermissions={rolePermissions}
        onAddUser={addUser}
        onUpdateUser={updateUser}
        onDeleteUser={deleteUser}
        bulkJobs={jobs}
        onBulkCreate={handleBulkCreate}
        onPauseBulkJob={pauseJob}
        onResumeBulkJob={resumeJob}
        onCancelBulkJob={cancelJob}
      />
    </DashboardLayout>
  );
};

export default Index;

