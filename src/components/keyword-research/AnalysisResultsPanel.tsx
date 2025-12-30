
import React, { useState, useMemo } from 'react';
import { AnalyzedKeyword, AnalysisParameter } from '@/types/keywordResearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  X,
  Sparkles,
  FileText,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Filter
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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

const getScoreColor = (score: number) => {
  if (score <= 40) return 'text-green-600';
  if (score <= 60) return 'text-yellow-600';
  return 'text-red-600';
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

const extractParameters = (result: AnalyzedKeyword): AnalysisParameter[] => {
  const { analysis } = result;
  return [
    // Domain Power - Top 5
    { key: 'drMinTop5', label: 'Min DR (Top 5)', value: analysis.domainPower.drMinTop5, category: 'domain' },
    { key: 'drAvgTop5', label: 'Avg DR (Top 5)', value: analysis.domainPower.drAvgTop5, category: 'domain' },
    { key: 'drMaxTop5', label: 'Max DR (Top 5)', value: analysis.domainPower.drMaxTop5, category: 'domain' },
    // Domain Power - Top 10
    { key: 'drMinTop10', label: 'Min DR (Top 10)', value: analysis.domainPower.drMinTop10, category: 'domain' },
    { key: 'drAvgTop10', label: 'Avg DR (Top 10)', value: analysis.domainPower.drAvgTop10, category: 'domain' },
    { key: 'drMaxTop10', label: 'Max DR (Top 10)', value: analysis.domainPower.drMaxTop10, category: 'domain' },
    { key: 'domainScore', label: 'Domain Power Score', value: analysis.domainPower.score, category: 'domain' },
    // Backlinks - Top 5
    { key: 'rdMinTop5', label: 'Min RD (Top 5)', value: analysis.backlinks.rdMinDofollowTop5, category: 'backlinks' },
    { key: 'rdAvgTop5', label: 'Avg RD (Top 5)', value: analysis.backlinks.rdAvgDofollowTop5, category: 'backlinks' },
    // Backlinks - Top 10
    { key: 'rdMinTop10', label: 'Min RD (Top 10)', value: analysis.backlinks.rdMinDofollowTop10, category: 'backlinks' },
    { key: 'rdAvgTop10', label: 'Avg RD (Top 10)', value: analysis.backlinks.rdAvgDofollowTop10, category: 'backlinks' },
    { key: 'refDomainsTraffic', label: 'Ref Domains Traffic', value: analysis.backlinks.refDomainsTrafficTotal, category: 'backlinks' },
    { key: 'backlinksScore', label: 'Backlinks Score', value: analysis.backlinks.score, category: 'backlinks' },
    // Page Power
    { key: 'urAvgTop5', label: 'Avg UR (Top 5)', value: analysis.pagePower.urAvgTop5, category: 'page' },
    { key: 'urAvgTop10', label: 'Avg UR (Top 10)', value: analysis.pagePower.urAvgTop10, category: 'page' },
    { key: 'pageScore', label: 'Page Power Score', value: analysis.pagePower.score, category: 'page' },
    // Intent
    { key: 'intentScore', label: 'Intent Score', value: analysis.intent.score, category: 'intent' },
    // Other Scores
    { key: 'contentQuality', label: 'Content Quality', value: analysis.contentQualityScore, category: 'scores' },
    { key: 'uxTrust', label: 'UX Trust', value: analysis.uxTrustScore, category: 'scores' },
    { key: 'serpStability', label: 'SERP Stability', value: analysis.serpStabilityScore, category: 'scores' },
    { key: 'difficulty', label: 'Difficulty Score', value: analysis.difficultyScore, category: 'scores' },
  ];
};

type SortOrder = 'none' | 'asc' | 'desc';
type CategoryFilter = 'all' | 'domain' | 'backlinks' | 'page' | 'intent' | 'scores';

const AnalysisResultsPanel: React.FC<AnalysisResultsPanelProps> = ({ results, onClose }) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const expandAll = () => {
    setExpandedRows(new Set(results.map(r => r.id)));
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  const getFilteredAndSortedParams = (result: AnalyzedKeyword) => {
    let params = extractParameters(result);
    
    // Filter by category
    if (categoryFilter !== 'all') {
      params = params.filter(p => p.category === categoryFilter);
    }
    
    // Sort
    if (sortOrder === 'desc') {
      params.sort((a, b) => b.value - a.value);
    } else if (sortOrder === 'asc') {
      params.sort((a, b) => a.value - b.value);
    }
    
    return params;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'domain': return 'bg-blue-100 text-blue-800';
      case 'backlinks': return 'bg-purple-100 text-purple-800';
      case 'page': return 'bg-green-100 text-green-800';
      case 'intent': return 'bg-orange-100 text-orange-800';
      case 'scores': return 'bg-gray-100 text-gray-800';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Analysis Results</CardTitle>
              <p className="text-sm text-muted-foreground">
                {results.length} keyword{results.length !== 1 ? 's' : ''} analyzed
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              <ChevronDown className="h-4 w-4 mr-1" />
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              <ChevronUp className="h-4 w-4 mr-1" />
              Collapse All
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="domain">Domain Power</SelectItem>
                <SelectItem value="backlinks">Backlinks</SelectItem>
                <SelectItem value="page">Page Power</SelectItem>
                <SelectItem value="intent">Intent</SelectItem>
                <SelectItem value="scores">Scores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant={sortOrder === 'desc' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')}
            >
              <ArrowDownWideNarrow className="h-4 w-4 mr-1" />
              High to Low
            </Button>
            <Button 
              variant={sortOrder === 'asc' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')}
            >
              <ArrowUpNarrowWide className="h-4 w-4 mr-1" />
              Low to High
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {results.map((result) => {
            const siteInfo = getSiteTypeInfo(result.analysis.recommendedSiteType);
            const SiteIcon = siteInfo.icon;
            const isExpanded = expandedRows.has(result.id);
            const params = getFilteredAndSortedParams(result);

            return (
              <Collapsible key={result.id} open={isExpanded} onOpenChange={() => toggleRow(result.id)}>
                <Card className="border-border/50">
                  <CollapsibleTrigger asChild>
                    <div className="p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Keyword Info */}
                          <div className="min-w-[200px]">
                            <h4 className="font-medium">{result.keyword}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">Vol: {result.volume.toLocaleString()}</span>
                              {result.analysis.intent.serpLocked && (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">SERP Locked</Badge>
                              )}
                              {result.analysis.intent.local && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Local</Badge>
                              )}
                            </div>
                          </div>

                          {/* Key Metrics */}
                          <div className="hidden md:flex items-center gap-6 text-sm">
                            <div className="text-center">
                              <div className={`text-lg font-bold ${getScoreColor(result.analysis.difficultyScore)}`}>
                                {result.analysis.difficultyScore}
                              </div>
                              <div className="text-xs text-muted-foreground">Difficulty</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{result.analysis.domainPower.drAvgTop10}</div>
                              <div className="text-xs text-muted-foreground">Avg DR</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{result.analysis.domainPower.drMinTop10}</div>
                              <div className="text-xs text-muted-foreground">Min DR</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{result.analysis.backlinks.rdAvgDofollowTop10}</div>
                              <div className="text-xs text-muted-foreground">Avg RD</div>
                            </div>
                          </div>

                          {/* AI Recommendation */}
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${siteInfo.color}`}>
                            <Sparkles className="h-3.5 w-3.5" />
                            <SiteIcon className="h-4 w-4 shrink-0" />
                            <div>
                              <div className="font-medium text-sm">{siteInfo.label}</div>
                              <div className="text-xs opacity-80">{siteInfo.description}</div>
                            </div>
                          </div>
                        </div>

                        {/* Expand Button */}
                        <Button variant="ghost" size="sm" className="ml-2">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          <span className="ml-1 text-xs">{isExpanded ? 'Hide' : 'Show'} All</span>
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-2 border-t">
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">Parameter</TableHead>
                              <TableHead className="font-semibold">Category</TableHead>
                              <TableHead className="text-right font-semibold">Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {params.map((param) => (
                              <TableRow key={param.key}>
                                <TableCell className="font-medium">{param.label}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(param.category)}`}>
                                    {param.category}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className={`font-semibold ${param.key.includes('Score') || param.key === 'difficulty' ? getScoreColor(param.value) : ''}`}>
                                    {param.value.toLocaleString()}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI Site Type Recommendations:</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-green-600" />
              <span><strong>Small Site</strong> - Up to 5 pages</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-blue-600" />
              <span><strong>Mini Site</strong> - Up to 20 pages</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-purple-600" />
              <span><strong>Authority Blog</strong> - Many articles</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsPanel;
