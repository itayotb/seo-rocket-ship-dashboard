
import React from 'react';
import { ArrowUp, ArrowDown, Minus, ExternalLink, Smartphone, Monitor, Search, FileText, Activity, Trash2, MousePointer, Tag } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Website } from '@/types/website';
import { getScoreColor } from '@/utils/website-utils';

interface WebsiteTableRowProps {
  website: Website;
  onViewDetails: (websiteId: string) => void;
  onDeleteWebsite?: (websiteId: string) => void;
  showBulkActions?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (websiteId: string) => void;
}

const getRankingIcon = (change: 'up' | 'down' | 'stable') => {
  switch (change) {
    case 'up':
      return <ArrowUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <ArrowDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-400" />;
  }
};

const formatClicks = (clicks?: number) => {
  if (!clicks) return '0';
  if (clicks >= 1000000) return (clicks / 1000000).toFixed(1) + 'M';
  if (clicks >= 1000) return (clicks / 1000).toFixed(1) + 'K';
  return clicks.toLocaleString();
};

const WebsiteTableRow = ({ 
  website, 
  onViewDetails,
  onDeleteWebsite,
  showBulkActions = false,
  isSelected = false,
  onToggleSelection
}: WebsiteTableRowProps) => {
  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger row click if clicking on checkbox or action buttons
    if ((e.target as HTMLElement).closest('input, button')) {
      return;
    }
    onViewDetails(website.id);
  };

  return (
    <TableRow 
      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
      onClick={handleRowClick}
    >
      {showBulkActions && (
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection?.(website.id)}
          />
        </TableCell>
      )}
      
      <TableCell>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
          {website.name.charAt(0).toUpperCase()}
        </div>
      </TableCell>
      
      <TableCell>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {website.name}
          </div>
          <div className="text-sm text-gray-500">
            {website.domain}
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-gray-400" />
          <Badge variant="secondary" className="capitalize">
            {website.category}
          </Badge>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <span className="font-medium">#{website.googlePosition}</span>
          {getRankingIcon(website.rankingChange)}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-2">
          <Smartphone className="h-4 w-4 text-gray-400" />
          <span className={cn("font-medium", getScoreColor(website.mobileSpeed))}>
            {website.mobileSpeed}
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-2">
          <Monitor className="h-4 w-4 text-gray-400" />
          <span className={cn("font-medium", getScoreColor(website.desktopSpeed))}>
            {website.desktopSpeed}
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-gray-400" />
          <span className={cn("font-medium", getScoreColor(website.seoScore))}>
            {website.seoScore}
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-400" />
          <span className={cn("font-medium", getScoreColor(website.uniqueContent))}>
            {website.uniqueContent}%
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-2">
          <MousePointer className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-blue-600">
            {formatClicks(website.totalClicks)}
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          website.status === 'active' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' 
            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        )}>
          {website.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </TableCell>
      
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://${website.domain}`, '_blank');
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          {onDeleteWebsite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteWebsite(website.id);
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default WebsiteTableRow;
