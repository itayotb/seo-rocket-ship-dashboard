
import { useKeywordData } from '@/hooks/useKeywordData';
import { useKeywordActions } from '@/hooks/useKeywordActions';
import { getGeoFlag, getLanguageName } from '@/utils/keywordMappings';

export const useKeywords = () => {
  const { keywords, setKeywords } = useKeywordData();
  const {
    handleAddKeyword,
    handleBulkAddKeywords,
    handleUpdateKeyword,
    handleRemoveKeyword,
    handleBulkRemoveKeywords,
    refreshKeywordsData,
  } = useKeywordActions(keywords, setKeywords);

  return {
    keywords,
    handleAddKeyword,
    handleBulkAddKeywords,
    handleUpdateKeyword,
    handleRemoveKeyword,
    handleBulkRemoveKeywords,
    refreshKeywordsData,
    getGeoFlag,
    getLanguageName
  };
};
