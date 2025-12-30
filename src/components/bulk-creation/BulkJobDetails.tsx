import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
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
  ArrowLeft, 
  Play, 
  Pause, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search,
  Download,
  ExternalLink,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Globe,
  Calendar,
  Loader2
} from 'lucide-react';
import { BulkCreationJob, BulkKeywordEntry, REGISTRAR_OPTIONS } from '@/types/bulkWebsiteCreation';
import { GEO_OPTIONS } from '@/types/websiteCreation';
import { format } from 'date-fns';

interface BulkJobDetailsProps {
  job: BulkCreationJob;
  onBack: () => void;
  onPause: (jobId: string) => void;
  onResume: (jobId: string) => void;
  onCancel: (jobId: string) => void;
}

type SortKey = 'keyword' | 'geo' | 'domain' | 'status' | 'registrar' | 'createdAt';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'pending' | 'searching' | 'generated' | 'available' | 'taken';

interface WebsiteEntry {
  keywordEntry: BulkKeywordEntry;
  website?: {
    id: string;
    name: string;
    domain: string;
    createdAt: string;
    status: string;
  };
  templateName?: string;
  registrarName?: string;
  scheduledAt?: string;
}

const BulkJobDetails = ({ job, onBack, onPause, onResume, onCancel }: BulkJobDetailsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('keyword');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [geoFilter, setGeoFilter] = useState<string>('all');

  const progressPercent = (job.progress.completed / job.progress.total) * 100;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-500"><Play className="h-3 w-3 mr-1" /> Running</Badge>;
      case 'paused':
        return <Badge variant="secondary"><Pause className="h-3 w-3 mr-1" /> Paused</Badge>;
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  const getDomainStatusBadge = (status: BulkKeywordEntry['domainStatus']) => {
    switch (status) {
      case 'generated':
        return <Badge className="bg-green-500">Created</Badge>;
      case 'available':
        return <Badge className="bg-blue-500">Available</Badge>;
      case 'taken':
        return <Badge variant="destructive">Taken</Badge>;
      case 'searching':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Searching</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getGeoLabel = (geo: string) => {
    return GEO_OPTIONS.find(g => g.value === geo)?.label || geo.toUpperCase();
  };

  const getRegistrarLabel = (registrarId?: string) => {
    if (!registrarId) return '-';
    return REGISTRAR_OPTIONS.find(r => r.value === registrarId)?.label || registrarId;
  };

  // Build entries combining keywords with created websites
  const entries: WebsiteEntry[] = useMemo(() => {
    return job.keywords.map((kw, index) => {
      const createdWebsite = job.createdWebsites.find(w => 
        w.keywords.includes(kw.keyword) || w.domain === kw.domain
      );
      
      const templateDist = job.templateDistribution[index % job.templateDistribution.length];
      const registrarDist = job.registrarDistribution[index % job.registrarDistribution.length];
      
      // Calculate scheduled time based on scheduling config
      let scheduledAt: string | undefined;
      if (job.scheduling.mode === 'per_days' && job.scheduling.sitesPerInterval && job.scheduling.intervalDays) {
        const intervalIndex = Math.floor(index / job.scheduling.sitesPerInterval);
        const daysToAdd = intervalIndex * job.scheduling.intervalDays;
        const baseDate = new Date(job.createdAt);
        baseDate.setDate(baseDate.getDate() + daysToAdd);
        scheduledAt = baseDate.toISOString();
      } else if (job.scheduling.mode === 'distribute_month' && job.scheduling.totalDays) {
        const dayGap = job.scheduling.totalDays / job.keywords.length;
        const daysToAdd = Math.floor(index * dayGap);
        const baseDate = new Date(job.createdAt);
        baseDate.setDate(baseDate.getDate() + daysToAdd);
        scheduledAt = baseDate.toISOString();
      }

      return {
        keywordEntry: kw,
        website: createdWebsite ? {
          id: createdWebsite.id,
          name: createdWebsite.name,
          domain: createdWebsite.domain,
          createdAt: createdWebsite.createdAt,
          status: createdWebsite.status,
        } : undefined,
        templateName: templateDist?.templateName,
        registrarName: registrarDist?.registrarName,
        scheduledAt,
      };
    });
  }, [job]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedEntries = useMemo(() => {
    let filtered = [...entries];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.keywordEntry.keyword.toLowerCase().includes(query) ||
        e.keywordEntry.domain?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.keywordEntry.domainStatus === statusFilter);
    }

    // GEO filter
    if (geoFilter !== 'all') {
      filtered = filtered.filter(e => e.keywordEntry.geo === geoFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortKey) {
        case 'keyword':
          aVal = a.keywordEntry.keyword.toLowerCase();
          bVal = b.keywordEntry.keyword.toLowerCase();
          break;
        case 'geo':
          aVal = a.keywordEntry.geo;
          bVal = b.keywordEntry.geo;
          break;
        case 'domain':
          aVal = a.keywordEntry.domain || '';
          bVal = b.keywordEntry.domain || '';
          break;
        case 'status':
          aVal = a.keywordEntry.domainStatus;
          bVal = b.keywordEntry.domainStatus;
          break;
        case 'registrar':
          aVal = a.registrarName || '';
          bVal = b.registrarName || '';
          break;
        case 'createdAt':
          aVal = a.website?.createdAt || a.scheduledAt || '';
          bVal = b.website?.createdAt || b.scheduledAt || '';
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return filtered;
  }, [entries, searchQuery, sortKey, sortOrder, statusFilter, geoFilter]);

  const uniqueGeos = useMemo(() => {
    const geos = new Set(job.keywords.map(k => k.geo));
    return Array.from(geos);
  }, [job.keywords]);

  const downloadCSV = () => {
    const headers = ['Keyword', 'GEO', 'Domain', 'TLD', 'Status', 'Template', 'Registrar', 'Scheduled At', 'Created At'];
    const rows = filteredAndSortedEntries.map(e => [
      e.keywordEntry.keyword,
      getGeoLabel(e.keywordEntry.geo),
      e.keywordEntry.domain || '-',
      e.keywordEntry.tld,
      e.keywordEntry.domainStatus,
      e.templateName || '-',
      e.registrarName || '-',
      e.scheduledAt ? format(new Date(e.scheduledAt), 'yyyy-MM-dd HH:mm') : '-',
      e.website?.createdAt ? format(new Date(e.website.createdAt), 'yyyy-MM-dd HH:mm') : '-',
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-job-${job.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader = ({ label, sortKeyValue }: { label: string; sortKeyValue: SortKey }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{job.name}</h2>
            <p className="text-muted-foreground">Job Details & Progress</p>
          </div>
        </div>
        {getStatusBadge(job.status)}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{job.progress.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{job.progress.completed}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{job.progress.total - job.progress.completed}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{job.templateDistribution.length}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{format(new Date(job.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            {job.progress.currentKeyword && job.status === 'running' && (
              <p className="text-sm text-muted-foreground">Currently creating: <strong>{job.progress.currentKeyword}</strong></p>
            )}
          </div>

          {job.status !== 'completed' && job.status !== 'failed' && (
            <div className="flex gap-2 mt-4">
              {job.status === 'running' ? (
                <Button variant="outline" onClick={() => onPause(job.id)}>
                  <Pause className="h-4 w-4 mr-2" /> Pause Job
                </Button>
              ) : (
                <Button variant="outline" onClick={() => onResume(job.id)}>
                  <Play className="h-4 w-4 mr-2" /> Resume Job
                </Button>
              )}
              <Button variant="destructive" onClick={() => onCancel(job.id)}>
                <X className="h-4 w-4 mr-2" /> Cancel Job
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search keywords or domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="searching">Searching</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="generated">Created</SelectItem>
            <SelectItem value="taken">Taken</SelectItem>
          </SelectContent>
        </Select>

        <Select value={geoFilter} onValueChange={setGeoFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="GEO" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All GEOs</SelectItem>
            {uniqueGeos.map(geo => (
              <SelectItem key={geo} value={geo}>{getGeoLabel(geo)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={downloadCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">#</TableHead>
                    <SortHeader label="Keyword" sortKeyValue="keyword" />
                    <SortHeader label="GEO" sortKeyValue="geo" />
                    <SortHeader label="Domain" sortKeyValue="domain" />
                    <TableHead>TLD</TableHead>
                    <SortHeader label="Status" sortKeyValue="status" />
                    <TableHead>Template</TableHead>
                    <SortHeader label="Registrar" sortKeyValue="registrar" />
                    <SortHeader label="Date" sortKeyValue="createdAt" />
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                        No entries match your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedEntries.map((entry, index) => (
                      <TableRow key={entry.keywordEntry.id}>
                        <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate" title={entry.keywordEntry.keyword}>
                          {entry.keywordEntry.keyword}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getGeoLabel(entry.keywordEntry.geo)}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate" title={entry.keywordEntry.domain}>
                          {entry.keywordEntry.domain || '-'}
                        </TableCell>
                        <TableCell>{entry.keywordEntry.tld}</TableCell>
                        <TableCell>{getDomainStatusBadge(entry.keywordEntry.domainStatus)}</TableCell>
                        <TableCell className="max-w-[120px] truncate" title={entry.templateName}>
                          {entry.templateName || '-'}
                        </TableCell>
                        <TableCell>{entry.registrarName || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {entry.website?.createdAt ? (
                            <span className="text-green-600">{format(new Date(entry.website.createdAt), 'MMM d, HH:mm')}</span>
                          ) : entry.scheduledAt ? (
                            <span className="text-muted-foreground">{format(new Date(entry.scheduledAt), 'MMM d, HH:mm')}</span>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {entry.website && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={`https://${entry.keywordEntry.domain}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredAndSortedEntries.length} of {entries.length} entries
      </div>
    </div>
  );
};

export default BulkJobDetails;
