
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Key, Globe, Shield, Zap } from 'lucide-react';

const CloudflareInstructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Setup Instructions</span>
        </CardTitle>
        <CardDescription>
          Follow these steps to get your Cloudflare API credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">1</Badge>
            <h4 className="font-semibold">Get Your API Token</h4>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 ml-8">
            <li>Go to the Cloudflare dashboard</li>
            <li>Click on "My Profile" → "API Tokens"</li>
            <li>Click "Create Token"</li>
            <li>Use the "Custom token" template</li>
            <li>Set permissions: Zone:Read, Zone Settings:Edit, Zone.Zone:Read</li>
            <li>Include all zones or specify your domain</li>
          </ol>
          <a 
            href="https://dash.cloudflare.com/profile/api-tokens" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Open Cloudflare API Tokens
          </a>
        </div>

        {/* Step 2 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">2</Badge>
            <h4 className="font-semibold">Find Your Zone ID</h4>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 ml-8">
            <li>In your Cloudflare dashboard, select your domain</li>
            <li>Scroll down to the "API" section on the overview page</li>
            <li>Copy the "Zone ID"</li>
          </ol>
        </div>

        {/* Step 3 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">3</Badge>
            <h4 className="font-semibold">Account Information</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
            Your email address should be the one associated with your Cloudflare account. 
            The Account ID is optional but can be found in the right sidebar of your dashboard.
          </p>
        </div>

        {/* Benefits */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Zap className="h-4 w-4 mr-2 text-yellow-500" />
            What You'll Get
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Enhanced security and DDoS protection</span>
            </li>
            <li className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Improved website performance and loading times</span>
            </li>
            <li className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-green-500" />
              <span>Better SEO rankings through Core Web Vitals optimization</span>
            </li>
          </ul>
        </div>

        {/* Security Note */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h5 className="font-semibold text-amber-800 dark:text-amber-200">Security Note</h5>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your API credentials are stored securely in your browser's local storage and are never sent to our servers. 
                For production use, consider using environment variables or a secure backend integration.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CloudflareInstructions;
