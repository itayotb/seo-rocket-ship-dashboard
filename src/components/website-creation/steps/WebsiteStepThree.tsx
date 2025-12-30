
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { WebsiteCreationData } from '@/types/websiteCreation';
import { LeadForm } from '@/types/leadForm';
import { ALL_TEMPLATES } from '@/utils/templates';
import TemplateSearchFilter from './TemplateSearchFilter';
import TemplateGrid from './TemplateGrid';

interface WebsiteStepThreeProps {
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
  leadForms?: LeadForm[];
}

const WebsiteStepThree = ({ data, onUpdate, leadForms = [] }: WebsiteStepThreeProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState(data.category || 'all');
  
  const filteredTemplates = ALL_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.features.some(feature => 
                           feature.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort templates: user's category first, then by popularity (mock)
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (a.category === data.category && b.category !== data.category) return -1;
    if (b.category === data.category && a.category !== data.category) return 1;
    return 0;
  });

  const selectTemplate = (templateId: string) => {
    // Auto-select lead form if template has one associated
    const associatedLeadForm = leadForms.find(form => form.templateId === templateId);
    onUpdate({ 
      template: templateId,
      leadFormId: associatedLeadForm?.id || data.leadFormId
    });
  };

  const categoryTemplates = sortedTemplates.filter(t => t.category === data.category);
  const otherTemplates = sortedTemplates.filter(t => t.category !== data.category);

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Choose a Template</Label>
        <p className="text-sm text-gray-500 mt-1">
          Browse all available templates or filter by category
        </p>
      </div>

      <TemplateSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
      />

      {categoryTemplates.length > 0 && filterCategory === 'all' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
              Recommended for {data.category}
            </h3>
            <p className="text-sm text-gray-500">Templates that match your category</p>
          </div>
          <TemplateGrid
            templates={categoryTemplates}
            selectedTemplate={data.template}
            onSelectTemplate={selectTemplate}
          />
        </div>
      )}

      {(filterCategory !== 'all' || otherTemplates.length > 0) && (
        <div className="space-y-4">
          {filterCategory === 'all' && categoryTemplates.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                Other Templates
              </h3>
              <p className="text-sm text-gray-500">Explore all available templates</p>
            </div>
          )}
          <TemplateGrid
            templates={filterCategory === 'all' ? otherTemplates : sortedTemplates}
            selectedTemplate={data.template}
            onSelectTemplate={selectTemplate}
          />
        </div>
      )}

      {sortedTemplates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No templates found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default WebsiteStepThree;
