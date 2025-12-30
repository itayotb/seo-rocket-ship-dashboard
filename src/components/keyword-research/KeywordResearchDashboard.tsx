
import React from 'react';
import { useKeywordResearch } from '@/hooks/useKeywordResearch';
import SearchHeader from './SearchHeader';
import FiltersPanel from './FiltersPanel';
import KeywordsTable from './KeywordsTable';
import SummaryActions from './SummaryActions';
import AnalysisResultsPanel from './AnalysisResultsPanel';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KeywordResearchDashboard: React.FC = () => {
  const {
    allKeywords,
    filteredKeywords,
    selectedIds,
    isLoading,
    isLoaded,
    isAnalyzing,
    analysisResults,
    showAnalysis,
    loadDemoData,
    applyFilters,
    toggleSelection,
    selectAll,
    clearSelection,
    analyzeSelected,
    closeAnalysis,
  } = useKeywordResearch();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Keyword Research</h2>
        <p className="text-muted-foreground mt-1">
          Analyze keywords and find opportunities for your niche
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This is a demo interface. Click "Load Demo" to load sample keyword data for "car loans" in Canada.
        </AlertDescription>
      </Alert>

      <SearchHeader 
        onLoadDemo={loadDemoData}
        isLoading={isLoading}
        isLoaded={isLoaded}
      />

      {isLoaded && (
        <Tabs defaultValue="keywords" className="w-full">
          <TabsList>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!showAnalysis}>
              AI Analysis {showAnalysis && `(${analysisResults.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="keywords" className="mt-6">
            <SummaryActions
              totalKeywords={allKeywords.length}
              filteredCount={filteredKeywords.length}
              selectedCount={selectedIds.length}
              onAnalyze={analyzeSelected}
              isAnalyzing={isAnalyzing}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
              <div className="lg:col-span-1">
                <FiltersPanel onApplyFilters={applyFilters} />
              </div>
              <div className="lg:col-span-3">
                <KeywordsTable
                  rows={filteredKeywords}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelection}
                  onSelectAll={selectAll}
                  onClearSelection={clearSelection}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            {showAnalysis && analysisResults.length > 0 && (
              <AnalysisResultsPanel 
                results={analysisResults} 
                onClose={closeAnalysis}
              />
            )}
          </TabsContent>
        </Tabs>
      )}

      {!isLoaded && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Click "Load Demo" to get started with sample keyword data.</p>
        </div>
      )}
    </div>
  );
};

export default KeywordResearchDashboard;
