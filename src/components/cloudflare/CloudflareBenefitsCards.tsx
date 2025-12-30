
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, Zap } from 'lucide-react';

const CloudflareBenefitsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Security</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            DDoS protection, SSL/TLS encryption, and WAF security
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold">Performance</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Global CDN, caching, and speed optimizations
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">SEO Boost</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Improved Core Web Vitals and search rankings
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CloudflareBenefitsCards;
