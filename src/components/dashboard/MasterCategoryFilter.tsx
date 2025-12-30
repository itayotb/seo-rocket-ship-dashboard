import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { getAllCategories } from '@/utils/templateCategories';

interface MasterCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const MasterCategoryFilter: React.FC<MasterCategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const categories = getAllCategories();

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MasterCategoryFilter;
