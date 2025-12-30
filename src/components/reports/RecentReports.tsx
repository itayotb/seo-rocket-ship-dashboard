
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, TrendingUp, Download } from 'lucide-react';

const RecentReports = () => {
  const recentReports = [
    {
      id: 1,
      name: 'Monthly SEO Performance',
      type: 'Performance Report',
      date: '2024-01-15',
      status: 'completed',
      metrics: {
        totalClicks: 125000,
        avgPosition: 12.5,
        impressions: 890000
      }
    },
    {
      id: 2,
      name: 'Keyword Analysis Report',
      type: 'Keyword Report',
      date: '2024-01-14',
      status: 'completed',
      metrics: {
        totalKeywords: 450,
        avgPosition: 15.2,
        topKeywords: 23
      }
    },
    {
      id: 3,
      name: 'Technical SEO Audit',
      type: 'Audit Report',
      date: '2024-01-13',
      status: 'processing',
      metrics: {
        issuesFound: 8,
        criticalIssues: 2,
        fixedIssues: 15
      }
    },
    {
      id: 4,
      name: 'Backlink Analysis',
      type: 'Link Report',
      date: '2024-01-12',
      status: 'completed',
      metrics: {
        totalBacklinks: 1250,
        domainAuthority: 45,
        newLinks: 23
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Recent Reports</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {report.type}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{report.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Object.values(report.metrics)[0].toLocaleString()}
                    </span>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                    {report.status}
                  </Badge>
                </div>
                
                {report.status === 'completed' && (
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full">
            View All Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReports;
