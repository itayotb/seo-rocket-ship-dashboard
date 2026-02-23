
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Download, Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

export interface PreSearchFilters {
  limit: number;
  minVolume: number;
  noVolumeFilter: boolean;
  includeKeywords: string;
}

export const defaultPreSearchFilters: PreSearchFilters = {
  limit: 700,
  minVolume: 10,
  noVolumeFilter: false,
  includeKeywords: '',
};

interface SearchHeaderProps {
  onLoadDemo: () => void;
  onSearch: (keyword: string, country: string, language: string, preFilters: PreSearchFilters) => void;
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [preFilters, setPreFilters] = useState<PreSearchFilters>(defaultPreSearchFilters);

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      onSearch(searchKeyword.trim(), searchCountry, searchLanguage, preFilters);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="space-y-0">
      {/* Main search row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-card border rounded-t-lg border-b-0">
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

      {/* Pre-search filters */}
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between px-4 py-2 bg-muted/50 border border-t-0 rounded-none rounded-b-lg hover:bg-muted"
          >
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Pre-Search Filters
              {(preFilters.limit !== defaultPreSearchFilters.limit || 
                preFilters.minVolume !== defaultPreSearchFilters.minVolume || 
                preFilters.noVolumeFilter ||
                preFilters.includeKeywords) && (
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">Active</span>
              )}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-card border border-t-0 rounded-b-lg p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Limit */}
              <div className="space-y-1.5">
                <Label htmlFor="preLimit" className="text-sm">Keyword Limit</Label>
                <Input
                  id="preLimit"
                  type="number"
                  min={1}
                  max={10000}
                  value={preFilters.limit}
                  onChange={(e) => setPreFilters(prev => ({ ...prev, limit: parseInt(e.target.value) || 700 }))}
                  placeholder="700"
                />
                <p className="text-xs text-muted-foreground">Max keywords to return</p>
              </div>

              {/* Min Volume */}
              <div className="space-y-1.5">
                <Label htmlFor="preMinVol" className="text-sm">Min Monthly Volume</Label>
                <Input
                  id="preMinVol"
                  type="number"
                  min={0}
                  value={preFilters.noVolumeFilter ? '' : preFilters.minVolume}
                  disabled={preFilters.noVolumeFilter}
                  onChange={(e) => setPreFilters(prev => ({ ...prev, minVolume: parseInt(e.target.value) || 0 }))}
                  placeholder="10"
                />
                <div className="flex items-center gap-2 pt-1">
                  <Switch
                    id="noVolFilter"
                    checked={preFilters.noVolumeFilter}
                    onCheckedChange={(checked) => setPreFilters(prev => ({ ...prev, noVolumeFilter: checked }))}
                  />
                  <Label htmlFor="noVolFilter" className="text-xs cursor-pointer">Return all (no volume filter)</Label>
                </div>
              </div>

              {/* Include Keywords */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="preInclude" className="text-sm">Must Include Words</Label>
                <Input
                  id="preInclude"
                  value={preFilters.includeKeywords}
                  onChange={(e) => setPreFilters(prev => ({ ...prev, includeKeywords: e.target.value }))}
                  placeholder='e.g. "bad credit" or bad credit, low interest'
                />
                <p className="text-xs text-muted-foreground">
                  Use quotes for exact phrase, or comma-separated for any match
                </p>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SearchHeader;
