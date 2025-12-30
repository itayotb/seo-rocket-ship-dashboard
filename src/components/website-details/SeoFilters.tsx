
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, AlertTriangle, AlertCircle, Info, Wand2, RefreshCw } from 'lucide-react';

interface SeoFiltersProps {
  severityFilter: string;
  setSeverityFilter: (filter: string) => void;
  issuesByPriority: {
    critical: any[];
    warning: any[];
    info: any[];
  };
  autoFixableIssues: any[];
  onBulkAutoFix: () => void;
  isApplyingBulkFixes: boolean;
  allIssuesCount: number;
}

const SeoFilters: React.FC<SeoFiltersProps> = ({
  severityFilter,
  setSeverityFilter,
  issuesByPriority,
  autoFixableIssues,
  onBulkAutoFix,
  isApplyingBulkFixes,
  allIssuesCount
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filter by severity:</span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={severityFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSeverityFilter('all')}
          >
            All ({allIssuesCount})
          </Button>
          <Button
            variant={severityFilter === 'critical' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => setSeverityFilter('critical')}
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical ({issuesByPriority.critical.length})
          </Button>
          <Button
            variant={severityFilter === 'warning' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSeverityFilter('warning')}
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Warning ({issuesByPriority.warning.length})
          </Button>
          <Button
            variant={severityFilter === 'info' ? 'outline' : 'outline'}
            size="sm"
            onClick={() => setSeverityFilter('info')}
          >
            <Info className="h-3 w-3 mr-1" />
            Info ({issuesByPriority.info.length})
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {autoFixableIssues.length > 0 && (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={onBulkAutoFix}
            disabled={isApplyingBulkFixes}
          >
            {isApplyingBulkFixes ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Fixing...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Fix All ({autoFixableIssues.length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeoFilters;
