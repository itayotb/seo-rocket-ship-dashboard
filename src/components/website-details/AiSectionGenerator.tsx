
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { SectionGenerationOptions, GeneratedSection } from '@/types/aiSection';
import { sectionTemplates } from '@/utils/sectionTemplates';
import { generateSection } from '@/utils/aiSectionGenerator';
import SectionTemplateSelector from './SectionTemplateSelector';
import GenerationOptions from './GenerationOptions';
import AiUsageTips from './AiUsageTips';

interface AiSectionGeneratorProps {
  onSectionGenerated: (section: GeneratedSection) => void;
}

const AiSectionGenerator: React.FC<AiSectionGeneratorProps> = ({ onSectionGenerated }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'technical'>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = sectionTemplates.find(t => t.id === templateId);
    if (template) {
      setPrompt(template.defaultPrompt);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a section type and enter a prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const options: SectionGenerationOptions = {
        sectionType: selectedTemplate,
        prompt: prompt.trim(),
        length,
        tone
      };
      
      const generatedSection = await generateSection(options);
      onSectionGenerated(generatedSection);
      
      // Reset form
      setSelectedTemplate('');
      setPrompt('');
      
      toast({
        title: "Section Generated",
        description: "New section has been added to your content.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          AI Section Generator
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Generate new content sections like FAQs, features, testimonials, and more using AI.
        </p>
      </div>

      <SectionTemplateSelector 
        selectedTemplate={selectedTemplate}
        onTemplateSelect={handleTemplateSelect}
      />

      {selectedTemplate && (
        <GenerationOptions
          prompt={prompt}
          length={length}
          tone={tone}
          isGenerating={isGenerating}
          onPromptChange={setPrompt}
          onLengthChange={setLength}
          onToneChange={setTone}
          onGenerate={handleGenerate}
        />
      )}

      <AiUsageTips />
    </div>
  );
};

export default AiSectionGenerator;
