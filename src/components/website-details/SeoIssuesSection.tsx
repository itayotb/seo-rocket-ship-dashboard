
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { ContentItem } from '@/types/website';
import { analyzeSeoIssues } from '@/utils/seo';
import SeoFilters from './SeoFilters';
import SeoIssuesList from './SeoIssuesList';

interface SeoIssuesSectionProps {
  contentItems: ContentItem[];
  onAutoFix: (updatedItem: ContentItem) => void;
  onNavigateToEdit: (item: ContentItem) => void;
}

const SeoIssuesSection: React.FC<SeoIssuesSectionProps> = ({
  contentItems,
  onAutoFix,
  onNavigateToEdit
}) => {
  const [isIssuesExpanded, setIsIssuesExpanded] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isApplyingBulkFixes, setIsApplyingBulkFixes] = useState(false);
  const { toast } = useToast();

  // Get all issues across content items with source information and auto-fix capabilities
  const allIssuesWithSource = contentItems.flatMap(item => 
    analyzeSeoIssues(item, onAutoFix, onNavigateToEdit).map(issue => ({
      ...issue,
      sourceItem: item
    }))
  );

  // Filter issues by severity
  const filteredIssues = allIssuesWithSource.filter(issue => 
    severityFilter === 'all' || issue.severity === severityFilter
  );

  const autoFixableIssues = filteredIssues.filter(issue => issue.canAutoFix && issue.autoFixAction);

  const handleBulkAutoFix = async () => {
    if (autoFixableIssues.length === 0) return;
    
    setIsApplyingBulkFixes(true);
    let fixedCount = 0;
    
    try {
      for (const issue of autoFixableIssues) {
        if (issue.autoFixAction) {
          try {
            await issue.autoFixAction();
            fixedCount++;
          } catch (error) {
            console.error('Failed to auto-fix issue:', issue.id, error);
          }
        }
      }
      
      toast({
        title: "Bulk Auto-fix Complete",
        description: `Successfully fixed ${fixedCount} out of ${autoFixableIssues.length} issues.`,
      });
    } catch (error) {
      toast({
        title: "Bulk Auto-fix Failed",
        description: "Some issues could not be automatically fixed.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingBulkFixes(false);
    }
  };

  const issuesByPriority = {
    critical: allIssuesWithSource.filter(i => i.severity === 'critical'),
    warning: allIssuesWithSource.filter(i => i.severity === 'warning'),
    info: allIssuesWithSource.filter(i => i.severity === 'info')
  };

  if (allIssuesWithSource.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t pt-6">
      <Collapsible open={isIssuesExpanded} onOpenChange={setIsIssuesExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <h3 className="text-lg font-semibold">Detailed SEO Issues</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{allIssuesWithSource.length} total</Badge>
              {isIssuesExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Issue Filters and Bulk Actions */}
          <SeoFilters
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            issuesByPriority={issuesByPriority}
            autoFixableIssues={autoFixableIssues}
            onBulkAutoFix={handleBulkAutoFix}
            isApplyingBulkFixes={isApplyingBulkFixes}
            allIssuesCount={allIssuesWithSource.length}
          />

          {/* Issues List */}
          <SeoIssuesList filteredIssues={filteredIssues} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SeoIssuesSection;
