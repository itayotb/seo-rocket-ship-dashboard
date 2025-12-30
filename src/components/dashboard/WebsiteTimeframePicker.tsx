
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WebsiteTimeframePickerProps {
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const WebsiteTimeframePicker: React.FC<WebsiteTimeframePickerProps> = ({
  timeframe,
  onTimeframeChange
}) => {
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const timeframeOptions = [
    { value: '24hours', label: '24 Hours' },
    { value: '7days', label: '7 Days' },
    { value: '28days', label: '28 Days' },
    { value: '3months', label: '3 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleTimeframeChange = (value: string) => {
    onTimeframeChange(value);
    if (value === 'custom') {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
      setCustomDateRange({ from: undefined, to: undefined });
    }
  };

  const getDateRangeLabel = () => {
    if (timeframe !== 'custom') {
      return timeframeOptions.find(option => option.value === timeframe)?.label;
    }
    
    if (customDateRange.from && customDateRange.to) {
      return `${format(customDateRange.from, 'MMM dd')} - ${format(customDateRange.to, 'MMM dd')}`;
    }
    
    if (customDateRange.from) {
      return `From ${format(customDateRange.from, 'MMM dd, yyyy')}`;
    }
    
    return 'Custom Range';
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-4 w-4 text-gray-500" />
      <Select value={timeframe} onValueChange={handleTimeframeChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {timeframeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {showCustomDatePicker && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-auto justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDateRangeLabel()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={customDateRange.from}
              selected={{
                from: customDateRange.from,
                to: customDateRange.to,
              }}
              onSelect={(range) => {
                setCustomDateRange({
                  from: range?.from,
                  to: range?.to,
                });
              }}
              numberOfMonths={2}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default WebsiteTimeframePicker;
