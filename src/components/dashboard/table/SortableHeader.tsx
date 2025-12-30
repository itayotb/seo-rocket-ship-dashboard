
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { Website } from '@/types/website';

interface SortableHeaderProps {
  column: keyof Website;
  children: React.ReactNode;
  sortBy: keyof Website | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof Website) => void;
}

const SortableHeader = ({ 
  column, 
  children, 
  sortBy, 
  sortDirection, 
  onSort 
}: SortableHeaderProps) => (
  <TableHead 
    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
    onClick={() => onSort(column)}
  >
    <div className="flex items-center space-x-1">
      <span>{children}</span>
      {sortBy === column && (
        sortDirection === 'asc' ? 
          <ArrowUp className="h-3 w-3" /> : 
          <ArrowDown className="h-3 w-3" />
      )}
    </div>
  </TableHead>
);

export default SortableHeader;
