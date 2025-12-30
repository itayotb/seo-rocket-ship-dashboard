
import React, { useState, useMemo } from 'react';
import { WebsiteCreationData } from '@/types/websiteCreation';
import { useToast } from '@/hooks/use-toast';
import { getTemplatesForCategory, ALL_TEMPLATES } from '@/utils/templateData';
import TemplateSearchFilter from './TemplateSearchFilter';
import TemplateGrid from './TemplateGrid';

interface WebsiteStepFourProps {
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
}

const WebsiteStepFour = ({ data, onUpdate }: WebsiteStepFourProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { toast } = useToast();

  // Get all templates and filter them based on search and category
  const filteredTemplates = useMemo(() => {
    let templates = ALL_TEMPLATES;
    
    // Filter by category
    if (filterCategory !== 'all') {
      templates = templates.filter(template => template.category === filterCategory);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.features.some(feature => feature.toLowerCase().includes(searchLower))
      );
    }
    
    return templates;
  }, [searchTerm, filterCategory]);

  const handleTemplateSelect = (templateId: string) => {
    onUpdate({ template: templateId });
    toast({
      title: "Template Selected",
      description: "Template has been applied to your website.",
    });
  };

  return (
    <div className="space-y-6">
      <TemplateSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
      />
      
      <TemplateGrid
        templates={filteredTemplates}
        selectedTemplate={data.template}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
};

export default WebsiteStepFour;
