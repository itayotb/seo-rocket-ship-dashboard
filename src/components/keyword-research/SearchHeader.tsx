
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
  onSearch: (keyword: string, country: string, language: string) => void;
  isLoading: boolean;
  isLoaded: boolean;
  searchKeyword: string;
  searchCountry: string;
  searchLanguage: string;
  onSearchKeywordChange: (value: string) => void;
  onSearchCountryChange: (value: string) => void;
  onSearchLanguageChange: (value: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ 
  onLoadDemo, 
  onSearch,
  isLoading, 
  isLoaded,
  searchKeyword,
  searchCountry,
  searchLanguage,
  onSearchKeywordChange,
  onSearchCountryChange,
  onSearchLanguageChange,
}) => {
  const handleSearch = () => {
    if (searchKeyword.trim()) {
      onSearch(searchKeyword.trim(), searchCountry, searchLanguage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-card border rounded-lg">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter keyword (e.g. car loans)..."
            className="pl-10"
            value={searchKeyword}
            onChange={(e) => onSearchKeywordChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <Select value={searchCountry} onValueChange={onSearchCountryChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ca">🇨🇦 Canada</SelectItem>
            <SelectItem value="us">🇺🇸 United States</SelectItem>
            <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
            <SelectItem value="au">🇦🇺 Australia</SelectItem>
            <SelectItem value="de">🇩🇪 Germany</SelectItem>
            <SelectItem value="fr">🇫🇷 France</SelectItem>
            <SelectItem value="il">🇮🇱 Israel</SelectItem>
          </SelectContent>
        </Select>

        <Select value={searchLanguage} onValueChange={onSearchLanguageChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="he">Hebrew</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} disabled={isLoading || !searchKeyword.trim()}>
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <Button variant="outline" onClick={onLoadDemo} disabled={isLoading}>
        <Download className="h-4 w-4 mr-2" />
        {isLoading ? 'Loading...' : isLoaded ? 'Reload Demo' : 'Load Demo'}
      </Button>
    </div>
  );
};

export default SearchHeader;
