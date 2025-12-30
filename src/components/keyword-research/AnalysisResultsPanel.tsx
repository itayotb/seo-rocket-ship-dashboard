import React, { useState, useMemo } from 'react';
import { AnalyzedKeyword } from '@/types/keywordResearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  ChevronDown
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

interface AnalysisResultsPanelProps {
  results: AnalyzedKeyword[];
  onClose: () => void;
}

const getScoreColor = (score: number) => {
  if (score <= 40) return 'text-green-600';
  if (score <= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number) => {
  if (score <= 40) return 'bg-green-100 text-green-800';
  if (score <= 60) return 'bg-yellow-100 text-yellow-800';
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

const AnalysisResultsPanel: React.FC<AnalysisResultsPanelProps> = ({ results, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [siteTypeFilter, setSiteTypeFilter] = useState<SiteTypeFilter>('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
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

    // Score filter
    if (scoreFilter !== 'all') {
      filtered = filtered.filter(r => {
        const score = r.analysis.domainPower.score + r.analysis.backlinks.score + r.analysis.pagePower.score + r.analysis.intent.score;
        const avgScore = score / 4;
        if (scoreFilter === 'easy') return avgScore <= 40;
        if (scoreFilter === 'medium') return avgScore > 40 && avgScore <= 60;
        if (scoreFilter === 'hard') return avgScore > 60;
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
          aVal = (a.analysis.domainPower.score + a.analysis.backlinks.score + a.analysis.pagePower.score + a.analysis.intent.score) / 4;
          bVal = (b.analysis.domainPower.score + b.analysis.backlinks.score + b.analysis.pagePower.score + b.analysis.intent.score) / 4;
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
      'Content Quality',
      'UX Trust',
      'SERP Stability',
      'Site Type',
      'SERP Locked',
      'Local'
    ];

    const rows = filteredAndSortedResults.map(r => {
      const avgScore = Math.round((r.analysis.domainPower.score + r.analysis.backlinks.score + r.analysis.pagePower.score + r.analysis.intent.score) / 4);
      return [
        r.keyword,
        r.volume,
        avgScore,
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
        r.analysis.contentQualityScore,
        r.analysis.uxTrustScore,
        r.analysis.serpStabilityScore,
        getSiteTypeInfo(r.analysis.recommendedSiteType).label,
        r.analysis.intent.serpLocked ? 'Yes' : 'No',
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

  const SortHeader = ({ label, sortKeyValue }: { label: string; sortKeyValue: SortKey }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(sortKeyValue)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === sortKeyValue ? (
          sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-30" />
        )}
      </div>
    </TableHead>
  );

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
                {filteredAndSortedResults.length} of {results.length} keyword{results.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
              <SelectItem value="easy">Easy (≤40)</SelectItem>
              <SelectItem value="medium">Medium (41-60)</SelectItem>
              <SelectItem value="hard">Hard (&gt;60)</SelectItem>
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
                  <SortHeader label="Keyword" sortKeyValue="keyword" />
                  <SortHeader label="Volume" sortKeyValue="volume" />
                  <SortHeader label="Score" sortKeyValue="score" />
                  <SortHeader label="DR Avg" sortKeyValue="drAvg" />
                  <SortHeader label="DR Min" sortKeyValue="drMin" />
                  <SortHeader label="RD Avg" sortKeyValue="rdAvg" />
                  <SortHeader label="UR Avg" sortKeyValue="urAvg" />
                  <TableHead>Domain</TableHead>
                  <TableHead>Backlinks</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Intent</TableHead>
                  <SortHeader label="Site Type" sortKeyValue="siteType" />
                  <TableHead>Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center text-muted-foreground py-8">
                      No results match your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedResults.map((result) => {
                    const siteInfo = getSiteTypeInfo(result.analysis.recommendedSiteType);
                    const SiteIcon = siteInfo.icon;
                    const avgScore = Math.round((result.analysis.domainPower.score + result.analysis.backlinks.score + result.analysis.pagePower.score + result.analysis.intent.score) / 4);

                    return (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium max-w-[200px] truncate" title={result.keyword}>
                          {result.keyword}
                        </TableCell>
                        <TableCell>{result.volume.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={`${getScoreBgColor(avgScore)} font-bold`}>
                            {avgScore}
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
                            {result.analysis.intent.serpLocked && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                Locked
                              </Badge>
                            )}
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
              <Badge className="bg-green-100 text-green-800">≤40</Badge>
              <span>Easy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-yellow-100 text-yellow-800">41-60</Badge>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-red-100 text-red-800">{'>'}60</Badge>
              <span>Hard</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsPanel;
