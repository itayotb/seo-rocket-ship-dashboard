import React, { useState, useMemo } from 'react';
import { AnalyzedKeyword } from '@/types/keywordResearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  X,
  Sparkles,
  FileText,
  BookOpen,
  Building2,
  Download,
  ArrowUpDown,
  Search,
  ChevronUp,
  ChevronDown,
  Layers,
  HelpCircle
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Column tooltips explaining each metric
const columnTooltips: Record<string, { title: string; description: string }> = {
  keyword: {
    title: 'Keyword',
    description: 'The search term being analyzed for SEO competition and ranking potential.'
  },
  geo: {
    title: 'GEO',
    description: 'Geographic location/country where the keyword search volume is measured.'
  },
  volume: {
    title: 'Search Volume',
    description: 'Average monthly search volume for this keyword. Higher volume = more potential traffic but often more competition.'
  },
  score: {
    title: 'Overall Score',
    description: 'Combined difficulty score (0-100) calculated from: Domain Power (33%) + Backlinks (33%) + Page Power (33%). Lower score = easier to rank.'
  },
  drAvg: {
    title: 'DR Average (Top 10)',
    description: 'Average Domain Rating of the top 10 ranking pages. DR measures overall domain authority on a 0-100 scale. Lower DR = weaker competition.'
  },
  drMin: {
    title: 'DR Minimum (Top 10)',
    description: 'Lowest Domain Rating among the top 10 results. Shows the weakest competitor currently ranking. If low, there\'s opportunity to compete.'
  },
  rdAvg: {
    title: 'Referring Domains Avg',
    description: 'Average number of unique dofollow referring domains (backlinks) to the top 10 pages. Fewer RDs = less link building required to compete.'
  },
  urAvg: {
    title: 'UR Average (Top 10)',
    description: 'Average URL Rating of top 10 pages. UR measures individual page authority (0-100). Lower UR = easier to outrank with quality content.'
  },
  domain: {
    title: 'Domain Score',
    description: 'Difficulty score based on domain authority metrics (DR avg, min, max). Calculated from how strong the competing domains are. 0-100, lower = easier.'
  },
  backlinks: {
    title: 'Backlinks Score',
    description: 'Difficulty score based on backlink requirements (referring domains count). Shows how many quality backlinks you\'ll need. 0-100, lower = easier.'
  },
  page: {
    title: 'Page Score',
    description: 'Difficulty score based on individual page strength (URL Rating). Indicates on-page optimization level of competitors. 0-100, lower = easier.'
  },
  intent: {
    title: 'Intent Score',
    description: 'Score based on search intent analysis. Commercial/Transactional = 80, Informational = 65, Navigational = 85, Mixed = 40. +10 if branded, +5 if local.'
  },
  siteType: {
    title: 'Recommended Site Type',
    description: 'Recommendation for the type of site needed to rank: Small Site (1-4 pages), Mini Site (up to 10 pages), or Authority Blog (content-heavy site).'
  },
  flags: {
    title: 'Flags',
    description: 'Special indicators: Local = has local search intent requiring geo-targeting.'
  }
};

export interface SelectedKeywordForBulk {
  keyword: string;
  geo: string;
}

interface AnalysisResultsPanelProps {
  results: AnalyzedKeyword[];
  onClose: () => void;
  onCreateBulkWebsites?: (keywords: SelectedKeywordForBulk[]) => void;
}

