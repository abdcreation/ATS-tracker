import React from 'react';
import type { Job, Candidate } from '../types';

interface DashboardStatsProps {
  jobs: Job[];
  candidates: Candidate[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ jobs, candidates }) => {
  const activeJobs = jobs.filter(j => j.status === 'Active').length;
  const totalApplicants = candidates.length;
  
  // Calculate average score
  const avgScore = totalApplicants > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / totalApplicants)
    : 0;

  // Candidates currently in interviews
  const interviewCount = candidates.filter(c => c.status === 'Interview').length;

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <h3>Active Jobs</h3>
        <div className="metric-value">{activeJobs}</div>
      </div>
      <div className="metric-card">
        <h3>Total Applicants</h3>
        <div className="metric-value">{totalApplicants}</div>
      </div>
      <div className="metric-card">
        <h3>Average Match Score</h3>
        <div className="metric-value" style={{ color: avgScore >= 80 ? '#10b981' : avgScore >= 60 ? '#f59e0b' : '#ef4444' }}>
          {avgScore}%
        </div>
      </div>
      <div className="metric-card">
        <h3>In Interview Stage</h3>
        <div className="metric-value">{interviewCount}</div>
      </div>
    </div>
  );
};
