
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, CheckSquare, Database, Filter } from 'lucide-react';

interface SummaryActionsProps {
  totalKeywords: number;
  filteredCount: number;
  selectedCount: number;
  onAnalyze: () => void;
}

const SummaryActions: React.FC<SummaryActionsProps> = ({
  totalKeywords,
  filteredCount,
  selectedCount,
  onAnalyze,
}) => {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold">{totalKeywords}</span>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">After filters:</span>
              <span className="font-semibold">{filteredCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Selected:</span>
              <span className="font-semibold text-primary">{selectedCount}</span>
            </div>
          </div>
          
          <Button 
            onClick={onAnalyze}
            disabled={selectedCount === 0}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analyze Selected
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryActions;
