
import React from 'react';
import { useCloudflareSettings } from '@/hooks/useCloudflareSettings';
import CloudflareHeader from './CloudflareHeader';
import CloudflareBenefitsCards from './CloudflareBenefitsCards';
import CloudflareSettingsForm from './CloudflareSettingsForm';
import CloudflareInstructions from './CloudflareInstructions';
import CloudflareAccountsList from './CloudflareAccountsList';

const CloudflareSettings = () => {
  const { settings, connectionStatus, isLoading, saveSettings, checkConnection, clearSettings } = useCloudflareSettings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <CloudflareHeader connectionStatus={connectionStatus} />

      {/* Benefits Cards */}
      <CloudflareBenefitsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Form */}
        <CloudflareSettingsForm
          settings={settings}
          connectionStatus={connectionStatus}
          isLoading={isLoading}
          onSaveSettings={saveSettings}
          onTestConnection={checkConnection}
          onClearSettings={clearSettings}
        />

        {/* Instructions */}
        <CloudflareInstructions />
      </div>

      {/* Accounts List */}
      {connectionStatus.isConnected && connectionStatus.accounts && (
        <CloudflareAccountsList accounts={connectionStatus.accounts} />
      )}
    </div>
  );
};

export default CloudflareSettings;
