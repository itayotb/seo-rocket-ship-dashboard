import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardContent from '@/components/dashboard/DashboardContent';
import TemplateGallery from '@/components/templates/TemplateGallery';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import CloudflareSettings from '@/components/cloudflare/CloudflareSettings';
import DomainsManagement from '@/components/domains/DomainsManagement';
import ReportsDashboard from '@/components/reports/ReportsDashboard';
import LeadFormsManagement from '@/components/leadforms/LeadFormsManagement';
import CredentialsManagement from '@/components/credentials/CredentialsManagement';
import PermissionsManagement from '@/components/permissions/PermissionsManagement';
import KeywordResearchDashboard from '@/components/keyword-research/KeywordResearchDashboard';
import BulkJobsDashboard from '@/components/bulk-creation/BulkJobsDashboard';
import CreateWebsiteButton from '@/components/dashboard/CreateWebsiteButton';
import { 
  ToolsPlaceholder, 
  SettingsPlaceholder 
} from '@/components/dashboard/PlaceholderSections';
import { Website } from '@/types/website';
import { CreatedWebsite, Template } from '@/types/websiteCreation';
import { LeadForm } from '@/types/leadForm';
import { Credential } from '@/types/credential';
import { AppUser, UserRole, RolePermission } from '@/types/permission';
import { BulkCreationJob, BulkCreationData } from '@/types/bulkWebsiteCreation';

