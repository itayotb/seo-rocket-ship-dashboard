
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Zap, Smartphone, Monitor } from 'lucide-react';
import { Website } from '@/types/website';
import { WebsiteSeoAnalysis } from '@/utils/websiteSeoAnalyzer';

interface SeoScoreCardProps {
  website: Website;
  seoAnalysis: WebsiteSeoAnalysis | null;
  isAnalyzing: boolean;
}

const SeoScoreCard: React.FC<SeoScoreCardProps> = ({
  website,
  seoAnalysis,
  isAnalyzing
}) => {
  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🏆';
    if (score >= 75) return '🥇';
    if (score >= 60) return '🥈';
    return '🥉';
  };

  const getMotivationalMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You're crushing it! 🎉";
    if (score >= 75) return "Great work! Just a few tweaks to perfection ✨";
    if (score >= 60) return "Good foundation! Let's boost this higher 📈";
    return "Every expert was once a beginner. Let's improve! 💪";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-blue-600 dark:text-blue-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (score >= 75) return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    if (score >= 60) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  if (isAnalyzing) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-0">
          <div className="text-center space-y-4">
            <div className="text-4xl animate-pulse">🔍</div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Analyzing Your SEO...</h3>
            <p className="text-blue-700 dark:text-blue-300">Hang tight while we crunch the numbers!</p>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall SEO Score */}
      <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <CardContent className="p-0">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl animate-bounce">{seoAnalysis ? getScoreEmoji(seoAnalysis.overallScore) : '📊'}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Overall SEO Score</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your site's optimization level</p>
              </div>
            </div>
            
            {seoAnalysis && (
              <>
                <div className={`text-4xl font-bold ${getScoreColor(seoAnalysis.overallScore)} transition-all duration-500`}>
                  {seoAnalysis.overallScore}/100
                </div>
                
                <div className="relative">
                  <Progress 
                    value={seoAnalysis.overallScore} 
                    className="h-3 bg-gray-200 dark:bg-gray-700"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ${getProgressColor(seoAnalysis.overallScore)}`}
                    style={{ width: `${seoAnalysis.overallScore}%` }}
                  />
                </div>
                
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 italic">
                  {getMotivationalMessage(seoAnalysis.overallScore)}
                </p>
                
                {seoAnalysis.totalIssues > 0 && (
                  <div className="flex justify-center space-x-2">
                    {seoAnalysis.criticalIssues > 0 && (
                      <Badge variant="destructive" className="animate-pulse">
                        🚨 {seoAnalysis.criticalIssues} Critical
                      </Badge>
                    )}
                    {seoAnalysis.warningIssues > 0 && (
                      <Badge variant="secondary">
                        ⚠️ {seoAnalysis.warningIssues} Warnings
                      </Badge>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Speed & Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 transition-all duration-300 hover:shadow-md hover:scale-105">
          <CardContent className="p-0 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">📱</span>
              <Smartphone className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">{website.mobileSpeed}</div>
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">Mobile Speed</div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800 transition-all duration-300 hover:shadow-md hover:scale-105">
          <CardContent className="p-0 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">💻</span>
              <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{website.desktopSpeed}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Desktop Speed</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeoScoreCard;
