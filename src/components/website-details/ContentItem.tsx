
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Target } from 'lucide-react';
import { ContentItem as ContentItemType } from '@/types/website';

interface ContentItemProps {
  item: ContentItemType;
  onEdit: (itemId: string) => void;
  onAdvancedEdit: (item: ContentItemType) => void;
}

const ContentItem: React.FC<ContentItemProps> = ({ item, onEdit, onAdvancedEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'review':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold">{item.title}</h3>
            <Badge variant={getStatusColor(item.status)}>
              {item.status}
            </Badge>
            <span className="text-sm text-gray-500">{item.url}</span>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500">
              Last modified: {item.lastModified}
            </span>
            <span className={`text-sm font-medium ${getScoreColor(item.seoScore)}`}>
              <Target className="h-3 w-3 inline mr-1" />
              SEO: {item.seoScore}/100
            </span>
            <span className="text-sm text-gray-500">
              {item.wordCount} words
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(item.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Quick Edit
          </Button>
          <Button variant="default" size="sm" onClick={() => onAdvancedEdit(item)}>
            <Eye className="h-4 w-4 mr-2" />
            Full Editor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentItem;
