import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Loader2, RefreshCw, Server } from 'lucide-react';
import { BulkKeywordEntry, TLD_OPTIONS, REGISTRAR_OPTIONS, RegistrarDistribution } from '@/types/bulkWebsiteCreation';
import { findAvailableDomain, generateDomainFromKeyword } from '@/utils/bulkDomainGenerator';

interface BulkStepDomainsProps {
  keywords: BulkKeywordEntry[];
  domainMode: 'manual' | 'auto';
  defaultTld: string;
  registrarDistribution: RegistrarDistribution[];
  onDomainModeChange: (mode: 'manual' | 'auto') => void;
  onDefaultTldChange: (tld: string) => void;
  onKeywordsChange: (keywords: BulkKeywordEntry[]) => void;
  onRegistrarDistributionChange: (distribution: RegistrarDistribution[]) => void;
}

const BulkStepDomains = ({
  keywords,
  domainMode,
  defaultTld,
  registrarDistribution,
  onDomainModeChange,
  onDefaultTldChange,
  onKeywordsChange,
  onRegistrarDistributionChange,
}: BulkStepDomainsProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState({ found: 0, total: 0 });
  const abortRef = useRef(false);

  const availableCount = keywords.filter((kw) => kw.domainStatus === 'available').length;
  const takenCount = keywords.filter((kw) => kw.domainStatus === 'taken').length;
  const totalRegistrarPercentage = registrarDistribution.reduce((sum, d) => sum + d.percentage, 0);

  const updateKeywordTld = (keywordId: string, tld: string) => {
    onKeywordsChange(
      keywords.map((kw) =>
        kw.id === keywordId
          ? { ...kw, tld, domain: generateDomainFromKeyword(kw.keyword, tld), domainStatus: 'pending' as const }
          : kw
      )
    );
  };

  const applyDefaultTldToAll = () => {
    onKeywordsChange(
      keywords.map((kw) => ({
        ...kw,
        tld: defaultTld,
        domain: generateDomainFromKeyword(kw.keyword, defaultTld),
        domainStatus: 'pending' as const,
      }))
    );
  };

  const findAllAvailable = useCallback(async () => {
    setIsSearching(true);
    abortRef.current = false;
    setSearchProgress({ found: 0, total: keywords.length });

    const updatedKeywords = [...keywords];
    let foundCount = 0;

    for (let i = 0; i < updatedKeywords.length; i++) {
      if (abortRef.current) break;

      const kw = updatedKeywords[i];
      if (kw.domainStatus === 'available') {
        foundCount++;
        setSearchProgress({ found: foundCount, total: keywords.length });
        continue;
      }

      updatedKeywords[i] = { ...kw, domainStatus: 'searching' };
      onKeywordsChange([...updatedKeywords]);

      let attempts = 0;
      let found = false;

      while (!found && attempts < 5 && !abortRef.current) {
        const result = await findAvailableDomain(kw.keyword, kw.tld || defaultTld);
        if (result.available) {
          updatedKeywords[i] = {
            ...kw,
            domain: result.domain,
            domainStatus: 'available',
          };
          found = true;
          foundCount++;
        } else {
          attempts++;
        }
      }

      if (!found) {
        updatedKeywords[i] = {
          ...kw,
          domain: updatedKeywords[i].domain,
          domainStatus: 'taken',
        };
      }

      onKeywordsChange([...updatedKeywords]);
      setSearchProgress({ found: foundCount, total: keywords.length });
    }

    setIsSearching(false);
  }, [keywords, defaultTld, onKeywordsChange]);

  const regenerateSingleDomain = async (keywordId: string) => {
    const kw = keywords.find((k) => k.id === keywordId);
    if (!kw) return;

    onKeywordsChange(
      keywords.map((k) =>
        k.id === keywordId ? { ...k, domainStatus: 'searching' as const } : k
      )
    );

    const result = await findAvailableDomain(kw.keyword, kw.tld || defaultTld);

    onKeywordsChange(
      keywords.map((k) =>
        k.id === keywordId
          ? { ...k, domain: result.domain, domainStatus: result.available ? 'available' : 'taken' }
          : k
      )
    );
  };

  const handleRegistrarToggle = (registrarId: string, checked: boolean) => {
    if (checked) {
      const registrar = REGISTRAR_OPTIONS.find((r) => r.value === registrarId);
      if (registrar) {
        onRegistrarDistributionChange([
          ...registrarDistribution,
          { registrarId, registrarName: registrar.label, percentage: 0 },
        ]);
      }
    } else {
      onRegistrarDistributionChange(
        registrarDistribution.filter((d) => d.registrarId !== registrarId)
      );
    }
  };

  const handleRegistrarPercentageChange = (registrarId: string, percentage: number) => {
    onRegistrarDistributionChange(
      registrarDistribution.map((d) =>
        d.registrarId === registrarId ? { ...d, percentage } : d
      )
    );
  };

  useEffect(() => {
    if (domainMode === 'auto' && keywords.length > 0) {
      const needsUpdate = keywords.some((kw) => !kw.tld);
      if (needsUpdate) {
        onKeywordsChange(
          keywords.map((kw) => ({
            ...kw,
            tld: kw.tld || defaultTld,
            domain: kw.domain || generateDomainFromKeyword(kw.keyword, kw.tld || defaultTld),
          }))
        );
      }
    }
  }, [domainMode]);

  const getStatusBadge = (status: BulkKeywordEntry['domainStatus'], id: string) => {
    switch (status) {
      case 'searching':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 animate-spin mr-1" /> Searching</Badge>;
      case 'available':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Available</Badge>;
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
          Configure domains and registrar distribution for each website.
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
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg flex-wrap">
            <div className="flex items-center gap-2">
              <Label>Default TLD:</Label>
              <Select value={defaultTld} onValueChange={onDefaultTldChange}>
                <SelectTrigger className="w-40">
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
            <Button variant="outline" size="sm" onClick={applyDefaultTldToAll}>
              Apply to All
            </Button>
            <Button
              onClick={findAllAvailable}
              disabled={isSearching || keywords.length === 0}
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Find All Available
                </>
              )}
            </Button>
          </div>

          {isSearching && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Finding available domains...</span>
                <span className="font-medium">{searchProgress.found}/{searchProgress.total} found</span>
              </div>
              <Progress value={(searchProgress.found / searchProgress.total) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">You can continue to the next step while searching runs in background</p>
            </div>
          )}

          <div className="flex gap-4 text-sm">
            <Badge variant="outline" className="bg-green-500/10">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" /> {availableCount} Available
            </Badge>
            <Badge variant="outline" className="bg-destructive/10">
              <XCircle className="h-3 w-3 mr-1 text-destructive" /> {takenCount} Taken
            </Badge>
            <Badge variant="outline">
              {keywords.length - availableCount - takenCount} Pending
            </Badge>
          </div>

          <div className="border rounded-lg max-h-[300px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="w-28">TLD</TableHead>
                  <TableHead>Generated Domain</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((kw, index) => (
                  <TableRow key={kw.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>{kw.keyword || <span className="text-muted-foreground italic">Empty</span>}</TableCell>
                    <TableCell>
                      <Select
                        value={kw.tld || defaultTld}
                        onValueChange={(value) => updateKeywordTld(kw.id, value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TLD_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {kw.domain || '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(kw.domainStatus, kw.id)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => regenerateSingleDomain(kw.id)}
                        disabled={kw.domainStatus === 'searching' || !kw.keyword}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="h-4 w-4" />
                Registrar Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select registrars and distribute domains across them.
              </p>
              
              <div className="space-y-3">
                {REGISTRAR_OPTIONS.map((registrar) => {
                  const dist = registrarDistribution.find((d) => d.registrarId === registrar.value);
                  const isSelected = !!dist;
                  const percentage = dist?.percentage || 0;

                  return (
                    <div key={registrar.value} className="flex items-center gap-4">
                      <Checkbox
                        id={registrar.value}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleRegistrarToggle(registrar.value, !!checked)}
                      />
                      <Label htmlFor={registrar.value} className="w-40 cursor-pointer">
                        {registrar.label}
                      </Label>
                      {isSelected && (
                        <>
                          <Slider
                            value={[percentage]}
                            onValueChange={([value]) => handleRegistrarPercentageChange(registrar.value, value)}
                            max={100}
                            step={5}
                            className="flex-1"
                          />
                          <span className="w-16 text-right text-sm font-medium">{percentage}%</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {registrarDistribution.length > 0 && (
                <div className="pt-3 border-t flex justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className={`text-sm font-medium ${totalRegistrarPercentage === 100 ? 'text-green-500' : 'text-destructive'}`}>
                    {totalRegistrarPercentage}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {domainMode === 'manual' && (
        <div className="p-8 text-center border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">
            Manual domain selection will be available in the final step.
          </p>
        </div>
      )}
    </div>
  );
};

export default BulkStepDomains;
