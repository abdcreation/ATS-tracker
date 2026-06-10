export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  skills: string[];
  experience: number;
  education: string;
  status: 'Active' | 'Draft' | 'Closed';
  createdAt: string;
}

export interface ScoreBreakdown {
  skills: number;
  experience: number;
  education: number;
  completeness: number;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  links: string[];
  skills: string[];
  experienceText: string;
  educationText: string;
  resumeText: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  status: 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Rejected';
  createdAt: string;
}
