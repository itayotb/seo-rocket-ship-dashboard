
import React from 'react';
import { ContentItem as ContentItemType } from '@/types/website';
import ContentItem from './ContentItem';
import ContentForm from './ContentForm';

interface ContentListProps {
  contentItems: ContentItemType[];
  editingItem: string | null;
  isCreating: boolean;
  onEdit: (itemId: string) => void;
  onAdvancedEdit: (item: ContentItemType) => void;
  onDelete: (itemId: string) => void;
  onSave: (itemId?: string) => void;
  onCancel: () => void;
}

const ContentList: React.FC<ContentListProps> = ({ 
  contentItems, 
  editingItem, 
  isCreating, 
  onEdit, 
  onAdvancedEdit, 
  onDelete,
  onSave, 
  onCancel 
}) => {
  return (
    <div className="space-y-4">
      {isCreating && (
        <ContentForm
          isCreating={true}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}

      {contentItems.map((item) => (
        <div key={item.id}>
          {editingItem === item.id ? (
            <ContentForm
              item={item}
              isCreating={false}
              onSave={onSave}
              onCancel={onCancel}
            />
          ) : (
            <ContentItem
              item={item}
              onEdit={onEdit}
              onAdvancedEdit={onAdvancedEdit}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ContentList;
