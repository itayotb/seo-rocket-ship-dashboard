
import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SeoStatusIndicatorProps {
  status: 'good' | 'warning' | 'critical';
  label: string;
  value: string;
  compact?: boolean;
}

const SeoStatusIndicator: React.FC<SeoStatusIndicatorProps> = ({
  status,
  label,
  value,
  compact = false
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'good':
        return {
          icon: <CheckCircle className="h-4 w-4 animate-pulse" />,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          badgeVariant: 'default' as const,
          emoji: '✅'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-4 w-4 animate-pulse" />,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          badgeVariant: 'secondary' as const,
          emoji: '⚠️'
        };
      case 'critical':
        return {
          icon: <XCircle className="h-4 w-4 animate-pulse" />,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          badgeVariant: 'destructive' as const,
          emoji: '🚨'
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700',
          badgeVariant: 'outline' as const,
          emoji: '📊'
        };
    }
  };

  const config = getStatusConfig(status);

  if (compact) {
    return (
      <div className="flex items-center space-x-2 transition-all duration-300 hover:scale-105">
        <div className={config.color}>
          {config.icon}
        </div>
        <Badge variant={config.badgeVariant} className="text-xs animate-fade-in">
          {config.emoji} {value}
        </Badge>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-center space-x-3">
        <div className={`${config.color} transition-colors duration-300`}>
          {config.icon}
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <span>{label}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
            <span className="text-lg">{config.emoji}</span>
            <span>{value}</span>
          </div>
        </div>
      </div>
      <Badge variant={config.badgeVariant} className="animate-fade-in">
        {status === 'good' ? 'Perfect!' : status === 'warning' ? 'Needs Work' : 'Fix Now'}
      </Badge>
    </div>
  );
};

export default SeoStatusIndicator;
