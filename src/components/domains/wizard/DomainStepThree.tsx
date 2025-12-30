
import React from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Copy, AlertCircle, ExternalLink, Clock, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DomainStepThreeProps {
  nameservers: string[];
}

const DomainStepThree = ({ nameservers }: DomainStepThreeProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Nameserver copied to clipboard.",
    });
  };

  const copyAllNameservers = () => {
    const allNameservers = nameservers.join('\n');
    navigator.clipboard.writeText(allNameservers);
    toast({
      title: "Copied!",
      description: "All nameservers copied to clipboard.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-blue-900 dark:text-blue-100">
            Your Cloudflare Nameservers
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={copyAllNameservers}
            className="text-xs"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy All
          </Button>
        </div>
        <div className="space-y-2">
          {nameservers.map((nameserver, index) => (
            <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border">
              <code className="text-sm font-mono">{nameserver}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(nameserver)}
                className="h-auto p-1"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-1">
              Update Your DNS Settings
            </h4>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Copy these nameservers and update them at your domain registrar. Changes take 24-48 hours to propagate.
            </p>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="instructions">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4" />
              <span>Step-by-step instructions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Log into your domain registrar</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Go to where you purchased your domain (GoDaddy, Namecheap, etc.)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Find DNS settings</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Look for "DNS Management" or "Nameservers"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Use custom nameservers</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Select "Custom nameservers" option
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Replace nameservers</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Remove existing ones and add the Cloudflare nameservers above
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="timing">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Propagation timing</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-sm space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                DNS changes can take anywhere from a few minutes to 48 hours to propagate globally. 
                Most changes are visible within 2-4 hours.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="help">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>Popular registrar links</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'GoDaddy', url: 'https://dcc.godaddy.com/manage/dns' },
                { name: 'Namecheap', url: 'https://ap.www.namecheap.com/domains/list/' },
                { name: 'Google Domains', url: 'https://domains.google.com/registrar' },
                { name: 'Cloudflare', url: 'https://dash.cloudflare.com/registrar' }
              ].map((registrar) => (
                <a
                  key={registrar.name}
                  href={registrar.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  {registrar.name}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DomainStepThree;
