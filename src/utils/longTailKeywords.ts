
export const generateLongTailKeywords = (baseKeyword: string, category?: string): string[] => {
  const modifiers = {
    intent: ['how to', 'best', 'top', 'guide', 'tips', 'benefits of', 'why', 'what is'],
    location: ['near me', 'in [city]', 'local', 'online'],
    commercial: ['buy', 'price', 'cost', 'cheap', 'affordable', 'review', 'compare'],
    problems: ['problems', 'solutions', 'issues', 'troubleshooting', 'help'],
    time: ['2024', 'this year', 'now', 'today', 'latest'],
    features: ['with', 'for', 'that', 'including', 'featuring']
  };

  const categorySpecific: Record<string, string[]> = {
    business: ['for small business', 'for entrepreneurs', 'consulting', 'management', 'strategy'],
    ecommerce: ['to buy online', 'store', 'shopping', 'deals', 'discount'],
    blog: ['articles about', 'posts on', 'writing about', 'content on'],
    portfolio: ['examples', 'showcase', 'gallery', 'work samples'],
    'landing-page': ['conversion', 'lead generation', 'signup', 'offer'],
    restaurant: ['menu', 'delivery', 'reservation', 'food'],
    health: ['treatment', 'therapy', 'care', 'wellness', 'medical'],
    educational: ['courses', 'learning', 'training', 'certification', 'online classes']
  };

  const longTailKeywords: string[] = [];
  const baseKeywordLower = baseKeyword.toLowerCase();

  // Generate intent-based long-tail keywords
  modifiers.intent.forEach(modifier => {
    longTailKeywords.push(`${modifier} ${baseKeywordLower}`);
  });

  // Generate commercial intent keywords
  modifiers.commercial.slice(0, 3).forEach(modifier => {
    longTailKeywords.push(`${modifier} ${baseKeywordLower}`);
  });

  // Generate problem-solving keywords
  modifiers.problems.slice(0, 2).forEach(modifier => {
    longTailKeywords.push(`${baseKeywordLower} ${modifier}`);
  });

  // Add category-specific keywords
  if (category && categorySpecific[category]) {
    categorySpecific[category].slice(0, 3).forEach(specific => {
      longTailKeywords.push(`${baseKeywordLower} ${specific}`);
    });
  }

  // Generate location-based keywords
  longTailKeywords.push(`${baseKeywordLower} near me`);
  longTailKeywords.push(`best ${baseKeywordLower} online`);

  // Generate time-sensitive keywords
  longTailKeywords.push(`${baseKeywordLower} 2024`);
  longTailKeywords.push(`latest ${baseKeywordLower}`);

  // Remove duplicates and return first 12 suggestions
  return [...new Set(longTailKeywords)].slice(0, 12);
};
