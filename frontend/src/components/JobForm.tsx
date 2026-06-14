import React, { useState } from 'react';
import type { Job } from '../types';

interface JobFormProps {
  onSubmit: (jobData: Omit<Job, 'id' | 'createdAt' | 'status'>) => void;
  onCancel: () => void;
}

export const JobForm: React.FC<JobFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [experience, setExperience] = useState(0);
  const [education, setEducation] = useState("Bachelor's");
  const [skillsText, setSkillsText] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Job Title and Job Description are required.");
      return;
    }

    // Split skills by commas and trim whitespace
    const skills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    onSubmit({
      title,
      department,
      location,
      type,
      experience: Number(experience),
      education,
      skills,
      description
    });
  };

  return (
    <div className="job-form-container">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        Create Job Posting
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title *</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. Senior Frontend Engineer" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Department</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Engineering" 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. San Francisco, CA (Hybrid)" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Job Type</label>
            <select 
              className="form-select" 
              value={type} 
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="form-group">
            <label>Required Experience (Years)</label>
            <input 
              type="number" 
              className="form-input" 
              min={0}
              value={experience} 
              onChange={(e) => setExperience(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Minimum Education Level</label>
          <select 
            className="form-select" 
            value={education} 
            onChange={(e) => setEducation(e.target.value)}
          >
            <option value="Any">Any / No preference</option>
            <option value="Bachelor's">Bachelor's Degree</option>
            <option value="Master's">Master's Degree</option>
            <option value="PhD">PhD / Doctorate</option>
          </select>
        </div>

        <div className="form-group">
          <label>Target Skills Keywords (Comma-separated)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. React, TypeScript, Redux, Git, Webpack" 
            value={skillsText} 
            onChange={(e) => setSkillsText(e.target.value)}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            These exact keywords will be used to calculate candidate's ATS Match Score.
          </p>
        </div>

        <div className="form-group">
          <label>Job Description *</label>
          <textarea 
            className="form-textarea" 
            placeholder="Enter the full description, role responsibilities, and qualifications..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Publish Job Posting
          </button>
        </div>
      </form>
    </div>
  );
};
