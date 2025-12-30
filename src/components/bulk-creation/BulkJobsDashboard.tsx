import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { BulkCreationJob } from '@/types/bulkWebsiteCreation';
import BulkJobCard from './BulkJobCard';
import BulkJobDetails from './BulkJobDetails';

interface BulkJobsDashboardProps {
  jobs: BulkCreationJob[];
  onPause: (jobId: string) => void;
  onResume: (jobId: string) => void;
  onCancel: (jobId: string) => void;
}

const BulkJobsDashboard = ({ jobs, onPause, onResume, onCancel }: BulkJobsDashboardProps) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  const activeJobs = jobs.filter((j) => j.status === 'running' || j.status === 'paused');
  const completedJobs = jobs.filter((j) => j.status === 'completed');

  const totalSitesCreated = jobs.reduce((sum, j) => sum + j.progress.completed, 0);

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  if (selectedJob) {
    return (
      <BulkJobDetails
        job={selectedJob}
        onBack={() => setSelectedJobId(null)}
        onPause={onPause}
        onResume={onResume}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bulk Jobs Dashboard</h2>
        <p className="text-muted-foreground">Manage your bulk website creation jobs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{jobs.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{activeJobs.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{completedJobs.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Sites Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalSitesCreated}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {activeJobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Jobs</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeJobs.map((job) => (
              <BulkJobCard 
                key={job.id} 
                job={job} 
                onPause={onPause} 
                onResume={onResume} 
                onCancel={onCancel}
                onViewDetails={setSelectedJobId}
              />
            ))}
          </div>
        </div>
      )}

      {completedJobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Completed Jobs</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedJobs.map((job) => (
              <BulkJobCard 
                key={job.id} 
                job={job} 
                onPause={onPause} 
                onResume={onResume} 
                onCancel={onCancel}
                onViewDetails={setSelectedJobId}
              />
            ))}
          </div>
        </div>
      )}

      {jobs.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No bulk jobs yet</p>
            <p className="text-muted-foreground">Start a bulk creation to see jobs here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkJobsDashboard;
