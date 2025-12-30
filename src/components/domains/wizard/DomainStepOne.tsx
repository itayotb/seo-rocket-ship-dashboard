
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DomainStepOneProps {
  domainName: string;
  onDomainNameChange: (domain: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}

const DOMAIN_CATEGORIES = [
  { value: 'business', label: 'Business' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'blog', label: 'Blog' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'news', label: 'News/Media' },
  { value: 'educational', label: 'Educational' },
  { value: 'nonprofit', label: 'Non-profit' },
  { value: 'other', label: 'Other' }
];

const DomainStepOne = ({ domainName, onDomainNameChange, category, onCategoryChange }: DomainStepOneProps) => {
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const handleCategorySelect = (value: string) => {
    if (value === 'custom') {
      setShowCustomCategory(true);
    } else {
      setShowCustomCategory(false);
      onCategoryChange(value);
    }
  };

  const handleCustomCategoryAdd = () => {
    if (customCategory.trim()) {
      onCategoryChange(customCategory.trim());
      setCustomCategory('');
      setShowCustomCategory(false);
    }
  };

  const handleCustomCategoryCancel = () => {
    setShowCustomCategory(false);
    setCustomCategory('');
    // Reset to a default category if no category was selected
    if (!category) {
      onCategoryChange('business');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="domain">Domain Name</Label>
        <Input
          id="domain"
          value={domainName}
          onChange={(e) => onDomainNameChange(e.target.value)}
          placeholder="example.com"
          className="mt-1"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter your domain without http:// or www
        </p>
      </div>
      
      <div>
        <Label htmlFor="category">Domain Category</Label>
        {!showCustomCategory ? (
          <Select value={category} onValueChange={handleCategorySelect}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {DOMAIN_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
              <SelectItem value="custom">
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Custom Category</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex space-x-2 mt-1">
            <Input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category"
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCustomCategoryAdd();
                }
              }}
            />
            <Button onClick={handleCustomCategoryAdd} size="sm" disabled={!customCategory.trim()}>
              Add
            </Button>
            <Button 
              onClick={handleCustomCategoryCancel} 
              variant="outline" 
              size="sm"
            >
              Cancel
            </Button>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {showCustomCategory 
            ? "Enter a custom category name for your domain"
            : "Choose the type of website this domain will be used for, or add a custom category"
          }
        </p>
      </div>
    </div>
  );
};

export default DomainStepOne;
