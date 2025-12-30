import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Languages, TrendingUp, TrendingDown, Minus, Eye, MousePointer } from 'lucide-react';
import { KeywordData } from '@/types/keyword';
import KeywordActions from './KeywordActions';

interface KeywordTableRowProps {
  keyword: KeywordData;
  editingKeyword: string | null;
  onStartEdit: (keywordId: string, currentTerm: string) => void;
  onUpdate: (keywordId: string, newTerm: string) => void;
  onCancelEdit: () => void;
  onRemove: (keywordId: string) => void;
  getGeoFlag: (geo: string) => string;
  getLanguageName: (code: string) => string;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

const KeywordTableRow: React.FC<KeywordTableRowProps> = ({
  keyword,
  editingKeyword,
  onStartEdit,
  onUpdate,
  onCancelEdit,
  onRemove,
  getGeoFlag,
  getLanguageName,
  isSelected,
  onSelect
}) => {
  const [editKeywordValue, setEditKeywordValue] = useState('');

  const handleStartEdit = (keywordId: string, currentTerm: string) => {
    setEditKeywordValue(currentTerm);
    onStartEdit(keywordId, currentTerm);
  };

  const handleUpdate = () => {
    if (editKeywordValue.trim()) {
      onUpdate(keyword.id, editKeywordValue);
      setEditKeywordValue('');
    }
  };

  const handleCancel = () => {
    setEditKeywordValue('');
    onCancelEdit();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 80) return 'destructive';
    if (difficulty >= 60) return 'secondary';
    return 'default';
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600';
    if (position <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <tr className={`border-b ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
      <td className="p-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </td>
      <td className="p-2">
        {editingKeyword === keyword.id ? (
          <div className="flex space-x-2">
            <Input
              value={editKeywordValue}
              onChange={(e) => setEditKeywordValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
              className="text-sm"
            />
            <Button size="sm" onClick={handleUpdate}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <span className="font-medium">{keyword.term}</span>
        )}
      </td>
      <td className="p-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Globe className="h-3 w-3 text-gray-500" />
            <span>{getGeoFlag(keyword.geo)}</span>
            <span className="text-xs text-gray-500 uppercase">{keyword.geo}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Languages className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-500">{getLanguageName(keyword.language)}</span>
          </div>
        </div>
      </td>
      <td className="p-2">
        <div className="flex items-center space-x-2">
          <span className={`font-semibold ${getPositionColor(keyword.position)}`}>
            {keyword.position > 0 ? `#${keyword.position}` : 'N/A'}
          </span>
          {keyword.positionChange !== 0 && (
            <span className={`text-xs ${keyword.positionChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ({keyword.positionChange > 0 ? '+' : ''}{keyword.positionChange})
            </span>
          )}
        </div>
      </td>
      <td className="p-2">
        <span className="text-sm">
          {keyword.volume > 0 ? keyword.volume.toLocaleString() : 'N/A'}
        </span>
      </td>
      <td className="p-2">
        {keyword.difficulty > 0 ? (
          <Badge variant={getDifficultyColor(keyword.difficulty)}>
            {keyword.difficulty}%
          </Badge>
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        )}
      </td>
      <td className="p-2">
        <div className="flex items-center space-x-1">
          <Eye className="h-3 w-3 text-gray-500" />
          <span className="text-sm">
            {keyword.impressions > 0 ? formatNumber(keyword.impressions) : 'N/A'}
          </span>
        </div>
      </td>
      <td className="p-2">
        <div className="flex items-center space-x-1">
          <MousePointer className="h-3 w-3 text-gray-500" />
          <span className="text-sm">
            {keyword.clicks > 0 ? formatNumber(keyword.clicks) : 'N/A'}
          </span>
        </div>
      </td>
      <td className="p-2">
        <span className="text-sm font-medium">
          {keyword.ctr > 0 ? `${keyword.ctr.toFixed(1)}%` : 'N/A'}
        </span>
      </td>
      <td className="p-2">
        <div className="flex items-center space-x-1">
          {getTrendIcon(keyword.trend)}
          <span className="text-sm capitalize">{keyword.trend}</span>
        </div>
      </td>
      <td className="p-2">
        <KeywordActions
          keywordId={keyword.id}
          keywordTerm={keyword.term}
          editingKeyword={editingKeyword}
          onEdit={handleStartEdit}
          onRemove={onRemove}
        />
      </td>
    </tr>
  );
};

export default KeywordTableRow;
