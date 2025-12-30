
import { KeywordSettings } from '@/types/keyword';

export const findNaturalPosition = (paragraph: string, keyword: string): number => {
  const words = paragraph.split(' ');
  const keywordWords = keyword.split(' ');
  
  // Look for natural positions based on context
  const contextWords = ['the', 'and', 'or', 'but', 'with', 'for', 'in', 'on', 'at', 'to'];
  
  for (let i = 1; i < words.length - keywordWords.length; i++) {
    const prevWord = words[i - 1].toLowerCase();
    const nextWord = words[i + keywordWords.length]?.toLowerCase();
    
    if (contextWords.includes(prevWord) || contextWords.includes(nextWord)) {
      return i;
    }
  }
  
  // Fallback to middle position
  return Math.floor(words.length / 2);
};

export const insertKeywordInParagraph = (
  paragraph: string, 
  keyword: string, 
  settings: KeywordSettings
): string => {
  if (!paragraph.trim()) return paragraph;
  
  const words = paragraph.split(' ');
  const keywordWords = keyword.split(' ');
  
  // Check if keyword already exists to avoid duplicates
  if (settings.avoidDuplicates && paragraph.toLowerCase().includes(keyword.toLowerCase())) {
    return paragraph;
  }
  
  // Use natural placement by default
  const insertPosition = findNaturalPosition(paragraph, keyword);
  
  // Insert keyword at the determined position
  const newWords = [...words];
  newWords.splice(insertPosition, 0, keyword);
  
  return newWords.join(' ');
};

export const processContentWithKeywords = (
  content: string,
  settings: KeywordSettings
): { newContent: string; targetCount: number } => {
  const paragraphs = content.split('\n').filter(p => p.trim());
  const targetCount = Math.ceil(paragraphs.length * (settings.frequency / 100));
  
  // Select random paragraphs to target
  const shuffledIndices = [...Array(paragraphs.length).keys()]
    .sort(() => 0.5 - Math.random())
    .slice(0, targetCount);
  
  const updatedParagraphs = paragraphs.map((paragraph, index) => {
    if (!shuffledIndices.includes(index)) return paragraph;
    
    // Select random keyword for this paragraph
    const randomKeyword = settings.keywords[Math.floor(Math.random() * settings.keywords.length)];
    return insertKeywordInParagraph(paragraph, randomKeyword, settings);
  });
  
  const newContent = updatedParagraphs.join('\n');
  return { newContent, targetCount };
};
