
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  FileSearch, 
  Smartphone, 
  Monitor, 
  Activity, 
  ToggleLeft,
  X,
  Play,
  CheckCheck
} from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkKeywordUpdate: () => void;
  onBulkPlagiarismScan: () => void;
  onBulkSpeedTest: () => void;
  onBulkSeoAnalysis: () => void;
  onBulkStatusCheck: () => void;
  onCheckAllParameters: () => void;
  isProcessing: boolean;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkKeywordUpdate,
  onBulkPlagiarismScan,
  onBulkSpeedTest,
  onBulkSeoAnalysis,
  onBulkStatusCheck,
  onCheckAllParameters,
  isProcessing
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="default" className="bg-blue-600">
            {selectedCount} website{selectedCount !== 1 ? 's' : ''} selected
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={onCheckAllParameters}
            disabled={isProcessing}
            size="sm"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Check All Parameters
          </Button>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
          
          <Button
            onClick={onBulkKeywordUpdate}
            disabled={isProcessing}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Bot className="h-4 w-4 mr-2" />
            AI Keywords
          </Button>
          
          <Button
            onClick={onBulkPlagiarismScan}
            disabled={isProcessing}
            size="sm"
            variant="outline"
          >
            <FileSearch className="h-4 w-4 mr-2" />
            Plagiarism Scan
          </Button>
          
          <Button
            onClick={onBulkSpeedTest}
            disabled={isProcessing}
            size="sm"
            variant="outline"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            <Monitor className="h-4 w-4 mr-2" />
            Speed Test
          </Button>
          
          <Button
            onClick={onBulkSeoAnalysis}
            disabled={isProcessing}
            size="sm"
            variant="outline"
          >
            <Activity className="h-4 w-4 mr-2" />
            SEO Analysis
          </Button>
          
          <Button
            onClick={onBulkStatusCheck}
            disabled={isProcessing}
            size="sm"
            variant="outline"
          >
            <ToggleLeft className="h-4 w-4 mr-2" />
            Status Check
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;
