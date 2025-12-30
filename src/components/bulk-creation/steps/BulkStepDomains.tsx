import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { BulkKeywordEntry, TLD_OPTIONS } from '@/types/bulkWebsiteCreation';
import { findAvailableDomain, generateDomainFromKeyword } from '@/utils/bulkDomainGenerator';

interface BulkStepDomainsProps {
  keywords: BulkKeywordEntry[];
  domainMode: 'manual' | 'auto';
  tld: string;
  onDomainModeChange: (mode: 'manual' | 'auto') => void;
  onTldChange: (tld: string) => void;
  onKeywordsChange: (keywords: BulkKeywordEntry[]) => void;
}

const BulkStepDomains = ({
  keywords,
  domainMode,
  tld,
  onDomainModeChange,
  onTldChange,
  onKeywordsChange,
}: BulkStepDomainsProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  const generateAllDomains = async () => {
    setIsChecking(true);
    
    const updatedKeywords = [...keywords];
    
    for (let i = 0; i < updatedKeywords.length; i++) {
      const kw = updatedKeywords[i];
      setCheckingId(kw.id);
      
      const result = await findAvailableDomain(kw.keyword, tld);
      updatedKeywords[i] = {
        ...kw,
        domain: result.domain,
        domainStatus: result.available ? 'available' : 'taken',
      };
      
      onKeywordsChange([...updatedKeywords]);
    }
    
    setCheckingId(null);
    setIsChecking(false);
  };

  const regenerateDomain = async (keywordId: string) => {
    const kw = keywords.find((k) => k.id === keywordId);
    if (!kw) return;
    
    setCheckingId(keywordId);
    
    const result = await findAvailableDomain(kw.keyword, tld);
    
    onKeywordsChange(
      keywords.map((k) =>
        k.id === keywordId
          ? { ...k, domain: result.domain, domainStatus: result.available ? 'available' : 'taken' }
          : k
      )
    );
    
    setCheckingId(null);
  };

  // Auto-generate preview domains when TLD changes
  useEffect(() => {
    if (domainMode === 'auto') {
      const previewKeywords = keywords.map((kw) => ({
        ...kw,
        domain: generateDomainFromKeyword(kw.keyword, tld),
        domainStatus: 'pending' as const,
      }));
      onKeywordsChange(previewKeywords);
    }
  }, [tld, domainMode]);

  const getStatusBadge = (status: BulkKeywordEntry['domainStatus'], id: string) => {
    if (checkingId === id) {
      return <Badge variant="secondary"><Loader2 className="h-3 w-3 animate-spin mr-1" /> Checking</Badge>;
    }
    
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Available</Badge>;
      case 'taken':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Taken</Badge>;
      case 'generated':
        return <Badge variant="secondary">Generated</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Domain Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Choose how domains will be assigned to each website.
        </p>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label className="text-base">Automatic Domain Generation</Label>
          <p className="text-sm text-muted-foreground">
            {domainMode === 'auto'
              ? 'Domains will be auto-generated from keywords'
              : 'You will manually select domains for each site'}
          </p>
        </div>
        <Switch
          checked={domainMode === 'auto'}
          onCheckedChange={(checked) => onDomainModeChange(checked ? 'auto' : 'manual')}
        />
      </div>

      {domainMode === 'auto' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Label>TLD (Top-Level Domain):</Label>
              <Select value={tld} onValueChange={onTldChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TLD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={generateAllDomains}
              disabled={isChecking || keywords.length === 0}
            >
              {isChecking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check All Domains
                </>
              )}
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Generated Domain</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((kw, index) => (
                  <TableRow key={kw.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>{kw.keyword || <span className="text-muted-foreground italic">Empty keyword</span>}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {kw.domain || '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(kw.domainStatus, kw.id)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => regenerateDomain(kw.id)}
                        disabled={checkingId === kw.id || !kw.keyword}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>• Domains are generated by removing spaces and special characters from keywords</p>
            <p>• If a domain is taken, alternatives with dashes will be tried</p>
            <p>• This is a demo - actual domain availability would require a real API</p>
          </div>
        </div>
      )}

      {domainMode === 'manual' && (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">
            Manual domain selection will be available in the final step.
            You'll be able to choose from your existing domains.
          </p>
        </div>
      )}
    </div>
  );
};

export default BulkStepDomains;
