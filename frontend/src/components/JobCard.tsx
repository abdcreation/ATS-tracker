import React from 'react';
import type { Job, Candidate } from '../types';

interface JobCardProps {
  job: Job;
  candidates: Candidate[];
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, candidates, onClick, onDelete }) => {
  const jobCandidates = candidates.filter(c => c.jobId === job.id);
  const applicantCount = jobCandidates.length;

  return (
    <div className="job-card" onClick={onClick}>
      <span className="job-badge">{job.type}</span>
      <h3 className="job-title">{job.title}</h3>
      
      <div className="job-meta">
        <div className="job-meta-item">
          <span>📁</span> {job.department}
        </div>
        <div className="job-meta-item">
          <span>📍</span> {job.location}
        </div>
        <div className="job-meta-item">
          <span>👤</span> {applicantCount} {applicantCount === 1 ? 'Applicant' : 'Applicants'}
        </div>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="job-skills">
        {job.skills.slice(0, 5).map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
        {job.skills.length > 5 && (
          <span className="skill-tag" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
            +{job.skills.length - 5} more
          </span>
        )}
      </div>

      <button 
        className="btn btn-secondary" 
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Are you sure you want to delete the job "${job.title}"? This will also remove all its candidates.`)) {
            onDelete(e);
          }
        }}
        style={{
          marginTop: '0.8rem',
          padding: '0.4rem 0.8rem',
          fontSize: '0.8rem',
          color: 'var(--danger)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
          background: 'rgba(239, 68, 68, 0.05)',
          alignSelf: 'flex-start'
        }}
      >
        Delete Job
      </button>
    </div>
  );
};
