
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Sparkles, CheckCircle2, Globe, Target } from 'lucide-react';
import { WebsiteCreationData, GEO_OPTIONS } from '@/types/websiteCreation';
import { analyzeSerpResults } from '@/utils/serpAnalysisMock';

interface WebsiteStepTwoProps {
  data: WebsiteCreationData;
  onUpdate: (updates: Partial<WebsiteCreationData>) => void;
}

const WebsiteStepTwo = ({ data, onUpdate }: WebsiteStepTwoProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!data.mainKeyword || !data.geo) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeSerpResults(data.mainKeyword, data.geo);
      onUpdate({
        serpAnalysis: result,
        keywords: result.relatedKeywords,
      });
    } catch (error) {
      console.error('SERP analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = data.mainKeyword?.trim() && data.geo;
  const hasAnalysis = data.serpAnalysis?.analyzed;

  return (
    <div className="space-y-6">
      {/* Main Keyword Input */}
      <div className="space-y-2">
        <Label htmlFor="mainKeyword" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Main Parent Keyword
        </Label>
        <Input
          id="mainKeyword"
          value={data.mainKeyword || ''}
          onChange={(e) => onUpdate({ mainKeyword: e.target.value })}
          placeholder="e.g., car loans, personal loans, mortgage..."
          className="text-lg"
        />
        <p className="text-sm text-muted-foreground">
          Enter your main keyword to analyze top Google results
        </p>
      </div>

      {/* GEO Selection */}
      <div className="space-y-2">
        <Label htmlFor="geo" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Target GEO
        </Label>
        <Select
          value={data.geo || ''}
          onValueChange={(value) => onUpdate({ geo: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select target country..." />
          </SelectTrigger>
          <SelectContent>
            {GEO_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Analyze Button */}
      <Button
        onClick={handleAnalyze}
        disabled={!canAnalyze || isAnalyzing}
        className="w-full"
        size="lg"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Analyzing Top 10 Results...
          </>
        ) : (
          <>
            <Search className="h-5 w-5 mr-2" />
            Analyze with AI Top Results
          </>
        )}
      </Button>

      {/* Analysis Results */}
      {hasAnalysis && data.serpAnalysis && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Success Message */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Analysis Complete!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Analyzed Top 10 results in Google SERP for "{data.mainKeyword}" in {GEO_OPTIONS.find(g => g.value === data.geo)?.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Sections */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Recommended Sections
              </CardTitle>
              <CardDescription>
                These sections appear most frequently in top-ranking pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.serpAnalysis.recommendedSections.map((section, index) => (
                  <Badge 
                    key={section} 
                    variant="secondary"
                    className="px-3 py-1.5"
                  >
                    {index + 1}. {section}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Keywords */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Related Keywords to Use
              </CardTitle>
              <CardDescription>
                Keywords found in top-ranking content for better SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.serpAnalysis.relatedKeywords.map((keyword) => (
                  <Badge 
                    key={keyword} 
                    variant="outline"
                    className="px-3 py-1"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WebsiteStepTwo;
