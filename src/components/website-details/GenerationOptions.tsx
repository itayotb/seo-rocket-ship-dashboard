
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, RefreshCw } from 'lucide-react';

interface GenerationOptionsProps {
  prompt: string;
  length: 'short' | 'medium' | 'long';
  tone: 'professional' | 'casual' | 'friendly' | 'technical';
  isGenerating: boolean;
  onPromptChange: (prompt: string) => void;
  onLengthChange: (length: 'short' | 'medium' | 'long') => void;
  onToneChange: (tone: 'professional' | 'casual' | 'friendly' | 'technical') => void;
  onGenerate: () => void;
}

const GenerationOptions: React.FC<GenerationOptionsProps> = ({
  prompt,
  length,
  tone,
  isGenerating,
  onPromptChange,
  onLengthChange,
  onToneChange,
  onGenerate
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="section-prompt">Content Description</Label>
        <Textarea
          id="section-prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe what you want in this section..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Content Length</Label>
          <Select value={length} onValueChange={onLengthChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Writing Tone</Label>
          <Select value={tone} onValueChange={onToneChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={onGenerate} 
        disabled={isGenerating || !prompt.trim()}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Generating Section...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Generate Section
          </>
        )}
      </Button>
    </div>
  );
};

export default GenerationOptions;
