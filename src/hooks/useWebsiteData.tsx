
import { useState } from 'react';
import { Website } from '@/types/website';
import { CreatedWebsite } from '@/types/websiteCreation';

export const useWebsiteData = () => {
  // Enhanced mock data for websites with all required fields including categories
  const [websites, setWebsites] = useState<Website[]>([
    {
      id: '1',
      name: 'TechCorp Solutions',
      domain: 'techcorp.com',
      status: 'active' as const,
      seoScore: 87,
      mobileSpeed: 92,
      desktopSpeed: 95,
      googlePosition: 3,
      rankingChange: 'up' as const,
      uniqueContent: 95,
      thumbnail: '',
      lastUpdated: '2 hours ago',
      totalClicks: 15420,
      category: 'technology'
    },
    {
      id: '2',
      name: 'Green Earth Blog',
      domain: 'greenearthblog.com',
      status: 'active' as const,
      seoScore: 73,
      mobileSpeed: 88,
      desktopSpeed: 91,
      googlePosition: 12,
      rankingChange: 'down' as const,
      uniqueContent: 89,
      thumbnail: '',
      lastUpdated: '1 day ago',
      totalClicks: 8932,
      category: 'environment'
    },
    {
      id: '3',
      name: 'Fitness Pro',
      domain: 'fitnesspro.net',
      status: 'inactive' as const,
      seoScore: 65,
      mobileSpeed: 76,
      desktopSpeed: 82,
      googlePosition: 28,
      rankingChange: 'stable' as const,
      uniqueContent: 82,
      thumbnail: '',
      lastUpdated: '3 days ago',
      totalClicks: 3456,
      category: 'health'
    },
    {
      id: '4',
      name: 'Local Bakery',
      domain: 'localbakery.co',
      status: 'active' as const,
      seoScore: 91,
      mobileSpeed: 85,
      desktopSpeed: 89,
      googlePosition: 1,
      rankingChange: 'up' as const,
      uniqueContent: 97,
      thumbnail: '',
      lastUpdated: '1 hour ago',
      totalClicks: 22187,
      category: 'food'
    }
  ]);

  const addWebsite = (createdWebsite: CreatedWebsite) => {
    const newWebsite: Website = {
      id: createdWebsite.id,
      name: createdWebsite.name,
      domain: createdWebsite.domain,
      status: 'active',
      seoScore: 75,
      mobileSpeed: 85,
      desktopSpeed: 88,
      googlePosition: 15,
      rankingChange: 'stable',
      uniqueContent: 90,
      thumbnail: '',
      lastUpdated: 'just now',
      totalClicks: 0,
      category: createdWebsite.template.category
    };
    
    setWebsites(prev => [newWebsite, ...prev]);
  };

  return { websites, addWebsite };
};
