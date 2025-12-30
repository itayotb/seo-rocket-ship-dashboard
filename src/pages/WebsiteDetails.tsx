import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteOverview from '@/components/website-details/SiteOverview';
import SEODetails from '@/components/website-details/SEODetails';
import ContentManagement from '@/components/website-details/ContentManagement';
import KeywordSection from '@/components/website-details/KeywordSection';
import SearchConsole from '@/components/website-details/SearchConsole';
import ContentEditorDialog from '@/components/website-details/ContentEditorDialog';
import { Website, ContentItem } from '@/types/website';

const WebsiteDetails = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - in a real app, this would come from an API call using the id
  const website: Website = {
    id: id || '1',
    name: 'TechCorp Solutions',
    domain: 'techcorp.com',
    status: 'active',
    seoScore: 87,
    mobileSpeed: 92,
    desktopSpeed: 95,
    googlePosition: 3,
    rankingChange: 'up',
    uniqueContent: 95,
    thumbnail: '',
    lastUpdated: '2 hours ago',
    category: 'technology',
    totalClicks: 12500
  };

  // Mock content data that will be shared across components
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'page',
      title: 'About Us',
      url: '/about',
      status: 'published',
      seoScore: 92,
      lastModified: '2 days ago',
      content: 'Welcome to our company! We are a leading technology solutions provider dedicated to helping businesses transform their digital presence. Our team of experienced professionals brings together years of expertise in web development, digital marketing, and business strategy.\n\nFounded in 2015, we have successfully helped over 500 businesses achieve their online goals. Our comprehensive approach combines cutting-edge technology with proven marketing strategies to deliver measurable results.\n\nOur mission is to empower businesses with the tools and knowledge they need to succeed in the digital age. We believe that every business, regardless of size, deserves access to professional-grade digital solutions.',
      metaDescription: 'Learn about our company, mission, and the experienced team behind our innovative technology solutions. Discover how we help businesses succeed online.',
      wordCount: 142
    },
    {
      id: '2',
      type: 'post',
      title: 'Latest Technology Trends',
      url: '/blog/tech-trends',
      status: 'published',
      seoScore: 78,
      lastModified: '1 week ago',
      content: 'The technology landscape is constantly evolving, and staying ahead of the curve is crucial for business success. In this comprehensive guide, we explore the most significant technology trends that are shaping the future of business.\n\nArtificial Intelligence and Machine Learning continue to revolutionize how businesses operate. From chatbots to predictive analytics, AI is becoming an integral part of modern business strategy.\n\nCloud computing has reached new heights of adoption, with businesses of all sizes migrating to cloud-first architectures for better scalability and cost efficiency.',
      metaDescription: 'Discover the latest technology trends shaping business success. Learn about AI, cloud computing, and emerging technologies.',
      wordCount: 98
    },
    {
      id: '3',
      type: 'page',
      title: 'Services',
      url: '/services',
      status: 'review',
      seoScore: 65,
      lastModified: '3 days ago',
      content: 'Our comprehensive suite of services is designed to meet all your digital needs. We offer web development, digital marketing, SEO optimization, and strategic consulting.\n\nWeb Development: Custom websites and applications built with modern technologies.\nDigital Marketing: Complete marketing strategies to grow your online presence.\nSEO Services: Improve your search engine rankings and organic traffic.',
      metaDescription: 'Explore our comprehensive digital services including web development, marketing, and SEO optimization.',
      wordCount: 67
    }
  ]);

  // Content Editor Dialog state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedContentItem, setSelectedContentItem] = useState<ContentItem | null>(null);

  const handleContentUpdate = (updatedItems: ContentItem[]) => {
    setContentItems(updatedItems);
  };

  const handleSeoRefresh = () => {
    console.log('Refreshing SEO analysis...');
  };

  const handleEditContent = (item: ContentItem) => {
    setSelectedContentItem(item);
    setIsEditorOpen(true);
  };

  const handleSaveFromSeoEditor = (updatedItem: ContentItem) => {
    const updatedItems = contentItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setContentItems(updatedItems);
    setIsEditorOpen(false);
    setSelectedContentItem(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {website.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 break-all">{website.domain}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-6 sm:space-y-8">
            <SiteOverview website={website} />
            <SEODetails 
              website={website} 
              contentItems={contentItems}
              onRefresh={handleSeoRefresh}
              onContentUpdate={handleContentUpdate}
              onEditContent={handleEditContent}
            />
            <SearchConsole website={website} />
            <ContentManagement 
              website={website} 
              contentItems={contentItems}
              onContentUpdate={handleContentUpdate}
            />
            <KeywordSection website={website} />
          </div>
        </div>
      </div>

      {/* Content Editor Dialog for SEO fixes */}
      <ContentEditorDialog
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        contentItem={selectedContentItem}
        onSave={handleSaveFromSeoEditor}
      />
    </>
  );
};

export default WebsiteDetails;
