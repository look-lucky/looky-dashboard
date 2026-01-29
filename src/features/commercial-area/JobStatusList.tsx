import { RefreshCw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

// API for job status is not yet clear in AdminService (it returns string on upload, potentially a jobId or message).
// For now I will simulate a job status list that adds a new 'Pending' job when trigger changes.

interface Job {
    id: string;
    name: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    progress: number;
    createdAt: Date;
}

interface JobStatusListProps {
    refreshTrigger: number;
}

export function JobStatusList({ refreshTrigger }: JobStatusListProps) {
    const [jobs, setJobs] = useState<Job[]>([
        { id: 'job-123', name: '상권 데이터_20240128.xlsx', status: 'COMPLETED', progress: 100, createdAt: new Date(Date.now() - 86400000) }
    ]);

    useEffect(() => {
        // Simulate adding a new job when refreshTrigger increments (upload started)
        if (refreshTrigger > 0) {
            const newJob: Job = {
                id: `job-${Date.now()}`,
                name: `상권_데이터_업로드_${new Date().toLocaleTimeString()}.xlsx`,
                status: 'PROCESSING',
                progress: 0,
                createdAt: new Date()
            };
            setJobs(prev => [newJob, ...prev]);

            // Simulate progress
            let currentProgress = 0;
            const interval = setInterval(() => {
                currentProgress += 10;
                setJobs(prev => prev.map(job =>
                    job.id === newJob.id
                        ? { ...job, progress: currentProgress, status: currentProgress >= 100 ? 'COMPLETED' : 'PROCESSING' }
                        : job
                ));
                if (currentProgress >= 100) clearInterval(interval);
            }, 500);
        }
    }, [refreshTrigger]);

    return (
        <div className="space-y-4">
            <div className="flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {jobs.map((job) => (
                        <li key={job.id} className="py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    {job.status === 'COMPLETED' && <CheckCircle className="h-6 w-6 text-green-500" />}
                                    {job.status === 'PROCESSING' && <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />}
                                    {job.status === 'PENDING' && <Clock className="h-6 w-6 text-gray-400" />}
                                    {job.status === 'FAILED' && <AlertTriangle className="h-6 w-6 text-red-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {job.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {job.createdAt.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <div className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white">
                                        {job.status === 'PROCESSING' ? `${job.progress}%` : job.status}
                                    </div>
                                </div>
                            </div>
                            {job.status === 'PROCESSING' && (
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${job.progress}%` }}></div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
