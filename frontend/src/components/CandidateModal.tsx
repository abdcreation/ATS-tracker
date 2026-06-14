import React, { useState } from 'react';
import type { Candidate } from '../types';

interface CandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
  onStatusChange: (candidateId: string, newStatus: Candidate['status']) => void;
  onDelete: (candidateId: string) => void;
}

type TabType = 'report' | 'details' | 'raw';

export const CandidateModal: React.FC<CandidateModalProps> = ({
  candidate,
  onClose,
  onStatusChange,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('report');

  // SVG parameters for circular match progress bar
  const radius = 55;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (candidate.score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>
              {candidate.name}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {candidate.email && <span>✉️ {candidate.email}</span>}
              {candidate.phone && <span>📞 {candidate.phone}</span>}
              {candidate.links && candidate.links.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span>🔗</span>
                  {candidate.links.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.startsWith('http') ? link : `https://${link}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: 'var(--border-focus)', textDecoration: 'none' }}
                      onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {link.replace(/(https?:\/\/)?(www\.)?/, '').split('/')[0]}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Tabs Navigation */}
          <div className="tabs-container">
            <button 
              className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
              onClick={() => setActiveTab('report')}
            >
              Assessment Report
            </button>
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Extracted Resume Data
            </button>
            <button 
              className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
              onClick={() => setActiveTab('raw')}
            >
              Raw Resume Text
            </button>
          </div>

          {/* ASSESSMENT REPORT TAB */}
          {activeTab === 'report' && (
            <div className="report-grid">
              
              {/* Score breakdown side panel */}
              <div className="report-sidebar">
                <div className="score-circle-container">
                  <div className="score-circle">
                    <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`} width="100%" height="100%">
                      <circle
                        className="bg-ring"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                      />
                      <circle
                        className="score-ring"
                        stroke={getScoreColor(candidate.score)}
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                      />
                    </svg>
                    <div className="score-text-center">
                      <span className="score-val" style={{ color: getScoreColor(candidate.score) }}>
                        {candidate.score}
                      </span>
                      <span className="score-label">Match Score</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Overall evaluation against target role profile.
                  </div>
                </div>

                <div className="report-section" style={{ padding: '1.2rem' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Score Breakdown
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Skills Match</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{candidate.scoreBreakdown.skills} / 50</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Experience Heuristic</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{candidate.scoreBreakdown.experience} / 30</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Education credentials</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{candidate.scoreBreakdown.education} / 10</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Completeness check</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{candidate.scoreBreakdown.completeness} / 10</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions and skills detail */}
              <div className="report-main">
                {/* Skills Analysis */}
                <div className="report-section">
                  <h4>Skills Keyword Match</h4>
                  <div className="skills-comparison">
                    <div className="skills-column matched-list">
                      <h5>Matched Skills ({candidate.matchedSkills.length})</h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {candidate.matchedSkills.length === 0 ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None found</span>
                        ) : (
                          candidate.matchedSkills.map((s, idx) => (
                            <span key={idx} className="skill-tag" style={{ background: 'var(--success-glow)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                              ✓ {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="skills-column missing-list">
                      <h5>Missing Keywords ({candidate.missingSkills.length})</h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {candidate.missingSkills.length === 0 ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</span>
                        ) : (
                          candidate.missingSkills.map((s, idx) => (
                            <span key={idx} className="skill-tag" style={{ background: 'var(--danger-glow)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                              ⚡ {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optimizations */}
                <div className="report-section">
                  <h4>Actionable Suggestions</h4>
                  <div className="suggestions-list">
                    {candidate.suggestions.length === 0 ? (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No recommendations. This candidate perfectly matches the job profile!</div>
                    ) : (
                      candidate.suggestions.map((item, idx) => (
                        <div key={idx} className="suggestion-item">
                          <span className="suggestion-icon">💡</span>
                          <span>{item}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* EXTRACTED DETAILS TAB */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="report-section">
                <h4>Extracted Skills List</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {candidate.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="report-section">
                <h4>Experience Summary</h4>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {candidate.experienceText || "No structured experience section parsed."}
                </div>
              </div>

              <div className="report-section">
                <h4>Education Details</h4>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {candidate.educationText || "No education section parsed."}
                </div>
              </div>
            </div>
          )}

          {/* RAW TEXT TAB */}
          {activeTab === 'raw' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Below is the raw text extracted from the candidate's uploaded resume file.
              </p>
              <div className="raw-text-box">
                {candidate.resumeText}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: '1.2rem 2rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Recruitment Phase:</span>
            <select 
              className="form-select" 
              value={candidate.status}
              onChange={(e) => onStatusChange(candidate.id, e.target.value as Candidate['status'])}
              style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.8rem' }}
            >
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Close Assessment
            </button>
            <button 
              className="btn btn-danger" 
              onClick={() => {
                if (confirm(`Are you sure you want to delete candidate ${candidate.name}?`)) {
                  onDelete(candidate.id);
                  onClose();
                }
              }}
            >
              Delete Applicant
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
