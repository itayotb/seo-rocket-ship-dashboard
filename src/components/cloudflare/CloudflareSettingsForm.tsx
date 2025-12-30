
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { CloudflareSettings, CloudflareConnectionStatus } from '@/types/cloudflare';
import { Loader2 } from 'lucide-react';

interface CloudflareSettingsFormProps {
  settings: CloudflareSettings;
  connectionStatus: CloudflareConnectionStatus;
  isLoading: boolean;
  onSaveSettings: (data: CloudflareSettings) => Promise<{ success: boolean; error?: string }>;
  onTestConnection: () => Promise<boolean>;
  onClearSettings: () => void;
}

const CloudflareSettingsForm = ({
  settings,
  connectionStatus,
  isLoading,
  onSaveSettings,
  onTestConnection,
  onClearSettings
}: CloudflareSettingsFormProps) => {
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CloudflareSettings>({
    defaultValues: settings
  });

  React.useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const onSubmit = async (data: CloudflareSettings) => {
    const result = await onSaveSettings(data);
    
    if (result.success) {
      toast({
        title: "Settings Saved",
        description: "Your Cloudflare settings have been saved successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    const isConnected = await onTestConnection();
    
    if (isConnected) {
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Cloudflare API.",
      });
    } else {
      toast({
        title: "Connection Failed",
        description: connectionStatus.error || "Failed to connect to Cloudflare API",
        variant: "destructive",
      });
    }
  };

  const handleClearSettings = () => {
    onClearSettings();
    reset({
      apiToken: '',
      email: ''
    });
    toast({
      title: "Settings Cleared",
      description: "All Cloudflare settings have been cleared.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Enter your Cloudflare API credentials to enable integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              placeholder="your-email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiToken">API Token</Label>
            <Input
              id="apiToken"
              type="password"
              {...register('apiToken', { required: 'API Token is required' })}
              placeholder="Your Cloudflare API Token"
            />
            {errors.apiToken && (
              <p className="text-sm text-red-600">{errors.apiToken.message}</p>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isLoading || !settings.apiToken || !settings.email}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Test Connection'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleClearSettings}
              disabled={isLoading}
            >
              Clear
            </Button>
          </div>
        </form>

        {connectionStatus.lastChecked && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last checked: {connectionStatus.lastChecked.toLocaleString()}
            </p>
            {connectionStatus.error && (
              <p className="text-sm text-red-600 mt-1">{connectionStatus.error}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CloudflareSettingsForm;
