
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Wand2, 
  Plus, 
  X, 
  Target,
  Clock,
  RefreshCw,
  FileText,
  Lightbulb
} from 'lucide-react';
import { ContentItem } from '@/types/website';

interface AiBlogPageGeneratorProps {
  onPageGenerated: (newPage: ContentItem) => void;
  onClose: () => void;
}

type GenerationStep = 'input' | 'generating' | 'review' | 'complete';

interface GeneratedContent {
  title: string;
  url: string;
  metaDescription: string;
  content: string;
  keywords: string[];
}

const AiBlogPageGenerator: React.FC<AiBlogPageGeneratorProps> = ({ 
  onPageGenerated, 
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState<GenerationStep>('input');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentType, setContentType] = useState('informative');
  const [tone, setTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !keywords.includes(keyword)) {
      setKeywords(prev => [...prev, keyword]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword));
  };

  const generateContent = async () => {
    if (keywords.length === 0) {
      toast({
        title: "Missing Keywords",
        description: "Please add at least one keyword to generate content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generating');
    setGenerationProgress(0);

    try {
      // Simulate AI content generation with progress updates
      const steps = [
        { message: "Analyzing keywords...", progress: 20 },
        { message: "Generating title and URL...", progress: 40 },
        { message: "Creating meta description...", progress: 60 },
        { message: "Writing content...", progress: 80 },
        { message: "Optimizing for SEO...", progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(step.progress);
      }

      // Mock AI-generated content
      const primaryKeyword = keywords[0];
      const title = `The Ultimate Guide to ${primaryKeyword}: Everything You Need to Know`;
      const url = `/blog/${primaryKeyword.toLowerCase().replace(/\s+/g, '-')}-guide`;
      const metaDescription = `Discover everything about ${primaryKeyword}. This comprehensive guide covers best practices, tips, and expert insights for ${targetAudience || 'professionals'}.`;
      
      const content = `# ${title}

## Introduction

Welcome to our comprehensive guide on ${primaryKeyword}. Whether you're a beginner or looking to enhance your knowledge, this article will provide valuable insights and practical advice.

## What is ${primaryKeyword}?

${primaryKeyword} is a crucial concept that plays a significant role in modern business and technology. Understanding its fundamentals is essential for ${targetAudience || 'anyone in the field'}.

## Key Benefits of ${primaryKeyword}

1. **Enhanced Efficiency**: Implementing ${primaryKeyword} strategies can significantly improve your workflow and productivity.

2. **Cost-Effective Solutions**: Proper utilization of ${primaryKeyword} can lead to substantial cost savings and better resource allocation.

3. **Competitive Advantage**: Mastering ${primaryKeyword} gives you an edge over competitors who haven't embraced these practices.

## Best Practices for ${primaryKeyword}

### Getting Started

When beginning your ${primaryKeyword} journey, it's important to:

- Research thoroughly and understand the basics
- Start with small, manageable implementations
- Monitor results and adjust strategies accordingly
- Stay updated with industry trends and developments

### Advanced Techniques

For those ready to take their ${primaryKeyword} skills to the next level:

- Implement automation where possible
- Integrate with existing systems and workflows
- Measure and analyze performance metrics
- Continuously optimize based on data insights

## Common Challenges and Solutions

Many professionals face challenges when implementing ${primaryKeyword}. Here are some common issues and their solutions:

**Challenge 1**: Limited resources or budget constraints
**Solution**: Start with free or low-cost tools and gradually scale up as you see results.

**Challenge 2**: Lack of technical expertise
**Solution**: Invest in training or consider partnering with experts in the field.

**Challenge 3**: Resistance to change within the organization
**Solution**: Demonstrate value through small wins and educate stakeholders on benefits.

## Future Trends in ${primaryKeyword}

The landscape of ${primaryKeyword} is constantly evolving. Key trends to watch include:

- Increased automation and AI integration
- Greater emphasis on data-driven decision making
- Enhanced focus on user experience and personalization
- Growing importance of sustainability and ethical practices

## Conclusion

${primaryKeyword} represents a significant opportunity for growth and improvement. By understanding the fundamentals, implementing best practices, and staying ahead of trends, you can leverage ${primaryKeyword} to achieve your goals.

Remember, success with ${primaryKeyword} requires patience, continuous learning, and adaptation. Start with the basics, be consistent in your efforts, and don't be afraid to experiment with new approaches.

## Additional Resources

- Industry reports and whitepapers
- Online courses and certification programs
- Professional communities and forums
- Expert blogs and publications

Ready to implement ${primaryKeyword} in your organization? Start with these actionable steps and watch your results improve over time.`;

      const generated: GeneratedContent = {
        title,
        url,
        metaDescription,
        content,
        keywords
      };

      setGeneratedContent(generated);
      setCurrentStep('review');
      
      toast({
        title: "Content Generated",
        description: "Your AI-powered blog page has been successfully created!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
      setCurrentStep('input');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;

    const newPage: ContentItem = {
      id: `ai-${Date.now()}`,
      type: 'post',
      title: generatedContent.title,
      url: generatedContent.url,
      status: 'draft',
      seoScore: 85, // AI-generated content starts with good SEO
      lastModified: 'Just now',
      content: generatedContent.content,
      metaDescription: generatedContent.metaDescription,
      wordCount: generatedContent.content.split(/\s+/).filter(word => word.length > 0).length
    };

    onPageGenerated(newPage);
    setCurrentStep('complete');
    
    toast({
      title: "Page Created",
      description: "Your new blog page has been added to the content library.",
    });
  };

  const resetGenerator = () => {
    setCurrentStep('input');
    setKeywords([]);
    setKeywordInput('');
    setTargetAudience('');
    setContentType('informative');
    setTone('professional');
    setGeneratedContent(null);
    setGenerationProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Wand2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Blog Page Generator</h2>
            <p className="text-sm text-gray-500">Create SEO-optimized blog pages with AI</p>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-2">
        {['input', 'generating', 'review', 'complete'].map((step, index) => (
          <div key={step} className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === step 
                ? 'bg-blue-600 text-white' 
                : index < ['input', 'generating', 'review', 'complete'].indexOf(currentStep)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-500'
            }`}>
              {index + 1}
            </div>
            {index < 3 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 'input' && (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Content Configuration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Provide keywords and preferences to generate your AI-powered blog page.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Target Keywords</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Enter a keyword or phrase"
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                />
                <Button onClick={addKeyword} disabled={!keywordInput.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
                      <span>{keyword}</span>
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Target Audience</Label>
                <Input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., small business owners, developers"
                />
              </div>
              <div>
                <Label>Content Type</Label>
                <select 
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="informative">Informative Guide</option>
                  <option value="howto">How-To Tutorial</option>
                  <option value="comparison">Comparison Article</option>
                  <option value="listicle">List Article</option>
                  <option value="opinion">Opinion Piece</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Writing Tone</Label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="authoritative">Authoritative</option>
                <option value="friendly">Friendly</option>
                <option value="technical">Technical</option>
              </select>
            </div>
          </div>

          <Button 
            onClick={generateContent} 
            disabled={keywords.length === 0}
            className="w-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Blog Page with AI
          </Button>
        </div>
      )}

      {currentStep === 'generating' && (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="font-medium mb-2">Generating Your Blog Page</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                AI is creating SEO-optimized content based on your keywords...
              </p>
              <Progress value={generationProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">{generationProgress}% complete</p>
            </div>
          </div>
        </div>
      )}

      {currentStep === 'review' && generatedContent && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Generated Content Preview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Review the AI-generated content and make any necessary adjustments.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={generatedContent.title} readOnly className="bg-gray-50" />
            </div>
            
            <div>
              <Label>URL Slug</Label>
              <Input value={generatedContent.url} readOnly className="bg-gray-50" />
            </div>
            
            <div>
              <Label>Meta Description</Label>
              <Textarea value={generatedContent.metaDescription} readOnly className="bg-gray-50" rows={2} />
            </div>
            
            <div>
              <Label>Content Preview (First 500 characters)</Label>
              <Textarea 
                value={generatedContent.content.substring(0, 500) + '...'} 
                readOnly 
                className="bg-gray-50" 
                rows={8} 
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                <Target className="h-3 w-3 mr-1" />
                {generatedContent.keywords.length} keywords
              </Badge>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {Math.ceil(generatedContent.content.split(/\s+/).length / 200)} min read
              </Badge>
              <Badge variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                {generatedContent.content.split(/\s+/).length} words
              </Badge>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleSave} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add to Content Library
            </Button>
            <Button variant="outline" onClick={resetGenerator}>
              Generate New
            </Button>
          </div>
        </div>
      )}

      {currentStep === 'complete' && (
        <div className="text-center space-y-4">
          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-medium mb-2">Blog Page Created Successfully!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Your AI-generated blog page has been added to the content management system.
            </p>
            <div className="flex space-x-3 justify-center">
              <Button onClick={resetGenerator}>
                Create Another Page
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close Generator
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiBlogPageGenerator;
