import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  Lightbulb,
  TrendingUp,
  Wand2,
  Edit,
  RefreshCw
} from 'lucide-react';
import { SeoIssue } from '@/types/seo';
import { getSeverityColor } from '@/utils/seo';

interface SeoIssueCardProps {
  issue: SeoIssue;
}

const SeoIssueCard: React.FC<SeoIssueCardProps> = ({ issue }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const { toast } = useToast();

  const getSeverityIcon = () => {
    switch (issue.severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = () => {
    switch (issue.severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'info':
        return <Badge variant="outline">Info</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  const handleAutoFix = async () => {
    if (!issue.autoFixAction) return;
    
    setIsFixing(true);
    try {
      await issue.autoFixAction();
      toast({
        title: "Auto-fix Applied",
        description: "The SEO issue has been automatically fixed.",
      });
    } catch (error) {
      toast({
        title: "Auto-fix Failed",
        description: "Could not automatically fix this issue. Please try manual editing.",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  const handleNavigateToEdit = () => {
    if (issue.navigateToFix) {
      issue.navigateToFix();
    }
  };

  return (
    <Card className={`border-l-4 ${getSeverityColor(issue.severity)}`}>
      <CardContent className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-3">
            {getSeverityIcon()}
            <div>
              <h4 className="font-medium">{issue.title}</h4>
              <p className="text-sm text-gray-600">{issue.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getSeverityBadge()}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-900">Recommendation</h5>
                  <p className="text-sm text-blue-800">{issue.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-green-900">Expected Impact</h5>
                  <p className="text-sm text-green-800">{issue.impact}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              {issue.canAutoFix && issue.autoFixAction && (
                <Button 
                  size="sm" 
                  onClick={handleAutoFix}
                  disabled={isFixing}
                  className="flex-1"
                >
                  {isFixing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Auto Fix
                    </>
                  )}
                </Button>
              )}
              
              {issue.navigateToFix && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleNavigateToEdit}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Content
                </Button>
              )}
            </div>

            {/* Legacy quick fix support */}
            {issue.quickFix && !issue.canAutoFix && (
              <div className="pt-2">
                <Button 
                  size="sm" 
                  onClick={issue.quickFix.action}
                  className="w-full"
                >
                  {issue.quickFix.label}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeoIssueCard;
