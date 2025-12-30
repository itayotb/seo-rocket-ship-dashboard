
export const getGeoFlag = (geo: string) => {
  const flags: { [key: string]: string } = {
    'us': '🇺🇸',
    'uk': '🇬🇧',
    'ca': '🇨🇦',
    'au': '🇦🇺',
    'de': '🇩🇪',
    'fr': '🇫🇷',
    'es': '🇪🇸',
    'it': '🇮🇹',
    'nl': '🇳🇱',
    'br': '🇧🇷',
    'mx': '🇲🇽',
    'jp': '🇯🇵',
    'in': '🇮🇳',
  };
  return flags[geo] || '🌍';
};

export const getLanguageName = (code: string) => {
  const languages: { [key: string]: string } = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'nl': 'Dutch',
    'ja': 'Japanese',
    'hi': 'Hindi',
    'zh': 'Chinese',
    'ru': 'Russian',
    'ar': 'Arabic',
  };
  return languages[code] || code.toUpperCase();
};
