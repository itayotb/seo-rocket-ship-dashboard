
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Download } from 'lucide-react';
import { BulkOperationResult } from '@/hooks/useBulkActions';

interface BulkResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: BulkOperationResult[];
  operationType: string;
}

const BulkResultsModal: React.FC<BulkResultsModalProps> = ({
  open,
  onOpenChange,
  results,
  operationType
}) => {
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  const exportResults = () => {
    const csvContent = [
      ['Website', 'Status', 'Result', 'Error'].join(','),
      ...results.map(result => [
        result.websiteName,
        result.status,
        result.result ? JSON.stringify(result.result) : '',
        result.error || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-${operationType.toLowerCase().replace(' ', '-')}-results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{operationType} Results</span>
            <Badge variant={errorCount === 0 ? 'default' : 'secondary'}>
              {successCount}/{results.length} successful
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Bulk operation completed. Review the results below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {successCount > 0 && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                {successCount} Success
              </Badge>
            )}
            {errorCount > 0 && (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                {errorCount} Errors
              </Badge>
            )}
          </div>
          
          <Button onClick={exportResults} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.websiteId}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {result.status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <div className="font-medium">{result.websiteName}</div>
                  {result.error && (
                    <div className="text-sm text-red-600">{result.error}</div>
                  )}
                  {result.result && (
                    <div className="text-sm text-gray-600">
                      {operationType === 'AI Keyword Update' && `${result.result.keywordsAdded} keywords added`}
                      {operationType === 'Plagiarism Scan' && `${result.result.uniqueContent}% unique content`}
                      {operationType === 'Speed Test' && `Mobile: ${result.result.mobileSpeed}, Desktop: ${result.result.desktopSpeed}`}
                      {operationType === 'SEO Analysis' && `Score: ${result.result.seoScore}, ${result.result.issuesFound} issues`}
                      {operationType === 'Status Check' && `${result.result.isOnline ? 'Online' : 'Offline'} (${result.result.responseTime}ms)`}
                    </div>
                  )}
                </div>
              </div>
              
              <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                {result.status}
              </Badge>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkResultsModal;
