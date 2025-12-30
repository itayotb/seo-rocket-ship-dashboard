
import React from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Smartphone, Monitor, Search, FileText, Globe, Trash2, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebsiteCardProps {
  website: {
    id: string;
    name: string;
    domain: string;
    status: 'active' | 'inactive';
    seoScore: number;
    pageSpeed: number;
    plagiarismScore: number;
    ranking: number;
    rankingChange: 'up' | 'down' | 'stable';
    thumbnail: string;
    lastUpdated: string;
    totalClicks?: number;
  };
  onViewDetails: (id: string) => void;
  onDeleteWebsite?: (id: string) => void;
}

const WebsiteCard = ({ website, onViewDetails, onDeleteWebsite }: WebsiteCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  const getRankingIcon = () => {
    switch (website.rankingChange) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <span className="h-4 w-4 bg-gray-400 rounded-full"></span>;
    }
  };

  const formatClicks = (clicks?: number) => {
    if (!clicks) return '0';
    if (clicks >= 1000000) return (clicks / 1000000).toFixed(1) + 'M';
    if (clicks >= 1000) return (clicks / 1000).toFixed(1) + 'K';
    return clicks.toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-gray-700">
            {website.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          website.status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {website.status === 'active' ? 'Live' : 'Offline'}
        </div>
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
          <button 
            className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
            onClick={() => window.open(`https://${website.domain}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 text-white" />
          </button>
          {onDeleteWebsite && (
            <button 
              className="p-2 bg-red-500/20 rounded-lg backdrop-blur-sm"
              onClick={() => onDeleteWebsite(website.id)}
            >
              <Trash2 className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">{website.name}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Globe className="h-4 w-4 mr-1" />
            {website.domain}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Search className="h-4 w-4 mr-2" />
                <span>Google Rank</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">#{website.ranking}</span>
                {getRankingIcon()}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Monitor className="h-4 w-4 mr-2" />
                <span>Speed</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(website.pageSpeed)}`}>
                {website.pageSpeed}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MousePointer className="h-4 w-4 mr-2" />
                <span>Clicks</span>
              </div>
              <span className="font-medium text-blue-600">
                {formatClicks(website.totalClicks)}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Search className="h-4 w-4 mr-2" />
                <span>SEO Score</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(website.seoScore)}`}>
                {website.seoScore}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FileText className="h-4 w-4 mr-2" />
                <span>Unique</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(website.plagiarismScore)}`}>
                {website.plagiarismScore}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-400">Updated {website.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default WebsiteCard;
