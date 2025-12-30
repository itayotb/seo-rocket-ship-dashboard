
import { useToast } from '@/hooks/use-toast';
import { getGeoFlag, getLanguageName } from '@/utils/keywordMappings';

export const useKeywordNotifications = () => {
  const { toast } = useToast();

  const notifyKeywordAdded = (term: string, geo: string, language: string) => {
    toast({
      title: "Keyword Added",
      description: `"${term.trim()}" has been added for ${getGeoFlag(geo)} ${getLanguageName(language)}.`,
    });
  };

  const notifyBulkKeywordsAdded = (count: number, geo: string, language: string) => {
    toast({
      title: "Keywords Added",
      description: `${count} keywords have been added for ${getGeoFlag(geo)} ${getLanguageName(language)}.`,
    });
  };

  const notifyKeywordUpdated = (newTerm: string) => {
    toast({
      title: "Keyword Updated",
      description: `Keyword has been updated to "${newTerm.trim()}".`,
    });
  };

  const notifyKeywordRemoved = (term: string) => {
    toast({
      title: "Keyword Removed",
      description: `"${term}" has been removed from tracking.`,
    });
  };

  const notifyBulkKeywordsRemoved = (count: number) => {
    toast({
      title: "Keywords Removed",
      description: `${count} keyword${count !== 1 ? 's' : ''} ${count !== 1 ? 'have' : 'has'} been removed from tracking.`,
    });
  };

  const notifyDataRefreshed = () => {
    toast({
      title: "Data Refreshed",
      description: `Keyword data updated for the selected time period.`,
    });
  };

  return {
    notifyKeywordAdded,
    notifyBulkKeywordsAdded,
    notifyKeywordUpdated,
    notifyKeywordRemoved,
    notifyBulkKeywordsRemoved,
    notifyDataRefreshed,
  };
};
