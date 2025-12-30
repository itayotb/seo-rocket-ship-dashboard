
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeywordRow } from '@/types/keywordResearch';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface KeywordsTableProps {
  rows: KeywordRow[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

type SortField = 'keyword' | 'volume' | 'difficulty';
type SortDirection = 'asc' | 'desc';

const KeywordsTable: React.FC<KeywordsTableProps> = ({
  rows,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
}) => {
  const [sortField, setSortField] = useState<SortField>('volume');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'keyword') {
        return multiplier * a.keyword.localeCompare(b.keyword);
      }
      return multiplier * (a[sortField] - b[sortField]);
    });
  }, [rows, sortField, sortDirection]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRows.slice(start, start + itemsPerPage);
  }, [sortedRows, currentPage]);

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < rows.length;

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'Informational': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Commercial': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Transactional': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Navigational': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty === 0) return 'text-gray-400';
    if (difficulty < 30) return 'text-green-600 dark:text-green-400';
    if (difficulty < 50) return 'text-yellow-600 dark:text-yellow-400';
    if (difficulty < 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) (el as any).indeterminate = someSelected;
                  }}
                  onCheckedChange={() => allSelected ? onClearSelection() : onSelectAll()}
                />
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort('keyword')}
                >
                  Keyword
                  <SortIcon field="keyword" />
                </button>
              </TableHead>
              <TableHead className="w-24">Country</TableHead>
              <TableHead className="w-28">
                <button 
                  className="flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort('volume')}
                >
                  Volume
                  <SortIcon field="volume" />
                </button>
              </TableHead>
              <TableHead className="w-28">
                <button 
                  className="flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort('difficulty')}
                >
                  Difficulty
                  <SortIcon field="difficulty" />
                </button>
              </TableHead>
              <TableHead>Intents</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No keywords found. Try adjusting your filters or load the demo data.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map(row => (
                <TableRow key={row.id} className={selectedIds.includes(row.id) ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onCheckedChange={() => onToggleSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{row.keyword}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground uppercase">{row.country}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{row.volume.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getDifficultyColor(row.difficulty)}`}>
                      {row.difficulty || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {row.intentTypes.map(intent => (
                        <Badge 
                          key={intent} 
                          variant="secondary"
                          className={`text-xs ${getIntentColor(intent)}`}
                        >
                          {intent.slice(0, 4)}
                        </Badge>
                      ))}
                      <Badge 
                        variant="outline"
                        className="text-xs"
                      >
                        {row.brandType === 'Branded' ? 'B' : 'NB'}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className="text-xs"
                      >
                        {row.locationType === 'Local' ? 'L' : 'NL'}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordsTable;
