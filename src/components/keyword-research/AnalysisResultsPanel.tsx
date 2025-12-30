
import React from 'react';
import { AnalyzedKeyword } from '@/types/keywordResearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  X,
  Sparkles,
  FileText,
  BookOpen,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AnalysisResultsPanelProps {
  results: AnalyzedKeyword[];
  onClose: () => void;
}

const getDifficultyColor = (label: string) => {
  switch (label) {
    case 'easy': return 'bg-green-500 text-white';
    case 'medium': return 'bg-yellow-500 text-white';
    case 'hard': return 'bg-red-500 text-white';
    default: return 'bg-muted';
  }
};

const getDifficultyLabel = (label: string) => {
  switch (label) {
    case 'easy': return 'Easy';
    case 'medium': return 'Medium';
    case 'hard': return 'Hard';
    default: return label;
  }
};

const getScoreColor = (score: number) => {
  if (score <= 40) return 'text-green-500';
  if (score <= 60) return 'text-yellow-500';
  return 'text-red-500';
};

const getSiteTypeInfo = (type: string) => {
  switch (type) {
    case 'small_site': 
      return {
        label: 'Small Site',
        description: 'Up to 5 pages',
        icon: FileText,
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    case 'mini_site': 
      return {
        label: 'Mini Site',
        description: 'Up to 20 pages',
        icon: Building2,
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    case 'authority_blog': 
      return {
        label: 'Authority Blog',
        description: 'Blog with many articles',
        icon: BookOpen,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      };
    default: 
      return {
        label: type,
        description: '',
        icon: FileText,
        color: 'bg-muted'
      };
  }
};

const ScoreCell: React.FC<{ score: number; label: string }> = ({ score, label }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col items-center gap-1">
          <span className={`font-semibold ${getScoreColor(score)}`}>{score}</span>
          <Progress value={score} className="h-1 w-12" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}: {score}/100</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const AnalysisResultsPanel: React.FC<AnalysisResultsPanelProps> = ({ results, onClose }) => {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                AI Analysis Results
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {results.length} keyword{results.length !== 1 ? 's' : ''} analyzed with AI recommendations
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Keyword</TableHead>
                <TableHead className="text-center font-semibold">Volume</TableHead>
                <TableHead className="text-center font-semibold">Difficulty</TableHead>
                <TableHead className="text-center font-semibold">Domain</TableHead>
                <TableHead className="text-center font-semibold">Backlinks</TableHead>
                <TableHead className="text-center font-semibold">Content</TableHead>
                <TableHead className="text-center font-semibold">SERP</TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Recommendation
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => {
                const siteInfo = getSiteTypeInfo(result.analysis.recommendedSiteType);
                const SiteIcon = siteInfo.icon;
                
                return (
                  <TableRow key={result.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="font-medium">{result.keyword}</div>
                      <div className="flex gap-1 mt-1">
                        {result.analysis.intent.serpLocked && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            SERP Locked
                          </Badge>
                        )}
                        {result.analysis.intent.local && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            Local
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{result.volume.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xl font-bold ${getScoreColor(result.analysis.difficultyScore)}`}>
                          {result.analysis.difficultyScore}
                        </span>
                        <Badge className={`text-xs ${getDifficultyColor(result.analysis.difficultyLabel)}`}>
                          {getDifficultyLabel(result.analysis.difficultyLabel)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ScoreCell score={result.analysis.domainPower.score} label="Domain Power" />
                    </TableCell>
                    <TableCell>
                      <ScoreCell score={result.analysis.backlinks.score} label="Backlinks" />
                    </TableCell>
                    <TableCell>
                      <ScoreCell score={result.analysis.contentQualityScore} label="Content Quality" />
                    </TableCell>
                    <TableCell>
                      <ScoreCell score={result.analysis.serpStabilityScore} label="SERP Stability" />
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${siteInfo.color}`}>
                        <SiteIcon className="h-4 w-4 shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{siteInfo.label}</div>
                          <div className="text-xs opacity-80">{siteInfo.description}</div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI Site Type Recommendations:</span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-green-600" />
              <span><strong>Small Site</strong> - Up to 5 pages (low competition)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-blue-600" />
              <span><strong>Mini Site</strong> - Up to 20 pages (medium competition)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-purple-600" />
              <span><strong>Authority Blog</strong> - Many articles needed (high competition)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsPanel;
