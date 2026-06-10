import React from 'react';
import type { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onSelect, onDelete }) => {
  // Determine score badge style based on matching percentage
  const getScoreClass = (score: number) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', candidate.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className="candidate-card" 
      draggable
      onDragStart={handleDragStart}
      onClick={onSelect}
    >
      <div className="cand-header">
        <div className="cand-name">{candidate.name}</div>
        <div className={`score-badge ${getScoreClass(candidate.score)}`}>
          {candidate.score}%
        </div>
      </div>

      <div className="cand-meta">
        {candidate.email && <div>✉️ {candidate.email}</div>}
        {candidate.experienceText && (
          <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            💼 {candidate.experienceText.replace(/\n/g, ' ').slice(0, 40)}...
          </div>
        )}
      </div>

      <div className="cand-skills">
        {candidate.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="cand-skill-tag">{skill}</span>
        ))}
        {candidate.skills.length > 3 && (
          <span className="cand-skill-tag" style={{ border: 'none', background: 'transparent', paddingLeft: 0 }}>
            +{candidate.skills.length - 3}
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Remove applicant "${candidate.name}" from this job?`)) {
            onDelete(e);
          }
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          cursor: 'pointer',
          textAlign: 'right',
          marginTop: '0.2rem',
          alignSelf: 'flex-end',
          padding: '0.2rem'
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--danger)')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        Remove
      </button>
    </div>
  );
};
