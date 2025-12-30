import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Zap, CalendarDays } from 'lucide-react';
import { SchedulingConfig } from '@/types/bulkWebsiteCreation';
import { calculateCompletionEstimate, calculateDailyRate } from '@/utils/bulkCreationMock';
import { format, addDays } from 'date-fns';

interface BulkStepSchedulingProps {
  totalKeywords: number;
  scheduling: SchedulingConfig;
  onSchedulingChange: (scheduling: SchedulingConfig) => void;
}

const BulkStepScheduling = ({
  totalKeywords,
  scheduling,
  onSchedulingChange,
}: BulkStepSchedulingProps) => {
  const estimate = calculateCompletionEstimate(totalKeywords, scheduling);

  const handleModeChange = (mode: SchedulingConfig['mode']) => {
    const newScheduling: SchedulingConfig = { mode };
    
    if (mode === 'per_days') {
      newScheduling.sitesPerInterval = 1;
      newScheduling.intervalDays = 1;
    } else if (mode === 'distribute_month') {
      newScheduling.totalDays = 30;
    }
    
    onSchedulingChange(newScheduling);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Scheduling</h3>
        <p className="text-sm text-muted-foreground">
          Choose how {totalKeywords} websites will be created over time.
        </p>
      </div>

      <RadioGroup
        value={scheduling.mode}
        onValueChange={(value) => handleModeChange(value as SchedulingConfig['mode'])}
        className="space-y-4"
      >
        <Card className={scheduling.mode === 'immediate' ? 'border-primary' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <RadioGroupItem value="immediate" id="immediate" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="immediate" className="text-base font-medium flex items-center gap-2 cursor-pointer">
                  <Zap className="h-4 w-4" />
                  Immediate
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Create all websites as fast as possible (simulated: ~10 per day)
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className={scheduling.mode === 'per_days' ? 'border-primary' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <RadioGroupItem value="per_days" id="per_days" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="per_days" className="text-base font-medium flex items-center gap-2 cursor-pointer">
                  <Clock className="h-4 w-4" />
                  Per Interval
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a specific number of sites every X days
                </p>
              </div>
            </div>
          </CardHeader>
          {scheduling.mode === 'per_days' && (
            <CardContent className="pt-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm">Create</span>
                <Input
                  type="number"
                  min={1}
                  max={totalKeywords}
                  value={scheduling.sitesPerInterval || 1}
                  onChange={(e) =>
                    onSchedulingChange({
                      ...scheduling,
                      sitesPerInterval: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-20"
                />
                <span className="text-sm">site(s) every</span>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={scheduling.intervalDays || 1}
                  onChange={(e) =>
                    onSchedulingChange({
                      ...scheduling,
                      intervalDays: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-20"
                />
                <span className="text-sm">day(s)</span>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className={scheduling.mode === 'distribute_month' ? 'border-primary' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <RadioGroupItem value="distribute_month" id="distribute_month" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="distribute_month" className="text-base font-medium flex items-center gap-2 cursor-pointer">
                  <CalendarDays className="h-4 w-4" />
                  Distribute Over Time
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Spread creation evenly across a period
                </p>
              </div>
            </div>
          </CardHeader>
          {scheduling.mode === 'distribute_month' && (
            <CardContent className="pt-0">
              <div className="flex items-center gap-3">
                <span className="text-sm">Distribute over</span>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={scheduling.totalDays || 30}
                  onChange={(e) =>
                    onSchedulingChange({
                      ...scheduling,
                      totalDays: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-20"
                />
                <span className="text-sm">days</span>
                <span className="text-sm text-muted-foreground">
                  ({calculateDailyRate(totalKeywords, scheduling.totalDays || 30)} sites/day)
                </span>
              </div>
            </CardContent>
          )}
        </Card>
      </RadioGroup>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Estimated Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Sites</p>
              <p className="text-2xl font-bold">{totalKeywords}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-2xl font-bold">{estimate.days} days</p>
            </div>
          </div>
          
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{format(new Date(), 'MMM d, yyyy')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Completion Date</p>
                <p className="font-medium">{format(estimate.completionDate, 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkStepScheduling;
