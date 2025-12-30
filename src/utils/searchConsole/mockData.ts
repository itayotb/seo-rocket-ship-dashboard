
import { SearchConsoleData } from '@/types/searchConsole';

export const getSearchConsoleDataForPeriod = (period: string): SearchConsoleData => {
  const baseData = {
    performance: {
      totalClicks: 12450,
      totalImpressions: 89320,
      averageCTR: 13.9,
      averagePosition: 8.2,
      clicksChange: 15.2,
      impressionsChange: 8.7,
      ctrChange: 2.1,
      positionChange: -0.8,
      dateRange: 'Last 28 days',
      queries: [
        {
          query: 'tech solutions',
          clicks: 2840,
          impressions: 18920,
          ctr: 15.0,
          position: 3.2,
          trend: 'up' as const
        },
        {
          query: 'software development',
          clicks: 1950,
          impressions: 15680,
          ctr: 12.4,
          position: 5.8,
          trend: 'up' as const
        },
        {
          query: 'digital transformation',
          clicks: 1420,
          impressions: 12340,
          ctr: 11.5,
          position: 7.2,
          trend: 'stable' as const
        },
        {
          query: 'business automation',
          clicks: 980,
          impressions: 8950,
          ctr: 10.9,
          position: 9.1,
          trend: 'down' as const
        }
      ],
      pages: [
        {
          page: '/services',
          clicks: 3240,
          impressions: 22140,
          ctr: 14.6,
          position: 4.1,
          trend: 'up' as const
        },
        {
          page: '/about',
          clicks: 2180,
          impressions: 16890,
          ctr: 12.9,
          position: 6.3,
          trend: 'stable' as const
        },
        {
          page: '/blog/tech-trends',
          clicks: 1890,
          impressions: 14720,
          ctr: 12.8,
          position: 7.8,
          trend: 'up' as const
        }
      ],
      countries: [
        {
          country: 'United States',
          countryCode: 'US',
          clicks: 6890,
          impressions: 45220,
          ctr: 15.2,
          position: 7.1
        },
        {
          country: 'United Kingdom',
          countryCode: 'GB',
          clicks: 2340,
          impressions: 18950,
          ctr: 12.3,
          position: 8.9
        },
        {
          country: 'Canada',
          countryCode: 'CA',
          clicks: 1890,
          impressions: 14220,
          ctr: 13.3,
          position: 8.5
        }
      ],
      devices: [
        {
          device: 'mobile' as const,
          clicks: 7240,
          impressions: 52180,
          ctr: 13.9,
          position: 8.4
        },
        {
          device: 'desktop' as const,
          clicks: 4320,
          impressions: 31240,
          ctr: 13.8,
          position: 7.8
        },
        {
          device: 'tablet' as const,
          clicks: 890,
          impressions: 5900,
          ctr: 15.1,
          position: 8.9
        }
      ]
    },
    pages: [
      {
        url: '/services',
        title: 'Our Services - TechCorp Solutions',
        errors: [],
        warnings: [
          {
            type: 'Meta description too long',
            description: 'Meta description exceeds 160 characters',
            affectedPages: 1
          }
        ],
        status: 'warning' as const,
        lastCrawled: '2024-06-02',
        indexingStatus: 'indexed' as const,
        mobileUsability: 'good' as const
      },
      {
        url: '/about',
        title: 'About Us - TechCorp Solutions',
        errors: [],
        warnings: [],
        status: 'valid' as const,
        lastCrawled: '2024-06-02',
        indexingStatus: 'indexed' as const,
        mobileUsability: 'good' as const
      }
    ],
    sitemaps: [
      {
        url: '/sitemap.xml',
        status: 'success' as const,
        submittedUrls: 25,
        indexedUrls: 23,
        lastSubmitted: '2024-06-01',
        errors: []
      }
    ],
    schemaMarkup: [
      {
        type: 'Organization',
        status: 'valid' as const,
        validItems: 1,
        errorItems: 0,
        warningItems: 0,
        issues: []
      },
      {
        type: 'Article',
        status: 'warning' as const,
        validItems: 5,
        errorItems: 0,
        warningItems: 2,
        issues: [
          {
            type: 'Missing author',
            severity: 'warning' as const,
            description: 'Author property is recommended for Article schema',
            affectedItems: 2
          }
        ]
      }
    ]
  };

  // Time period multipliers and labels
  const multipliers: Record<string, { clicks: number; impressions: number; label: string }> = {
    '24hours': { clicks: 0.04, impressions: 0.04, label: 'Last 24 hours' },
    '7days': { clicks: 0.25, impressions: 0.25, label: 'Last 7 days' },
    '28days': { clicks: 1, impressions: 1, label: 'Last 28 days' },
    '3months': { clicks: 3.2, impressions: 3.2, label: 'Last 3 months' }
  };

  const multiplier = multipliers[period] || multipliers['28days'];

  return {
    ...baseData,
    performance: {
      ...baseData.performance,
      totalClicks: Math.round(baseData.performance.totalClicks * multiplier.clicks),
      totalImpressions: Math.round(baseData.performance.totalImpressions * multiplier.impressions),
      dateRange: multiplier.label,
      queries: baseData.performance.queries.map(query => ({
        ...query,
        clicks: Math.round(query.clicks * multiplier.clicks),
        impressions: Math.round(query.impressions * multiplier.impressions)
      })),
      pages: baseData.performance.pages.map(page => ({
        ...page,
        clicks: Math.round(page.clicks * multiplier.clicks),
        impressions: Math.round(page.impressions * multiplier.impressions)
      })),
      countries: baseData.performance.countries.map(country => ({
        ...country,
        clicks: Math.round(country.clicks * multiplier.clicks),
        impressions: Math.round(country.impressions * multiplier.impressions)
      })),
      devices: baseData.performance.devices.map(device => ({
        ...device,
        clicks: Math.round(device.clicks * multiplier.clicks),
        impressions: Math.round(device.impressions * multiplier.impressions)
      }))
    }
  };
};
