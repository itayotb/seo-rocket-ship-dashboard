
import { useState } from 'react';
import { KeywordData } from '@/types/keyword';

export const useKeywordData = () => {
  const [keywords, setKeywords] = useState<KeywordData[]>([
    {
      id: '1',
      term: 'tech solutions',
      geo: 'us',
      language: 'en',
      position: 3,
      volume: 2400,
      difficulty: 65,
      trend: 'up',
      positionChange: 2,
      impressions: 15420,
      clicks: 892,
      ctr: 5.8
    },
    {
      id: '2',
      term: 'software development',
      geo: 'uk',
      language: 'en',
      position: 8,
      volume: 5100,
      difficulty: 78,
      trend: 'down',
      positionChange: -3,
      impressions: 8934,
      clicks: 234,
      ctr: 2.6
    },
    {
      id: '3',
      term: 'automatización empresarial',
      geo: 'es',
      language: 'es',
      position: 12,
      volume: 890,
      difficulty: 45,
      trend: 'stable',
      positionChange: 0,
      impressions: 3567,
      clicks: 178,
      ctr: 5.0
    },
    {
      id: '4',
      term: 'digital transformation',
      geo: 'ca',
      language: 'en',
      position: 15,
      volume: 3200,
      difficulty: 82,
      trend: 'up',
      positionChange: 5,
      impressions: 5234,
      clicks: 145,
      ctr: 2.8
    }
  ]);

  return {
    keywords,
    setKeywords
  };
};
