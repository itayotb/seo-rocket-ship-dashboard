
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Calendar } from 'lucide-react';
import { ReportTemplate, ReportFilters as ReportFiltersType } from '@/types/reports';
import { useToast } from '@/hooks/use-toast';

interface ReportFiltersProps {
  template: ReportTemplate;
  filters: ReportFiltersType;
  onFiltersChange: (filters: ReportFiltersType) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  template,
  filters,
  onFiltersChange
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock website data
  const availableWebsites = [
    { id: '1', name: 'techcorp.com', domain: 'techcorp.com' },
    { id: '2', name: 'ecommercepro.com', domain: 'ecommercepro.com' },
    { id: '3', name: 'healthwellness.com', domain: 'healthwellness.com' },
    { id: '4', name: 'digitalmarketinghub.com', domain: 'digitalmarketinghub.com' }
  ];

  const handleWebsiteToggle = (websiteId: string, checked: boolean) => {
    const updatedWebsites = checked
      ? [...filters.websites, websiteId]
      : filters.websites.filter(id => id !== websiteId);
    
    onFiltersChange({
      ...filters,
      websites: updatedWebsites
    });
  };

  const handleGenerateReport = async (format: 'pdf' | 'csv') => {
    if (filters.websites.length === 0) {
      toast({
        title: "No websites selected",
        description: "Please select at least one website to generate a report.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Report generated successfully",
        description: `Your ${template.name} has been generated in ${format.toUpperCase()} format.`,
      });
    } catch (error) {
      toast({
        title: "Error generating report",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Configure Report: {template.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeframe Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Time Period</label>
          <Select 
            value={filters.timeframe} 
            onValueChange={(value: any) => onFiltersChange({ ...filters, timeframe: value })}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Website Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Select Websites</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableWebsites.map((website) => (
              <div key={website.id} className="flex items-center space-x-2">
                <Checkbox
                  id={website.id}
                  checked={filters.websites.includes(website.id)}
                  onCheckedChange={(checked) => handleWebsiteToggle(website.id, checked as boolean)}
                />
                <label htmlFor={website.id} className="text-sm cursor-pointer">
                  {website.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Report Buttons */}
        <div className="flex items-center space-x-3 pt-4 border-t">
          <Button
            onClick={() => handleGenerateReport('pdf')}
            disabled={isGenerating || filters.websites.length === 0}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{isGenerating ? 'Generating...' : 'Generate PDF'}</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleGenerateReport('csv')}
            disabled={isGenerating || filters.websites.length === 0}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{isGenerating ? 'Generating...' : 'Export CSV'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
