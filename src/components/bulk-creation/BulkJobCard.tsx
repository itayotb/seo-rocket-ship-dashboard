import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, X, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { BulkCreationJob } from '@/types/bulkWebsiteCreation';
import { format } from 'date-fns';

interface BulkJobCardProps {
  job: BulkCreationJob;
  onPause: (jobId: string) => void;
  onResume: (jobId: string) => void;
  onCancel: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
}

const BulkJobCard = ({ job, onPause, onResume, onCancel, onViewDetails }: BulkJobCardProps) => {
  const progressPercent = (job.progress.completed / job.progress.total) * 100;

  const getStatusBadge = () => {
    switch (job.status) {
      case 'running':
        return <Badge className="bg-blue-500"><Play className="h-3 w-3 mr-1" /> Running</Badge>;
      case 'paused':
        return <Badge variant="secondary"><Pause className="h-3 w-3 mr-1" /> Paused</Badge>;
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onViewDetails(job.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{job.name}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{job.progress.completed} / {job.progress.total}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          {job.progress.currentKeyword && job.status === 'running' && (
            <p className="text-xs text-muted-foreground">Creating: {job.progress.currentKeyword}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Templates:</span>
            <p className="font-medium truncate">{job.templateDistribution.length} selected</p>
          </div>
          <div>
            <span className="text-muted-foreground">Created:</span>
            <p className="font-medium">{format(new Date(job.createdAt), 'MMM d, HH:mm')}</p>
          </div>
        </div>

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" onClick={() => onViewDetails(job.id)}>
            <Eye className="h-4 w-4 mr-1" /> Details
          </Button>
          {job.status !== 'completed' && job.status !== 'failed' && (
            <>
              {job.status === 'running' ? (
                <Button variant="outline" size="sm" onClick={() => onPause(job.id)}>
                  <Pause className="h-4 w-4 mr-1" /> Pause
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => onResume(job.id)}>
                  <Play className="h-4 w-4 mr-1" /> Resume
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={() => onCancel(job.id)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkJobCard;
