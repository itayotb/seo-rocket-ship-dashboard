export function generateDomainFromKeyword(keyword: string, tld: string): string {
  // Convert keyword to domain-friendly format
  const slug = keyword
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '')          // Remove spaces (join words)
    .substring(0, 63);            // Max domain length
  
  return `${slug}${tld}`;
}

export function generateAlternativeDomain(keyword: string, tld: string): string {
  // Generate with dashes between words
  const slug = keyword
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')         // Replace spaces with dashes
    .substring(0, 63);
  
  return `${slug}${tld}`;
}

export function generateDomainVariants(keyword: string, tld: string): string[] {
  const base = generateDomainFromKeyword(keyword, tld);
  const withDash = generateAlternativeDomain(keyword, tld);
  
  // Generate more variants
  const slug = keyword.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '');
  const words = slug.split(/\s+/);
  
  const variants = [base, withDash];
  
  // Add number suffix variants
  if (words.length > 0) {
    variants.push(`${words.join('')}1${tld}`);
    variants.push(`get${words.join('')}${tld}`);
    variants.push(`${words.join('')}online${tld}`);
  }
  
  return [...new Set(variants)]; // Remove duplicates
}

// Mock domain availability check - 70% chance available
export function checkDomainAvailability(domain: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Use hash of domain for consistent results
      const hash = domain.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      const isAvailable = Math.abs(hash % 100) < 70;
      resolve(isAvailable);
    }, 500 + Math.random() * 500); // 500-1000ms delay
  });
}

export async function findAvailableDomain(keyword: string, tld: string): Promise<{
  domain: string;
  available: boolean;
  attempts: string[];
}> {
  const variants = generateDomainVariants(keyword, tld);
  const attempts: string[] = [];
  
  for (const domain of variants) {
    attempts.push(domain);
    const available = await checkDomainAvailability(domain);
    if (available) {
      return { domain, available: true, attempts };
    }
  }
  
  // If all taken, return last attempt
  return { domain: variants[variants.length - 1], available: false, attempts };
}
