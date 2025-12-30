
import React from 'react';
import { TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Smartphone, Monitor, Search, FileText, Activity, Globe, MousePointer, Tag } from 'lucide-react';
import SortableHeader from './SortableHeader';
import { Website } from '@/types/website';

interface WebsiteTableHeaderProps {
  sortBy: keyof Website | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof Website) => void;
  showBulkActions?: boolean;
  selectedWebsites?: string[];
  websites?: Website[];
  onSelectAll?: () => void;
  onClearSelection?: () => void;
}

const WebsiteTableHeader = ({ 
  sortBy, 
  sortDirection, 
  onSort,
  showBulkActions = false,
  selectedWebsites = [],
  websites = [],
  onSelectAll,
  onClearSelection
}: WebsiteTableHeaderProps) => {
  const isAllSelected = websites.length > 0 && selectedWebsites.length === websites.length;
  const isIndeterminate = selectedWebsites.length > 0 && selectedWebsites.length < websites.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onClearSelection?.();
    } else {
      onSelectAll?.();
    }
  };

  return (
    <TableHeader>
      <TableRow>
        {showBulkActions && (
          <TableHead className="w-12">
            <Checkbox
              checked={isAllSelected}
              // @ts-ignore - Radix UI checkbox supports indeterminate
              indeterminate={isIndeterminate}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
        )}
        <TableHead className="w-16">Logo</TableHead>
        <SortableHeader column="name" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort}>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Website</span>
          </div>
        </SortableHeader>
        <SortableHeader column="category" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort}>
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Category</span>
          </div>
        </SortableHeader>
        <SortableHeader column="googlePosition" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort}>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Google Position</span>
          </div>
        </SortableHeader>
        <SortableHeader column="mobileSpeed" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort}>
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>Mobile Speed</span>
          </div>
        </SortableHeader>
        <SortableHeader column="desktopSpeed" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort}>
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <span>Desktop Speed</span>
          </div>
        </SortableHeader>
        <SortableHeader column="seoScore" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort}>
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>SEO Score</span>
          </div>
        </SortableHeader>
        <SortableHeader column="uniqueContent" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort}>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Unique Content</span>
          </div>
        </SortableHeader>
        <SortableHeader column="totalClicks" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort}>
          <div className="flex items-center space-x-2">
            <MousePointer className="h-4 w-4" />
            <span>Clicks</span>
          </div>
        </SortableHeader>
        <SortableHeader column="status" sortBy={sortBy} sortDirection={sortDirection} onSort={onSort}>
          Status
        </SortableHeader>
        <TableHead className="w-16">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default WebsiteTableHeader;
