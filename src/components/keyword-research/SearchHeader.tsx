
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Search } from 'lucide-react';

interface SearchHeaderProps {
  onLoadDemo: () => void;
  isLoading: boolean;
  isLoaded: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ onLoadDemo, isLoading, isLoaded }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-card border rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter keyword..."
            className="pl-10"
            disabled
          />
        </div>
        
        <Select defaultValue="ca" disabled>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ca">🇨🇦 Canada</SelectItem>
            <SelectItem value="us">🇺🇸 United States</SelectItem>
            <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="niche" disabled>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single Keyword</SelectItem>
            <SelectItem value="niche">Niche (Terms Match)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onLoadDemo} disabled={isLoading}>
        <Download className="h-4 w-4 mr-2" />
        {isLoading ? 'Loading...' : isLoaded ? 'Reload Demo' : 'Load Demo'}
      </Button>
    </div>
  );
};

export default SearchHeader;
