
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface DomainStepFourProps {
  domainName: string;
}

const DomainStepFour = ({ domainName }: DomainStepFourProps) => {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <h3 className="text-lg font-medium">Domain Added Successfully!</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {domainName} has been added to your domains list.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Don't forget to update your nameservers at your domain registrar.
        </p>
      </div>
    </div>
  );
};

export default DomainStepFour;
