
import { useState, useEffect } from 'react';
import { CloudflareSettings, CloudflareConnectionStatus, CloudflareAccount } from '@/types/cloudflare';

export const useCloudflareSettings = () => {
  const [settings, setSettings] = useState<CloudflareSettings>({
    apiToken: '',
    email: ''
  });
  
  const [connectionStatus, setConnectionStatus] = useState<CloudflareConnectionStatus>({
    isConnected: false
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('cloudflare-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        // Check connection status if we have saved settings
        if (parsed.apiToken && parsed.email) {
          checkConnection(parsed);
        }
      } catch (error) {
        console.error('Failed to parse saved Cloudflare settings:', error);
      }
    }
  }, []);

  const saveSettings = async (newSettings: CloudflareSettings) => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('cloudflare-settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Test connection and fetch accounts
      await checkConnection(newSettings);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to save Cloudflare settings:', error);
      return { success: false, error: 'Failed to save settings' };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccounts = async (settingsToTest: CloudflareSettings): Promise<CloudflareAccount[]> => {
    // Simulate API call to fetch Cloudflare accounts
    // In a real implementation, this would make an actual API call to Cloudflare
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock accounts data
    const mockAccounts: CloudflareAccount[] = [
      {
        id: 'acc_123456789',
        name: 'Personal Account',
        type: 'standard',
        status: 'active',
        createdOn: '2023-01-15T10:30:00Z'
      },
      {
        id: 'acc_987654321',
        name: 'Business Account',
        type: 'enterprise',
        status: 'active',
        createdOn: '2022-06-20T14:45:00Z'
      }
    ];
    
    return mockAccounts;
  };

  const checkConnection = async (settingsToTest?: CloudflareSettings) => {
    const testSettings = settingsToTest || settings;
    
    if (!testSettings.apiToken || !testSettings.email) {
      setConnectionStatus({
        isConnected: false,
        error: 'API token and email are required'
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Simulate API call to Cloudflare
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch accounts if connection is successful
      const accounts = await fetchAccounts(testSettings);
      
      setConnectionStatus({
        isConnected: true,
        lastChecked: new Date(),
        accounts
      });
      
      return true;
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        lastChecked: new Date(),
        error: 'Failed to connect to Cloudflare API'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSettings = () => {
    localStorage.removeItem('cloudflare-settings');
    setSettings({
      apiToken: '',
      email: ''
    });
    setConnectionStatus({
      isConnected: false
    });
  };

  return {
    settings,
    connectionStatus,
    isLoading,
    saveSettings,
    checkConnection,
    clearSettings
  };
};
