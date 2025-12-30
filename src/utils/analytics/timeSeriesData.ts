
import { TimeSeriesData } from '@/types/analytics';

export const generateTimeSeriesData = (): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const traffic = Math.floor(Math.random() * 100000) + 50000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      traffic: traffic,
      impressions: Math.floor(traffic * (Math.random() * 3 + 2)), // 2-5x traffic for impressions
      seoScore: Math.floor(Math.random() * 20) + 80
    });
  }

  return data;
};