const getScoreColor = (score: number) => {
  if (score <= 35) return 'text-green-600';
  if (score <= 65) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number) => {
  if (score <= 35) return 'bg-green-100 text-green-800';
  if (score <= 65) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
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

type SortKey = 'keyword' | 'volume' | 'score' | 'drAvg' | 'drMin' | 'rdAvg' | 'urAvg' | 'siteType';
type SortOrder = 'asc' | 'desc';
type SiteTypeFilter = 'all' | 'small_site' | 'mini_site' | 'authority_blog';

const AnalysisResultsPanel: React.FC<AnalysisResultsPanelProps> = ({ results, onClose, onCreateBulkWebsites }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [siteTypeFilter, setSiteTypeFilter] = useState<SiteTypeFilter>('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    setSelectedIds(new Set(filteredAndSortedResults.map(r => r.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.keyword.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Site type filter
    if (siteTypeFilter !== 'all') {
      filtered = filtered.filter(r => r.analysis.recommendedSiteType === siteTypeFilter);
    }

    // Score filter based on difficultyScore
    if (scoreFilter !== 'all') {
      filtered = filtered.filter(r => {
        const score = r.analysis.difficultyScore;
        if (scoreFilter === 'easy') return score <= 35;
        if (scoreFilter === 'medium') return score > 35 && score <= 65;
        if (scoreFilter === 'hard') return score > 65;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortKey) {
        case 'keyword':
          aVal = a.keyword.toLowerCase();
          bVal = b.keyword.toLowerCase();
          break;
        case 'volume':
          aVal = a.volume;
          bVal = b.volume;
          break;
        case 'score':
          aVal = a.analysis.difficultyScore;
          bVal = b.analysis.difficultyScore;
          break;
        case 'drAvg':
          aVal = a.analysis.domainPower.drAvgTop10;
          bVal = b.analysis.domainPower.drAvgTop10;
          break;
        case 'drMin':
          aVal = a.analysis.domainPower.drMinTop10;
          bVal = b.analysis.domainPower.drMinTop10;
          break;
        case 'rdAvg':
          aVal = a.analysis.backlinks.rdAvgDofollowTop10;
          bVal = b.analysis.backlinks.rdAvgDofollowTop10;
          break;
        case 'urAvg':
          aVal = a.analysis.pagePower.urAvgTop10;
          bVal = b.analysis.pagePower.urAvgTop10;
          break;
        case 'siteType':
          aVal = a.analysis.recommendedSiteType;
          bVal = b.analysis.recommendedSiteType;
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    });

    return filtered;
  }, [results, searchQuery, sortKey, sortOrder, siteTypeFilter, scoreFilter]);

  const downloadCSV = () => {
    const headers = [
      'Keyword',
      'Volume',
      'Score',
      'DR Avg (Top 10)',
      'DR Min (Top 10)',
      'DR Max (Top 10)',
      'RD Avg (Top 10)',
      'RD Min (Top 10)',
      'UR Avg (Top 10)',
      'Domain Score',
      'Backlinks Score',
      'Page Score',
      'Intent Score',
      'SERP Stability',
      'Difficulty Score',
      'Difficulty Label',
      'Site Type',
      'Local'
    ];

    const rows = filteredAndSortedResults.map(r => {
      return [
        r.keyword,
        r.volume,
        Math.round(r.analysis.difficultyScore),
        r.analysis.domainPower.drAvgTop10,
        r.analysis.domainPower.drMinTop10,
        r.analysis.domainPower.drMaxTop10,
        r.analysis.backlinks.rdAvgDofollowTop10,
        r.analysis.backlinks.rdMinDofollowTop10,
        r.analysis.pagePower.urAvgTop10,
        r.analysis.domainPower.score,
        r.analysis.backlinks.score,
        r.analysis.pagePower.score,
        r.analysis.intent.score,
        r.analysis.serpStabilityScore,
        r.analysis.difficultyScore,
        r.analysis.difficultyLabel,
        getSiteTypeInfo(r.analysis.recommendedSiteType).label,
        r.analysis.intent.local ? 'Yes' : 'No'
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateBulkWebsites = () => {
    if (!onCreateBulkWebsites || selectedIds.size === 0) return;
    
    const selectedKeywords: SelectedKeywordForBulk[] = results
      .filter(r => selectedIds.has(r.id))
      .map(r => ({
        keyword: r.keyword,
        geo: r.country.toLowerCase()
      }));
    
    onCreateBulkWebsites(selectedKeywords);
  };

  const allSelected = filteredAndSortedResults.length > 0 && 
    filteredAndSortedResults.every(r => selectedIds.has(r.id));

  const SortHeader = ({ label, sortKeyValue, tooltipKey }: { label: string; sortKeyValue: SortKey; tooltipKey?: string }) => {
    const tooltip = columnTooltips[tooltipKey || sortKeyValue];
    return (
      <TableHead 
        className="cursor-pointer hover:bg-muted/50 select-none"
        onClick={() => handleSort(sortKeyValue)}
      >
        <div className="flex items-center gap-1">
          {label}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-semibold text-sm">{tooltip.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{tooltip.description}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {sortKey === sortKeyValue ? (
            sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-30" />
          )}
        </div>
      </TableHead>
    );
  };

  const StaticHeader = ({ label, tooltipKey }: { label: string; tooltipKey: string }) => {
    const tooltip = columnTooltips[tooltipKey];
    return (
      <TableHead>
        <div className="flex items-center gap-1">
          {label}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-semibold text-sm">{tooltip.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{tooltip.description}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableHead>
    );
  };

  return (
    <TooltipProvider>
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
                {filteredAndSortedResults.length} of {results.length} keyword{results.length !== 1 ? 's' : ''}
                {selectedIds.size > 0 && ` • ${selectedIds.size} selected`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && onCreateBulkWebsites && (
              <Button onClick={handleCreateBulkWebsites} className="bg-primary">
                <Layers className="h-4 w-4 mr-2" />
                Create {selectedIds.size} Websites in Bulk
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Selection Controls */}
        {onCreateBulkWebsites && (
          <div className="flex items-center gap-3 mt-3 p-3 bg-muted/30 rounded-lg">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All ({filteredAndSortedResults.length})
            </Button>
            {selectedIds.size > 0 && (
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear Selection
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              Select keywords to create websites in bulk
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={scoreFilter} onValueChange={(v) => setScoreFilter(v as typeof scoreFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="easy">Easy (≤35)</SelectItem>
              <SelectItem value="medium">Medium (36-65)</SelectItem>
              <SelectItem value="hard">Hard (&gt;65)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={siteTypeFilter} onValueChange={(v) => setSiteTypeFilter(v as SiteTypeFilter)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Site Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Site Types</SelectItem>
              <SelectItem value="small_site">Small Site</SelectItem>
              <SelectItem value="mini_site">Mini Site</SelectItem>
              <SelectItem value="authority_blog">Authority Blog</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {onCreateBulkWebsites && (
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={allSelected}
                        onCheckedChange={(checked) => checked ? selectAll() : clearSelection()}
                      />
                    </TableHead>
                  )}
                  <SortHeader label="Keyword" sortKeyValue="keyword" tooltipKey="keyword" />
                  <StaticHeader label="GEO" tooltipKey="geo" />
                  <SortHeader label="Volume" sortKeyValue="volume" tooltipKey="volume" />
                  <SortHeader label="Score" sortKeyValue="score" tooltipKey="score" />
                  <SortHeader label="DR Avg" sortKeyValue="drAvg" tooltipKey="drAvg" />
                  <SortHeader label="DR Min" sortKeyValue="drMin" tooltipKey="drMin" />
                  <SortHeader label="RD Avg" sortKeyValue="rdAvg" tooltipKey="rdAvg" />
                  <SortHeader label="UR Avg" sortKeyValue="urAvg" tooltipKey="urAvg" />
                  <StaticHeader label="Domain" tooltipKey="domain" />
                  <StaticHeader label="Backlinks" tooltipKey="backlinks" />
                  <StaticHeader label="Page" tooltipKey="page" />
                  <StaticHeader label="Intent" tooltipKey="intent" />
                  <SortHeader label="Site Type" sortKeyValue="siteType" tooltipKey="siteType" />
                  <StaticHeader label="Flags" tooltipKey="flags" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={onCreateBulkWebsites ? 15 : 14} className="text-center text-muted-foreground py-8">
                      No results match your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedResults.map((result) => {
                    const siteInfo = getSiteTypeInfo(result.analysis.recommendedSiteType);
                    const SiteIcon = siteInfo.icon;
                    const isSelected = selectedIds.has(result.id);

                    return (
                      <TableRow 
                        key={result.id} 
                        className={isSelected ? 'bg-primary/5' : ''}
                        onClick={() => onCreateBulkWebsites && toggleSelection(result.id)}
                        style={{ cursor: onCreateBulkWebsites ? 'pointer' : 'default' }}
                      >
                        {onCreateBulkWebsites && (
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox 
                              checked={isSelected}
                              onCheckedChange={() => toggleSelection(result.id)}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium max-w-[200px] truncate" title={result.keyword}>
                          {result.keyword}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{result.country.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>{result.volume.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={`${getScoreBgColor(result.analysis.difficultyScore)} font-bold`}>
                            {Math.round(result.analysis.difficultyScore)}
                          </Badge>
                        </TableCell>
                        <TableCell>{result.analysis.domainPower.drAvgTop10}</TableCell>
                        <TableCell>{result.analysis.domainPower.drMinTop10}</TableCell>
                        <TableCell>{result.analysis.backlinks.rdAvgDofollowTop10}</TableCell>
                        <TableCell>{result.analysis.pagePower.urAvgTop10}</TableCell>
                        <TableCell>
                          <span className={getScoreColor(result.analysis.domainPower.score)}>
                            {result.analysis.domainPower.score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getScoreColor(result.analysis.backlinks.score)}>
                            {result.analysis.backlinks.score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getScoreColor(result.analysis.pagePower.score)}>
                            {result.analysis.pagePower.score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getScoreColor(result.analysis.intent.score)}>
                            {result.analysis.intent.score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${siteInfo.color}`}>
                            <SiteIcon className="h-3 w-3" />
                            <span>{siteInfo.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {result.analysis.intent.local && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                Local
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Score Legend:</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Badge className="bg-green-100 text-green-800">0-15</Badge>
              <span>Very Easy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-green-100 text-green-800">16-35</Badge>
              <span>Easy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-yellow-100 text-yellow-800">36-50</Badge>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-yellow-100 text-yellow-800">51-65</Badge>
              <span>Challenging</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-red-100 text-red-800">66-80</Badge>
              <span>Hard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-red-100 text-red-800">81-100</Badge>
              <span>Extreme</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};

export default AnalysisResultsPanel;
