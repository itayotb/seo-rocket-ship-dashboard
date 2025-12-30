
import { AnalyticsKPI } from '@/types/analytics';

export const generateKPIs = (): AnalyticsKPI[] => [
  {
    id: 'total-traffic',
    title: 'Total Traffic',
    value: '2.4M',
    change: 12.5,
    changeType: 'positive',
    trend: [100, 120, 115, 135, 150, 145, 160],
    icon: 'trending-up',
    color: 'blue'
  },
  {
    id: 'avg-seo-score',
    title: 'Avg SEO Score',
    value: 87,
    change: 3.2,
    changeType: 'positive',
    trend: [82, 84, 85, 86, 87, 86, 87],
    icon: 'trending-up',
    color: 'green'
  },
  {
    id: 'total-clicks',
    title: 'Total Clicks',
    value: '186K',
    change: 8.3,
    changeType: 'positive',
    trend: [150, 165, 170, 180, 185, 182, 186],
    icon: 'mouse-pointer',
    color: 'purple'
  },
  {
    id: 'avg-position',
    title: 'Avg Position',
    value: 12.4,
    change: -2.1,
    changeType: 'positive', // Lower position is better
    trend: [15, 14, 13, 12.8, 12.5, 12.3, 12.4],
    icon: 'target',
    color: 'orange'
  }
];
