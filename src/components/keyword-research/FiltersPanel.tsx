
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiltersState, defaultFilters, IntentType } from '@/types/keywordResearch';
import { Filter, RotateCcw } from 'lucide-react';

interface FiltersPanelProps {
  onApplyFilters: (filters: FiltersState) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState<FiltersState>(defaultFilters);
  const [includeText, setIncludeText] = useState('');

  const intentOptions: IntentType[] = ['Informational', 'Commercial', 'Transactional', 'Navigational'];

  // Apply filters automatically when any filter changes
  useEffect(() => {
    const terms = includeText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    onApplyFilters({
      ...localFilters,
      includeTerms: terms,
    });
  }, [localFilters, includeText, onApplyFilters]);

  const handleIntentChange = (intent: IntentType, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      intentTypes: checked
        ? [...prev.intentTypes, intent]
        : prev.intentTypes.filter(i => i !== intent),
    }));
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
    setIncludeText('');
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleReset} title="Reset filters">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Volume Filter */}
        <div className="space-y-2">
          <Label htmlFor="minVolume">Min Volume</Label>
          <Input
            id="minVolume"
            type="number"
            min={0}
            value={localFilters.minVolume}
            onChange={(e) => setLocalFilters(prev => ({
              ...prev,
              minVolume: parseInt(e.target.value) || 0,
            }))}
            placeholder="0"
          />
        </div>

        {/* Intent Filter */}
        <div className="space-y-3">
          <Label>User Intent</Label>
          <div className="space-y-2">
            {intentOptions.map(intent => (
              <div key={intent} className="flex items-center space-x-2">
                <Checkbox
                  id={`intent-${intent}`}
                  checked={localFilters.intentTypes.includes(intent)}
                  onCheckedChange={(checked) => handleIntentChange(intent, checked as boolean)}
                />
                <Label 
                  htmlFor={`intent-${intent}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {intent}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Branding Filter */}
        <div className="space-y-3">
          <Label>Branding</Label>
          <RadioGroup
            value={localFilters.branding}
            onValueChange={(value) => setLocalFilters(prev => ({
              ...prev,
              branding: value as FiltersState['branding'],
            }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="brand-all" />
              <Label htmlFor="brand-all" className="text-sm font-normal cursor-pointer">All keywords</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Branded" id="brand-branded" />
              <Label htmlFor="brand-branded" className="text-sm font-normal cursor-pointer">Branded only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Non-branded" id="brand-nonbranded" />
              <Label htmlFor="brand-nonbranded" className="text-sm font-normal cursor-pointer">Non-branded only</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Location Filter */}
        <div className="space-y-3">
          <Label>Location</Label>
          <RadioGroup
            value={localFilters.location}
            onValueChange={(value) => setLocalFilters(prev => ({
              ...prev,
              location: value as FiltersState['location'],
            }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="loc-all" />
              <Label htmlFor="loc-all" className="text-sm font-normal cursor-pointer">All keywords</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Local" id="loc-local" />
              <Label htmlFor="loc-local" className="text-sm font-normal cursor-pointer">Local only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Non-local" id="loc-nonlocal" />
              <Label htmlFor="loc-nonlocal" className="text-sm font-normal cursor-pointer">Non-local only</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Include Filter */}
        <div className="space-y-3">
          <Label>Include Words</Label>
          <RadioGroup
            value={localFilters.includeMode}
            onValueChange={(value) => setLocalFilters(prev => ({
              ...prev,
              includeMode: value as FiltersState['includeMode'],
            }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any" id="inc-any" />
              <Label htmlFor="inc-any" className="text-sm font-normal cursor-pointer">Any word</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="inc-all" />
              <Label htmlFor="inc-all" className="text-sm font-normal cursor-pointer">All words</Label>
            </div>
          </RadioGroup>
          <Input
            placeholder="best, low interest, calculator"
            value={includeText}
            onChange={(e) => setIncludeText(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Separate terms with commas</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersPanel;
