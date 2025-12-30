
import React from 'react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import MasterCategoryFilter from './MasterCategoryFilter';

interface DashboardHeaderProps {
  masterCategoryFilter: string;
  onMasterCategoryFilterChange: (category: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  masterCategoryFilter,
  onMasterCategoryFilterChange
}) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <MasterCategoryFilter 
            selectedCategory={masterCategoryFilter}
            onCategoryChange={onMasterCategoryFilterChange}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
