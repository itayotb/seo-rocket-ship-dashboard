
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface DashboardViewControlsProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const DashboardViewControls: React.FC<DashboardViewControlsProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
};

export default DashboardViewControls;
