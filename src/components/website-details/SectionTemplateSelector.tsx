
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  HelpCircle, 
  Star, 
  MessageSquare, 
  List, 
  CheckCircle, 
  Users,
  FileText
} from 'lucide-react';
import { sectionTemplates } from '@/utils/sectionTemplates';

interface SectionTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const iconMap = {
  HelpCircle,
  Star,
  MessageSquare,
  List,
  CheckCircle,
  Users,
  FileText
};

const SectionTemplateSelector: React.FC<SectionTemplateSelectorProps> = ({ 
  selectedTemplate, 
  onTemplateSelect 
}) => {
  return (
    <div className="space-y-4">
      <Label>Choose Section Type</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sectionTemplates.map((template) => {
          const IconComponent = iconMap[template.icon as keyof typeof iconMap];
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : ''
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                  {template.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {template.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SectionTemplateSelector;
