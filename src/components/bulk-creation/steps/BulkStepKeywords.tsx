import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Upload, FileUp } from 'lucide-react';
import { BulkKeywordEntry } from '@/types/bulkWebsiteCreation';
import { GEO_OPTIONS } from '@/types/websiteCreation';
import { toast } from 'sonner';

interface BulkStepKeywordsProps {
  keywords: BulkKeywordEntry[];
  onKeywordsChange: (keywords: BulkKeywordEntry[]) => void;
}

const parseGeoFromText = (geoText: string): string => {
  const normalized = geoText.toLowerCase().trim();
  const found = GEO_OPTIONS.find(
    (g) => g.value === normalized || g.label.toLowerCase() === normalized
  );
  return found?.value || 'us';
};

const BulkStepKeywords = ({ keywords, onKeywordsChange }: BulkStepKeywordsProps) => {
  const [bulkInput, setBulkInput] = useState('');
  const [defaultGeo, setDefaultGeo] = useState('us');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addKeyword = () => {
    const newKeyword: BulkKeywordEntry = {
      id: `kw-${Date.now()}`,
      keyword: '',
      geo: defaultGeo,
      tld: '.com',
      domainStatus: 'pending',
    };
    onKeywordsChange([...keywords, newKeyword]);
  };

  const updateKeyword = (id: string, field: keyof BulkKeywordEntry, value: string) => {
    onKeywordsChange(
      keywords.map((kw) =>
        kw.id === id ? { ...kw, [field]: value } : kw
      )
    );
  };

  const removeKeyword = (id: string) => {
    onKeywordsChange(keywords.filter((kw) => kw.id !== id));
  };

  const handleBulkAdd = () => {
    const lines = bulkInput.split('\n').filter((line) => line.trim());
    const newKeywords: BulkKeywordEntry[] = lines.map((line, index) => {
      const trimmed = line.trim();
      // Support format: keyword:geo (e.g., "car loans:canada")
      if (trimmed.includes(':')) {
        const [keywordPart, geoPart] = trimmed.split(':').map(s => s.trim());
        return {
          id: `kw-${Date.now()}-${index}`,
          keyword: keywordPart,
          geo: parseGeoFromText(geoPart),
          tld: '.com',
          domainStatus: 'pending' as const,
        };
      }
      return {
        id: `kw-${Date.now()}-${index}`,
        keyword: trimmed,
        geo: defaultGeo,
        tld: '.com',
        domainStatus: 'pending' as const,
      };
    });
    onKeywordsChange([...keywords, ...newKeywords]);
    setBulkInput('');
    setShowBulkInput(false);
    toast.success(`Added ${newKeywords.length} keywords`);
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('CSV file must have a header row and at least one data row');
        return;
      }

      const header = lines[0].toLowerCase().split(',').map(h => h.trim());
      const keywordIndex = header.indexOf('keyword');
      const geoIndex = header.indexOf('geo');

      if (keywordIndex === -1) {
        toast.error('CSV must have a "KEYWORD" column header');
        return;
      }

      const newKeywords: BulkKeywordEntry[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const keyword = values[keywordIndex];
        if (!keyword) continue;

        const geo = geoIndex !== -1 && values[geoIndex] 
          ? parseGeoFromText(values[geoIndex]) 
          : defaultGeo;

        newKeywords.push({
          id: `kw-${Date.now()}-${i}`,
          keyword,
          geo,
          tld: '.com',
          domainStatus: 'pending',
        });
      }

      if (newKeywords.length === 0) {
        toast.error('No valid keywords found in CSV');
        return;
      }

      onKeywordsChange([...keywords, ...newKeywords]);
      toast.success(`Imported ${newKeywords.length} keywords from CSV`);
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const applyGeoToAll = (geo: string) => {
    setDefaultGeo(geo);
    onKeywordsChange(keywords.map((kw) => ({ ...kw, geo })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Keywords & GEO</h3>
          <p className="text-sm text-muted-foreground">
            Add keywords for your websites. Each keyword will create a separate website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleCSVImport}
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <FileUp className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowBulkInput(!showBulkInput)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Add
          </Button>
          <Button size="sm" onClick={addKeyword}>
            <Plus className="h-4 w-4 mr-2" />
            Add Keyword
          </Button>
        </div>
      </div>

      {showBulkInput && (
        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
          <div>
            <Label>Paste keywords (one per line)</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Use format <code className="bg-muted px-1 rounded">keyword:geo</code> to set GEO per keyword (e.g., <code className="bg-muted px-1 rounded">car loans:canada</code>)
            </p>
          </div>
          <Textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="car loans:canada&#10;auto financing:us&#10;vehicle loans&#10;car loans in vancouver"
            rows={5}
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Default GEO (when not specified):</Label>
              <Select value={defaultGeo} onValueChange={setDefaultGeo}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GEO_OPTIONS.map((geo) => (
                    <SelectItem key={geo.value} value={geo.value}>
                      {geo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleBulkAdd}>Add {bulkInput.split('\n').filter(l => l.trim()).length} Keywords</Button>
          </div>
        </div>
      )}

      <div className="p-3 bg-muted/30 rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">
          <strong>CSV Import:</strong> First row must be headers with columns <code className="bg-muted px-1 rounded">KEYWORD</code> and <code className="bg-muted px-1 rounded">GEO</code> (GEO is optional).
        </p>
      </div>

      {keywords.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
          <span className="text-sm font-medium">Apply GEO to all:</span>
          <Select value={defaultGeo} onValueChange={applyGeoToAll}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GEO_OPTIONS.map((geo) => (
                <SelectItem key={geo.value} value={geo.value}>
                  {geo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {keywords.length} keyword{keywords.length !== 1 ? 's' : ''} total
          </span>
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Keyword</TableHead>
              <TableHead className="w-48">GEO</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No keywords added yet. Click "Add Keyword", "Bulk Add", or "Import CSV" to get started.
                </TableCell>
              </TableRow>
            ) : (
              keywords.map((kw, index) => (
                <TableRow key={kw.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={kw.keyword}
                      onChange={(e) => updateKeyword(kw.id, 'keyword', e.target.value)}
                      placeholder="Enter keyword..."
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={kw.geo}
                      onValueChange={(value) => updateKeyword(kw.id, 'geo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GEO_OPTIONS.map((geo) => (
                          <SelectItem key={geo.value} value={geo.value}>
                            {geo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeKeyword(kw.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BulkStepKeywords;
