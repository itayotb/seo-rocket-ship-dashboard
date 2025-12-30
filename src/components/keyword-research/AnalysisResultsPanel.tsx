
import React from 'react';
import { AnalyzedKeyword } from '@/types/keywordResearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Link2, 
  FileText, 
  Target, 
  Gauge, 
  Shield, 
  BarChart3,
  Building,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalysisResultsPanelProps {
  results: AnalyzedKeyword[];
  onClose: () => void;
}

const getDifficultyColor = (label: string) => {
  switch (label) {
    case 'easy': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'hard': return 'bg-red-500';
    default: return 'bg-muted';
  }
};

const getScoreColor = (score: number) => {
  if (score <= 40) return 'text-green-500';
  if (score <= 60) return 'text-yellow-500';
  return 'text-red-500';
};

const getSiteTypeLabel = (type: string) => {
  switch (type) {
    case 'small_site': return 'Small Site';
    case 'mini_site': return 'Mini Site';
    case 'authority_blog': return 'Authority Blog';
    default: return type;
  }
};

const ScoreBar: React.FC<{ label: string; score: number; icon: React.ReactNode }> = ({ label, score, icon }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className={`font-medium ${getScoreColor(score)}`}>{score}</span>
    </div>
    <Progress value={score} className="h-1.5" />
  </div>
);

const AnalysisResultsPanel: React.FC<AnalysisResultsPanelProps> = ({ results, onClose }) => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analysis Results
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {results.length} keyword{results.length !== 1 ? 's' : ''} analyzed
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.id} className="border-border/50">
                <CardContent className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-foreground">{result.keyword}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">Vol: {result.volume.toLocaleString()}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getDifficultyColor(result.analysis.difficultyLabel)} text-white`}
                        >
                          {result.analysis.difficultyLabel}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(result.analysis.difficultyScore)}`}>
                        {result.analysis.difficultyScore}
                      </div>
                      <div className="text-xs text-muted-foreground">Difficulty</div>
                    </div>
                  </div>

                  {/* Recommended Site Type */}
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <Building className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Recommended: <span className="font-medium">{getSiteTypeLabel(result.analysis.recommendedSiteType)}</span>
                    </span>
                  </div>

                  {/* Score Bars */}
                  <div className="space-y-3">
                    <ScoreBar 
                      label="Domain Power" 
                      score={result.analysis.domainPower.score} 
                      icon={<TrendingUp className="h-3.5 w-3.5" />} 
                    />
                    <ScoreBar 
                      label="Backlinks" 
                      score={result.analysis.backlinks.score} 
                      icon={<Link2 className="h-3.5 w-3.5" />} 
                    />
                    <ScoreBar 
                      label="Page Power" 
                      score={result.analysis.pagePower.score} 
                      icon={<FileText className="h-3.5 w-3.5" />} 
                    />
                    <ScoreBar 
                      label="Intent Score" 
                      score={result.analysis.intent.score} 
                      icon={<Target className="h-3.5 w-3.5" />} 
                    />
                    <ScoreBar 
                      label="Content Quality" 
                      score={result.analysis.contentQualityScore} 
                      icon={<Gauge className="h-3.5 w-3.5" />} 
                    />
                    <ScoreBar 
                      label="SERP Stability" 
                      score={result.analysis.serpStabilityScore} 
                      icon={<Shield className="h-3.5 w-3.5" />} 
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                    <Badge variant="outline" className="text-xs">
                      DR Avg: {result.analysis.domainPower.drAvgTop10}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      RD Avg: {result.analysis.backlinks.rdAvgDofollowTop10}
                    </Badge>
                    {result.analysis.intent.serpLocked && (
                      <Badge variant="destructive" className="text-xs">SERP Locked</Badge>
                    )}
                    {result.analysis.intent.local && (
                      <Badge variant="secondary" className="text-xs">Local</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsPanel;
