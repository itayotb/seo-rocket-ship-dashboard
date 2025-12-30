
import { SerpAnalysisResult } from '@/types/websiteCreation';

// Mock SERP analysis data based on keyword
const mockSerpData: Record<string, { sections: string[]; keywords: string[] }> = {
  'car loans': {
    sections: [
      'Hero Section',
      'Intro / Overview Section',
      'Benefits Section',
      'How It Works Section',
      'Eligibility / Requirements Section',
      'FAQ Section',
      'Testimonials Section',
      'CTA Section',
    ],
    keywords: [
      'car title loans',
      'car loans bad credit',
      'car loans canada',
      'car repair loans',
      'car equity loans',
      'car collateral loans',
      'car loans calculator',
      'car title loans canada',
      'average interest rate for car loans',
      'car title loans ontario',
      'car title loans vancouver',
      'bad credit car loans bc',
    ],
  },
  'personal loans': {
    sections: [
      'Hero Section',
      'What Is / Definition Section',
      'Benefits Section',
      'Comparison Section',
      'Eligibility / Requirements Section',
      'Step-by-Step Section',
      'FAQ Section',
      'CTA Section',
    ],
    keywords: [
      'personal loans online',
      'personal loans bad credit',
      'personal loans canada',
      'best personal loans',
      'personal loans calculator',
      'unsecured personal loans',
      'personal loans near me',
      'low interest personal loans',
    ],
  },
  'mortgage': {
    sections: [
      'Hero Section',
      'Intro / Overview Section',
      'Value Proposition Section',
      'How It Works Section',
      'Pricing / Cost Overview Section',
      'Key Considerations Section',
      'Expert Tips Section',
      'FAQ Section',
      'CTA Section',
    ],
    keywords: [
      'mortgage rates',
      'mortgage calculator',
      'mortgage broker',
      'best mortgage rates canada',
      'mortgage pre-approval',
      'fixed vs variable mortgage',
      'mortgage refinancing',
      'first time home buyer mortgage',
    ],
  },
};

// Default sections and keywords for any keyword
const defaultSerpData = {
  sections: [
    'Hero Section',
    'Intro / Overview Section',
    'Benefits Section',
    'Features / Services Section',
    'How It Works Section',
    'FAQ Section',
    'Testimonials Section',
    'CTA Section',
  ],
  keywords: [] as string[],
};

export const analyzeSerpResults = async (
  keyword: string,
  geo: string
): Promise<SerpAnalysisResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const normalizedKeyword = keyword.toLowerCase().trim();
  
  // Check if we have mock data for this keyword
  const matchedData = Object.entries(mockSerpData).find(([key]) => 
    normalizedKeyword.includes(key) || key.includes(normalizedKeyword)
  );

  if (matchedData) {
    const [, data] = matchedData;
    // Add geo-specific keywords
    const geoKeywords = data.keywords.map(kw => {
      if (geo === 'ca' && !kw.includes('canada')) {
        return `${kw} ${geo === 'ca' ? 'canada' : ''}`.trim();
      }
      return kw;
    });

    return {
      recommendedSections: data.sections,
      relatedKeywords: [...new Set([...data.keywords, ...geoKeywords])].slice(0, 15),
      analyzed: true,
    };
  }

  // Generate default keywords based on the input
  const generatedKeywords = [
    `${keyword} near me`,
    `best ${keyword}`,
    `${keyword} online`,
    `${keyword} services`,
    `${keyword} guide`,
    `how to ${keyword}`,
    `${keyword} tips`,
    `${keyword} reviews`,
  ];

  return {
    recommendedSections: defaultSerpData.sections,
    relatedKeywords: generatedKeywords,
    analyzed: true,
  };
};
