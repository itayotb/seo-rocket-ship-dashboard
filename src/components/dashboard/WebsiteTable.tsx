
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Website, WebsiteTableProps } from '@/types/website';
import { sortWebsites } from '@/utils/website-utils';
import WebsiteTableHeader from './table/WebsiteTableHeader';
import WebsiteTableRow from './table/WebsiteTableRow';

interface ExtendedWebsiteTableProps extends WebsiteTableProps {
  showBulkActions?: boolean;
  selectedWebsites?: string[];
  onToggleSelection?: (websiteId: string) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onDeleteWebsite?: (websiteId: string) => void;
}

const WebsiteTable = ({ 
  websites, 
  onViewDetails, 
  onToggleStatus,
  onDeleteWebsite,
  showBulkActions = false,
  selectedWebsites = [],
  onToggleSelection,
  onSelectAll,
  onClearSelection
}: ExtendedWebsiteTableProps) => {
  const [sortBy, setSortBy] = useState<keyof Website | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof Website) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedWebsites = React.useMemo(() => {
    return sortWebsites(websites, sortBy, sortDirection);
  }, [websites, sortBy, sortDirection]);

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-900 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <WebsiteTableHeader 
            sortBy={sortBy} 
            sortDirection={sortDirection} 
            onSort={handleSort}
            showBulkActions={showBulkActions}
            selectedWebsites={selectedWebsites}
            websites={websites}
            onSelectAll={onSelectAll}
            onClearSelection={onClearSelection}
          />
          <TableBody>
            {sortedWebsites.map((website) => (
              <WebsiteTableRow
                key={website.id}
                website={website}
                onViewDetails={onViewDetails}
                onDeleteWebsite={onDeleteWebsite}
                showBulkActions={showBulkActions}
                isSelected={selectedWebsites.includes(website.id)}
                onToggleSelection={onToggleSelection}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WebsiteTable;