interface DashboardRouterProps {
  activeSection: string;
  websites: Website[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  showBulkActions: boolean;
  onToggleBulkActions: () => void;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  selectedWebsites: string[];
  onDeleteWebsite: (websiteId: string) => void;
  onToggleSelection: (websiteId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  isProcessing: boolean;
  onBulkOperation: (operation: () => Promise<void>, operationType: string) => void;
  onSectionChange: (section: string) => void;
  onWebsiteCreated: (website: CreatedWebsite) => void;
  masterCategoryFilter: string;
  leadForms: LeadForm[];
  templates: Template[];
  onAddLeadForm: (name: string, code: string, category: string, templateId?: string) => void;
  onUpdateLeadForm: (id: string, name: string, code: string, category: string, templateId?: string) => void;
  onDeleteLeadForm: (id: string) => void;
  onBulkLeadFormChange: (websiteIds: string[], leadFormId: string | undefined) => void;
  credentials: Credential[];
  onAddCredential: (name: string, username: string, password: string, apiKey: string, category: string) => void;
  onUpdateCredential: (id: string, name: string, username: string, password: string, apiKey: string, category: string) => void;
  onDeleteCredential: (id: string) => void;
  // Permissions props
  users: AppUser[];
  rolePermissions: RolePermission[];
  onAddUser: (email: string, fullName: string, role: UserRole) => void;
  onUpdateUser: (id: string, data: Partial<Omit<AppUser, 'id' | 'createdAt'>>) => void;
  onDeleteUser: (id: string) => void;
  bulkActions: {
    checkAllParameters: (websites: Website[]) => Promise<void>;
    bulkKeywordUpdate: (websites: Website[]) => Promise<void>;
    bulkPlagiarismScan: (websites: Website[]) => Promise<void>;
    bulkSpeedTest: (websites: Website[]) => Promise<void>;
    bulkSeoAnalysis: (websites: Website[]) => Promise<void>;
    bulkStatusCheck: (websites: Website[]) => Promise<void>;
  };
  // Bulk creation props
  bulkJobs: BulkCreationJob[];
  onBulkCreate: (data: BulkCreationData) => void;
  onPauseBulkJob: (jobId: string) => void;
  onResumeBulkJob: (jobId: string) => void;
  onCancelBulkJob: (jobId: string) => void;
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({
  activeSection,
  websites,
  viewMode,
  onViewModeChange,
  showBulkActions,
  onToggleBulkActions,
  timeframe,
  onTimeframeChange,
  selectedWebsites,
  onDeleteWebsite,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  isProcessing,
  onBulkOperation,
  onSectionChange,
  onWebsiteCreated,
  masterCategoryFilter,
  leadForms,
  templates,
  onAddLeadForm,
  onUpdateLeadForm,
  onDeleteLeadForm,
  onBulkLeadFormChange,
  credentials,
  onAddCredential,
  onUpdateCredential,
  onDeleteCredential,
  users,
  rolePermissions,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  bulkActions,
  bulkJobs,
  onBulkCreate,
  onPauseBulkJob,
  onResumeBulkJob,
  onCancelBulkJob
}) => {
  const navigate = useNavigate();

  const handleViewDetails = (websiteId: string) => {
    console.log('Viewing details for website:', websiteId);
    navigate(`/website/${websiteId}`);
  };

  const handleToggleStatus = (websiteId: string, status: boolean) => {
    console.log('Toggling status for website:', websiteId, 'to:', status ? 'active' : 'inactive');
  };

  const handleNavigateToDomains = () => {
    onSectionChange('domains');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'templates':
        return <TemplateGallery masterCategoryFilter={masterCategoryFilter} />;
      case 'leadforms':
        return (
          <LeadFormsManagement
            leadForms={leadForms}
            masterCategoryFilter={masterCategoryFilter}
            templates={templates}
            onAddLeadForm={onAddLeadForm}
            onUpdateLeadForm={onUpdateLeadForm}
            onDeleteLeadForm={onDeleteLeadForm}
          />
        );
      case 'credentials':
        return (
          <CredentialsManagement
            credentials={credentials}
            masterCategoryFilter={masterCategoryFilter}
            onAddCredential={onAddCredential}
            onUpdateCredential={onUpdateCredential}
            onDeleteCredential={onDeleteCredential}
          />
        );
      case 'websites':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Websites</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Manage your websites and create new ones
                </p>
              </div>
              <CreateWebsiteButton 
                onNavigateToDomains={handleNavigateToDomains}
                onWebsiteCreated={onWebsiteCreated}
                leadForms={leadForms}
                templates={templates}
                onBulkCreate={onBulkCreate}
              />
            </div>
            <DashboardContent
              websites={websites}
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              showBulkActions={showBulkActions}
              onToggleBulkActions={onToggleBulkActions}
              timeframe={timeframe}
              onTimeframeChange={onTimeframeChange}
              selectedWebsites={selectedWebsites}
              onViewDetails={handleViewDetails}
              onToggleStatus={handleToggleStatus}
              onDeleteWebsite={onDeleteWebsite}
              onToggleSelection={onToggleSelection}
              onSelectAll={onSelectAll}
              onClearSelection={onClearSelection}
              isProcessing={isProcessing}
              onBulkOperation={onBulkOperation}
              leadForms={leadForms}
              onBulkLeadFormChange={onBulkLeadFormChange}
              bulkActions={bulkActions}
            />
          </div>
        );
      case 'domains':
        return <DomainsManagement masterCategoryFilter={masterCategoryFilter} />;
      case 'analytics':
        return <AnalyticsDashboard masterCategoryFilter={masterCategoryFilter} />;
      case 'reports':
        return <ReportsDashboard masterCategoryFilter={masterCategoryFilter} />;
      case 'cloudflare':
        return <CloudflareSettings />;
      case 'permissions':
        return (
          <PermissionsManagement
            users={users}
            rolePermissions={rolePermissions}
            onAddUser={onAddUser}
            onUpdateUser={onUpdateUser}
            onDeleteUser={onDeleteUser}
          />
        );
      case 'keyword-research':
        return (
          <KeywordResearchDashboard 
            leadForms={leadForms}
            onBulkCreate={onBulkCreate}
          />
        );
      case 'bulk-jobs':
        return (
          <BulkJobsDashboard
            jobs={bulkJobs}
            onPause={onPauseBulkJob}
            onResume={onResumeBulkJob}
            onCancel={onCancelBulkJob}
          />
        );
      case 'tools':
        return <ToolsPlaceholder />;
      case 'settings':
        return <SettingsPlaceholder />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Overview of your SEO automation platform
                </p>
              </div>
              <CreateWebsiteButton 
                onNavigateToDomains={handleNavigateToDomains}
                onWebsiteCreated={onWebsiteCreated}
                leadForms={leadForms}
                templates={templates}
                onBulkCreate={onBulkCreate}
              />
            </div>
            <DashboardContent
              websites={websites}
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              showBulkActions={showBulkActions}
              onToggleBulkActions={onToggleBulkActions}
              timeframe={timeframe}
              onTimeframeChange={onTimeframeChange}
              selectedWebsites={selectedWebsites}
              onViewDetails={handleViewDetails}
              onToggleStatus={handleToggleStatus}
              onDeleteWebsite={onDeleteWebsite}
              onToggleSelection={onToggleSelection}
              onSelectAll={onSelectAll}
              onClearSelection={onClearSelection}
              isProcessing={isProcessing}
              onBulkOperation={onBulkOperation}
              leadForms={leadForms}
              onBulkLeadFormChange={onBulkLeadFormChange}
              bulkActions={bulkActions}
            />
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default DashboardRouter;
