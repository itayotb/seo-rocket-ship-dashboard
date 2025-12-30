
import { useState } from 'react';
import { SearchConsoleData } from '@/types/searchConsole';
import { getSearchConsoleDataForPeriod } from '@/utils/searchConsole/mockData';
import { getTopQueriesFromData, getTopPagesFromData, getDrillDownData } from '@/utils/searchConsole/dataTransformers';

export interface DrillDownContext {
  type: 'query' | 'page' | null;
  value: string;
  name: string;
}

export const useSearchConsole = () => {
  const [searchConsoleData] = useState<SearchConsoleData>(getSearchConsoleDataForPeriod('28days'));
  const [drillDownContext, setDrillDownContext] = useState<DrillDownContext>({ type: null, value: '', name: '' });

  const getPerformanceMetrics = (period: string = '28days') => 
    getSearchConsoleDataForPeriod(period).performance;
  
  const getTopQueries = (limit: number = 10) => 
    getTopQueriesFromData(searchConsoleData.performance.queries, limit);
  
  const getTopPages = (limit: number = 10) => 
    getTopPagesFromData(searchConsoleData.performance.pages, limit);

  const getDrillDownMetrics = (context: DrillDownContext, period: string = '28days') => {
    if (!context.type || !context.value) return null;
    return getDrillDownData(context, period);
  };

  const setDrillDown = (type: 'query' | 'page', value: string, name: string) => {
    setDrillDownContext({ type, value, name });
  };

  const clearDrillDown = () => {
    setDrillDownContext({ type: null, value: '', name: '' });
  };

  return {
    searchConsoleData,
    drillDownContext,
    getPerformanceMetrics,
    getTopQueries,
    getTopPages,
    getDrillDownMetrics,
    setDrillDown,
    clearDrillDown
  };
};
