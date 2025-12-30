import { useState, useCallback } from 'react';
import { BulkCreationJob, BulkCreationData, BulkKeywordEntry } from '@/types/bulkWebsiteCreation';
import { simulateWebsiteCreation, distributeLeadForms, distributeTemplates, distributeRegistrars } from '@/utils/bulkCreationMock';
import { useToast } from '@/hooks/use-toast';

const initialData: BulkCreationData = {
  keywords: [],
  domainMode: 'auto',
  defaultTld: '.com',
  templateDistribution: [],
  registrarDistribution: [],
  category: 'all',
  leadFormDistribution: [],
  scheduling: { mode: 'immediate' },
};

export function useBulkCreation() {
  const [jobs, setJobs] = useState<BulkCreationJob[]>([]);
  const [currentData, setCurrentData] = useState<BulkCreationData>(initialData);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const updateData = useCallback((updates: Partial<BulkCreationData>) => {
    setCurrentData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetData = useCallback(() => {
    setCurrentData(initialData);
  }, []);

  const createJob = useCallback(async (data: BulkCreationData): Promise<BulkCreationJob> => {
    const validKeywords = data.keywords.filter((kw) => kw.keyword.trim());
    
    const job: BulkCreationJob = {
      id: `job-${Date.now()}`,
      name: `Bulk Job - ${validKeywords.length} sites`,
      status: 'pending',
      keywords: validKeywords,
      domainMode: data.domainMode,
      defaultTld: data.defaultTld,
      templateDistribution: data.templateDistribution,
      registrarDistribution: data.registrarDistribution,
      category: data.category,
      leadFormDistribution: data.leadFormDistribution,
      scheduling: data.scheduling,
      createdAt: new Date().toISOString(),
      progress: { completed: 0, total: validKeywords.length },
      createdWebsites: [],
    };

    setJobs((prev) => [job, ...prev]);
    return job;
  }, []);

  const startJob = useCallback(async (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, status: 'running', startedAt: new Date().toISOString() } : j
      )
    );

    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const leadFormMap = distributeLeadForms(job.keywords, job.leadFormDistribution);
    const templateMap = distributeTemplates(job.keywords, job.templateDistribution);
    const registrarMap = distributeRegistrars(job.keywords, job.registrarDistribution);

    for (let i = 0; i < job.keywords.length; i++) {
      const kw = job.keywords[i];
      const leadFormId = leadFormMap.get(kw.id) || '';
      const templateInfo = templateMap.get(kw.id) || { templateId: '', templateName: '' };

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, progress: { ...j.progress, currentKeyword: kw.keyword } }
            : j
        )
      );

      const website = await simulateWebsiteCreation(
        kw, templateInfo.templateId, templateInfo.templateName, job.category, leadFormId
      );

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                progress: { ...j.progress, completed: i + 1 },
                createdWebsites: [...j.createdWebsites, website],
              }
            : j
        )
      );
    }

    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: 'completed', completedAt: new Date().toISOString() }
          : j
      )
    );

    toast({ title: 'Bulk creation completed', description: `Created ${job.keywords.length} websites` });
  }, [jobs, toast]);

  const pauseJob = useCallback((jobId: string) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'paused' } : j)));
  }, []);

  const resumeJob = useCallback((jobId: string) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'running' } : j)));
  }, []);

  const cancelJob = useCallback((jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  return {
    jobs,
    currentData,
    isCreating,
    setIsCreating,
    updateData,
    resetData,
    createJob,
    startJob,
    pauseJob,
    resumeJob,
    cancelJob,
  };
}
