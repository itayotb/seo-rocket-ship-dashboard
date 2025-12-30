
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2 } from 'lucide-react';
import { WebsiteCreationData } from '@/types/websiteCreation';

interface WebsiteStepTwoPointFiveProps {
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
}

const WebsiteStepTwoPointFive = ({ data, onUpdate }: WebsiteStepTwoPointFiveProps) => {
  const [customPrompt, setCustomPrompt] = useState(data.aiPrompt || '');

  const handleCustomPromptChange = (value: string) => {
    setCustomPrompt(value);
    onUpdate({ aiPrompt: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Wand2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          AI Content Customization
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Tell our AI how to customize your website content and design
        </p>
      </div>

      <div>
        <Label htmlFor="aiPrompt">AI Customization Prompt</Label>
        <Textarea
          id="aiPrompt"
          value={customPrompt}
          onChange={(e) => handleCustomPromptChange(e.target.value)}
          placeholder="Describe how you want your website to look, feel, and function..."
          className="mt-1 min-h-[120px]"
          rows={5}
        />
        <p className="text-sm text-gray-500 mt-1">
          Be specific about your goals, target audience, design preferences, and functionality needs
        </p>
      </div>

      {data.keywords.length > 0 && (
        <div>
          <Label className="text-base font-medium">Your Keywords</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            These keywords will be incorporated into your website content
          </p>
        </div>
      )}
    </div>
  );
};

export default WebsiteStepTwoPointFive;
