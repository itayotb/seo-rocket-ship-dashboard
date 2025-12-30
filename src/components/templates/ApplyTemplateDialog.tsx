
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { Template } from './TemplateGallery';

interface ApplyTemplateDialogProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (templateId: string, domainId: string) => void;
}

const ApplyTemplateDialog = ({ template, isOpen, onClose, onApply }: ApplyTemplateDialogProps) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);

  // Mock domains - in a real app, this would come from an API
  const domains = [
    { id: '1', name: 'TechCorp Solutions', domain: 'techcorp.com', status: 'active' },
    { id: '2', name: 'Green Earth Blog', domain: 'greenearthblog.com', status: 'active' },
    { id: '3', name: 'Fitness Pro', domain: 'fitnesspro.net', status: 'inactive' },
    { id: '4', name: 'Local Bakery', domain: 'localbakery.co', status: 'active' }
  ];

  const handleApply = async () => {
    if (!template || !selectedDomain) return;

    setIsApplying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onApply(template.id, selectedDomain);
    setIsApplying(false);
    setSelectedDomain('');
  };

  const selectedDomainData = domains.find(d => d.id === selectedDomain);

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={template.preview} 
                  alt={template.name}
                  className="w-16 h-12 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500">{template.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Domain
            </label>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a domain to apply this template to" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain.id} value={domain.id}>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>{domain.domain}</span>
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        domain.status === 'active' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {domain.status}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDomainData && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-700">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium">Important:</p>
                  <p>Applying this template will replace the current design of <strong>{selectedDomainData.domain}</strong>. This action cannot be undone.</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button 
              onClick={handleApply}
              disabled={!selectedDomain || isApplying}
              className="flex-1"
            >
              {isApplying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Applying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply Template
                </>
              )}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyTemplateDialog;
