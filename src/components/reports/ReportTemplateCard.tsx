
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Globe, Calendar, Users } from 'lucide-react';
import { ReportTemplate } from '@/types/reports';
import { cn } from '@/lib/utils';

interface ReportTemplateCardProps {
  template: ReportTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

const iconMap = {
  BarChart3,
  TrendingUp,
  Globe,
  Calendar,
  Users
};

const ReportTemplateCard: React.FC<ReportTemplateCardProps> = ({
  template,
  isSelected,
  onSelect
}) => {
  const Icon = iconMap[template.icon as keyof typeof iconMap] || BarChart3;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-blue-500 border-blue-500"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base">{template.name}</CardTitle>
            </div>
          </div>
          {template.includeCharts && (
            <Badge variant="secondary" className="text-xs">
              Charts
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {template.description}
        </p>
        <Button 
          size="sm" 
          className="w-full"
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? "Selected" : "Select Template"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportTemplateCard;
