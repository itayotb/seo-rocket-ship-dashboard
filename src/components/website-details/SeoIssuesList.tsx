
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Filter } from 'lucide-react';
import SeoIssueCard from './SeoIssueCard';

interface SeoIssuesListProps {
  filteredIssues: any[];
}

const SeoIssuesList: React.FC<SeoIssuesListProps> = ({
  filteredIssues
}) => {
  return (
    <div className="space-y-4">
      {filteredIssues.length > 0 ? (
        filteredIssues.map((issueWithSource, index) => (
          <div key={`${issueWithSource.id}-${issueWithSource.sourceItem.id}`} className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="h-3 w-3" />
              <span>From: {issueWithSource.sourceItem.title}</span>
              <Badge variant="outline" className="text-xs">
                {issueWithSource.sourceItem.type}
              </Badge>
            </div>
            <SeoIssueCard issue={issueWithSource} />
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Filter className="h-12 w-12 mx-auto mb-3" />
          <h4 className="text-lg font-semibold">No Issues Match Your Filter</h4>
          <p>Try adjusting your filter criteria to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default SeoIssuesList;
