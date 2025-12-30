
import { KeywordData } from '@/types/keyword';
import { createNewKeyword, createBulkKeywords, refreshKeywordMetrics } from '@/utils/keywordOperations';
import { useKeywordNotifications } from './useKeywordNotifications';

export const useKeywordActions = (keywords: KeywordData[], setKeywords: (keywords: KeywordData[]) => void) => {
  const {
    notifyKeywordAdded,
    notifyBulkKeywordsAdded,
    notifyKeywordUpdated,
    notifyKeywordRemoved,
    notifyBulkKeywordsRemoved,
    notifyDataRefreshed,
  } = useKeywordNotifications();

  const handleAddKeyword = (formData: { term: string; geo: string; language: string }) => {
    const newKeyword = createNewKeyword(formData);
    setKeywords([...keywords, newKeyword]);
    notifyKeywordAdded(formData.term, formData.geo, formData.language);
  };

  const handleBulkAddKeywords = (formData: { terms: string[]; geo: string; language: string }) => {
    const newKeywords = createBulkKeywords(formData);
    setKeywords([...keywords, ...newKeywords]);
    notifyBulkKeywordsAdded(formData.terms.length, formData.geo, formData.language);
  };

  const handleUpdateKeyword = (keywordId: string, newTerm: string) => {
    setKeywords(keywords.map(k => 
      k.id === keywordId 
        ? { ...k, term: newTerm.trim() }
        : k
    ));
    notifyKeywordUpdated(newTerm);
  };

  const handleRemoveKeyword = (keywordId: string) => {
    const keyword = keywords.find(k => k.id === keywordId);
    setKeywords(keywords.filter(k => k.id !== keywordId));
    notifyKeywordRemoved(keyword?.term || '');
  };

  const handleBulkRemoveKeywords = (keywordIds: string[]) => {
    const removedKeywords = keywords.filter(k => keywordIds.includes(k.id));
    setKeywords(keywords.filter(k => !keywordIds.includes(k.id)));
    notifyBulkKeywordsRemoved(removedKeywords.length);
  };

  const refreshKeywordsData = (period: string) => {
    const updatedKeywords = refreshKeywordMetrics(keywords, period);
    setKeywords(updatedKeywords);
    notifyDataRefreshed();
  };

  return {
    handleAddKeyword,
    handleBulkAddKeywords,
    handleUpdateKeyword,
    handleRemoveKeyword,
    handleBulkRemoveKeywords,
    refreshKeywordsData,
  };
};
