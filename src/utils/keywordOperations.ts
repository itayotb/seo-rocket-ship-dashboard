
import { KeywordData } from '@/types/keyword';

export const createNewKeyword = (formData: { term: string; geo: string; language: string }): KeywordData => {
  return {
    id: Date.now().toString(),
    term: formData.term.trim(),
    geo: formData.geo,
    language: formData.language,
    position: 0,
    volume: 0,
    difficulty: 0,
    trend: 'stable',
    positionChange: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0
  };
};

export const createBulkKeywords = (formData: { terms: string[]; geo: string; language: string }): KeywordData[] => {
  return formData.terms.map((term, index) => ({
    id: (Date.now() + index).toString(),
    term: term.trim(),
    geo: formData.geo,
    language: formData.language,
    position: 0,
    volume: 0,
    difficulty: 0,
    trend: 'stable',
    positionChange: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0
  }));
};

export const refreshKeywordMetrics = (keywords: KeywordData[], period: string): KeywordData[] => {
  const periodMultipliers: { [key: string]: number } = {
    '24hours': 0.1,
    '7days': 0.4,
    '28days': 1.0,
    '3months': 2.5,
    'custom': 1.0
  };

  const multiplier = periodMultipliers[period] || 1.0;

  return keywords.map(keyword => ({
    ...keyword,
    impressions: Math.round(keyword.impressions * multiplier * (0.8 + Math.random() * 0.4)),
    clicks: Math.round(keyword.clicks * multiplier * (0.8 + Math.random() * 0.4)),
    ctr: Math.round((keyword.ctr * (0.9 + Math.random() * 0.2)) * 10) / 10
  }));
};
