
import React from 'react';
import TemplatePreviewModal from './TemplatePreviewModal';
import TemplateEditSheet from './TemplateEditSheet';
import ApplyTemplateDialog from './ApplyTemplateDialog';
import CategoryManager from './CategoryManager';
import TemplateGalleryHeader from './TemplateGalleryHeader';
import TemplateCategoryFilters from './TemplateCategoryFilters';
import TemplatesGrid from './TemplatesGrid';
import { useTemplateGallery } from '@/hooks/useTemplateGallery';

export interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  rating: number;
  downloads: number;
  isFavorite: boolean;
  description?: string;
  previewUrl?: string;
}

interface TemplateGalleryProps {
  masterCategoryFilter: string;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ masterCategoryFilter }) => {
  const {
    selectedTemplate,
    setSelectedTemplate,
    isPreviewOpen,
    setIsPreviewOpen,
    isEditOpen,
    setIsEditOpen,
    isApplyOpen,
    setIsApplyOpen,
    isCategoryManagerOpen,
    setIsCategoryManagerOpen,
    selectedCategory,
    setSelectedCategory,
    availableCategories,
    filteredTemplates,
    handleCategoryAdded,
    toggleFavorite,
    setMasterFilter
  } = useTemplateGallery();

  // Sync with master category filter
  React.useEffect(() => {
    setMasterFilter(masterCategoryFilter);
  }, [masterCategoryFilter, setMasterFilter]);

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditOpen(true);
  };

  const handleApplyTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsApplyOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <TemplateGalleryHeader 
          onManageCategories={() => setIsCategoryManagerOpen(true)}
        />
        
        <TemplateCategoryFilters
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        
        <TemplatesGrid
          templates={filteredTemplates}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onApply={handleApplyTemplate}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      <TemplatePreviewModal
        template={selectedTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      <TemplateEditSheet
        template={selectedTemplate}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={(updatedTemplate) => {
          console.log('Saving template:', updatedTemplate);
          setIsEditOpen(false);
        }}
      />

      <ApplyTemplateDialog
        template={selectedTemplate}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onApply={(templateId, domainId) => {
          console.log('Applying template:', templateId, 'to domain:', domainId);
          setIsApplyOpen(false);
        }}
      />

      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </>
  );
};

export default TemplateGallery;
