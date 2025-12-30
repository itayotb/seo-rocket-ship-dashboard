
export const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export const sortWebsites = <T extends Record<string, any>>(
  websites: T[],
  sortBy: keyof T | null,
  sortDirection: 'asc' | 'desc'
): T[] => {
  if (!sortBy) return websites;
  
  return [...websites].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    // Create comparison values
    let aCompare = aValue;
    let bCompare = bValue;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aCompare = aValue.toLowerCase();
      bCompare = bValue.toLowerCase();
    }
    
    if (aCompare < bCompare) return sortDirection === 'asc' ? -1 : 1;
    if (aCompare > bCompare) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};
