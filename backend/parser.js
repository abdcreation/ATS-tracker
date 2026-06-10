const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const urlRegex = /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

// A broad list of common industry skills across various disciplines
const SKILLS_DICTIONARY = [
  // Programming Languages
  "javascript", "typescript", "python", "java", "c\\+\\+", "c#", "ruby", "php", "go", "rust", "swift", "kotlin", "scala", "r", "sql", "html", "css", "sass", "less", "bash", "shell",
  // Frontend Frameworks & Tech
  "react", "angular", "vue", "svelte", "next\\.js", "nuxt", "redux", "tailwind", "bootstrap", "webpack", "vite", "gulp", "jquery", "gatsby", "remix", "preact",
  // Backend & Databases
  "node\\.js", "express", "django", "flask", "fastapi", "spring boot", "asp\\.net", "ruby on rails", "graphql", "rest api", "restful api", "mongodb", "postgresql", "mysql", "sqlite", "redis", "elasticsearch", "dynamodb", "firebase", "supabase", "cassandra", "oracle",
  // Cloud & DevOps
  "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform", "ci/cd", "jenkins", "github actions", "circleci", "ansible", "linux", "unix", "nginx", "apache", "serverless", "lambda", "ecs", "ec2", "s3",
  // Testing
  "jest", "mocha", "chai", "cypress", "playwright", "selenium", "junit", "pytest", "testing library",
  // Design & UI/UX
  "figma", "sketch", "adobe xd", "photoshop", "illustrator", "ui design", "ux design", "ux research", "prototyping", "wireframing", "user flows", "typography", "interaction design", "visual design",
  // Management & Methodologies
  "git", "github", "gitlab", "bitbucket", "jira", "confluence", "trello", "agile", "scrum", "kanban", "project management", "product management", "product roadmap", "sdlc",
  // Data Science, ML & AI
  "machine learning", "deep learning", "artificial intelligence", "data science", "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn", "keras", "data analysis", "tableau", "power bi", "analytics"
];

// Helper to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extracts sections from a resume based on common header titles.
 */
function extractSections(text) {
  const sections = {
    experience: "",
    education: "",
    skills: ""
  };

  const lines = text.split('\n');
  let currentSection = null;

  // Simple section headers matching
  const expHeaders = /work experience|experience|employment history|professional history|career history/i;
  const eduHeaders = /education|academic background|qualifications/i;
  const skillHeaders = /skills|technical skills|technologies|expertise/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) continue;

    // Check if line is a header
    if (expHeaders.test(line) && line.length < 30) {
      currentSection = "experience";
      continue;
    } else if (eduHeaders.test(line) && line.length < 30) {
      currentSection = "education";
      continue;
    } else if (skillHeaders.test(line) && line.length < 30) {
      currentSection = "skills";
      continue;
    }

    // Append to current section
    if (currentSection) {
      sections[currentSection] += line + "\n";
    }
  }

  // Fallback if structured headers are not parsed cleanly
  if (!sections.experience) {
    // Take a guess based on some keywords or just use a default search
    sections.experience = text;
  }
  if (!sections.education) {
    sections.education = text;
  }
  if (!sections.skills) {
    sections.skills = text;
  }

  return sections;
}

/**
 * Parse raw resume text and extract key parameters.
 */
function parseResume(text) {
  const lowercaseText = text.toLowerCase();
  
  // 1. Extract Contact Info
  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  const urls = text.match(urlRegex) || [];
  
  const email = emails[0] || "";
  const phone = phones[0] || "";
  
  // Filter URLs to extract portfolio/socials like linkedin, github
  const links = urls.filter(url => 
    url.includes('linkedin.com') || 
    url.includes('github.com') || 
    url.includes('portfolio') || 
    url.includes('behance.net') || 
    url.includes('dribbble.com')
  );

  // Attempt to extract name (usually first non-empty line of the text)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let name = "Unknown Candidate";
  if (lines.length > 0) {
    // Avoid choosing headers like "Resume" or contact details as the name
    let lineIdx = 0;
    while (lineIdx < Math.min(lines.length, 3)) {
      const line = lines[lineIdx];
      if (!emailRegex.test(line) && !phoneRegex.test(line) && line.length > 2 && line.length < 40 && !/resume|cv/i.test(line)) {
        name = line;
        break;
      }
      lineIdx++;
    }
  }

  // 2. Extract Skills
  const extractedSkills = [];
  SKILLS_DICTIONARY.forEach(skillPattern => {
    // Match word boundaries, taking care of special characters like c++ or next.js
    const cleanPattern = skillPattern.replace(/\\\+/g, '\\+').replace(/\\\./g, '\\.');
    const regex = new RegExp(`\\b${cleanPattern}\\b|\\b${cleanPattern.replace(' ', '\\s+')}\\b`, 'gi');
    
    // Custom check for C++ since word boundaries like \b don't play nicely with +
    if (skillPattern === "c\\+\\+") {
      const cppRegex = /c\+\+/gi;
      if (cppRegex.test(lowercaseText)) {
        extractedSkills.push("C++");
      }
    } else {
      if (regex.test(lowercaseText)) {
        // Find nice capitalized name from dictionary pattern
        let displayName = skillPattern.replace(/\\/g, '');
        // Capitalize nicely
        if (displayName === "javascript") displayName = "JavaScript";
        else if (displayName === "typescript") displayName = "TypeScript";
        else if (displayName === "react") displayName = "React";
        else if (displayName === "vue") displayName = "Vue";
        else if (displayName === "svelte") displayName = "Svelte";
        else if (displayName === "node.js") displayName = "Node.js";
        else if (displayName === "next.js") displayName = "Next.js";
        else if (displayName === "html") displayName = "HTML";
        else if (displayName === "css") displayName = "CSS";
        else if (displayName === "postgresql") displayName = "PostgreSQL";
        else if (displayName === "mysql") displayName = "MySQL";
        else if (displayName === "sqlite") displayName = "SQLite";
        else if (displayName === "mongodb") displayName = "MongoDB";
        else if (displayName === "graphql") displayName = "GraphQL";
        else if (displayName === "aws") displayName = "AWS";
        else if (displayName === "gcp") displayName = "GCP";
        else if (displayName === "rest api" || displayName === "restful api") displayName = "REST API";
        else if (displayName === "github") displayName = "GitHub";
        else if (displayName === "gitlab") displayName = "GitLab";
        else if (displayName === "jira") displayName = "Jira";
        else if (displayName === "ui design") displayName = "UI Design";
        else if (displayName === "ux design") displayName = "UX Design";
        else if (displayName === "ux research") displayName = "UX Research";
        else if (displayName === "ci/cd") displayName = "CI/CD";
        else {
          // Default: capitalize words
          displayName = displayName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        extractedSkills.push(displayName);
      }
    }
  });

  // Unique skills list
  const uniqueSkills = [...new Set(extractedSkills)];

  // 3. Extract Section Blocks
  const sections = extractSections(text);

  // 4. Estimate Experience (years)
  // Search for phrases like "5 years of experience", "4+ years", etc.
  let experienceYears = 0;
  const expMentionRegex = /(\d+)\+?\s*(?:yr|year)s?\b(?:\s*of\s*experience|\s*experience)?/gi;
  let match;
  while ((match = expMentionRegex.exec(lowercaseText)) !== null) {
    const yrs = parseInt(match[1], 10);
    if (yrs > experienceYears && yrs < 35) {
      experienceYears = yrs;
    }
  }

  // If no direct year mentions, do a rough estimate based on job histories
  if (experienceYears === 0) {
    // Search for year ranges e.g. 2018-2022 or 2018 to Present
    const dateRangeRegex = /\b(19\d{2}|20\d{2})\s*[-–—to]+\s*(Present|20\d{2})\b/gi;
    let totalSpan = 0;
    while ((match = dateRangeRegex.exec(text)) !== null) {
      const startYear = parseInt(match[1], 10);
      const endWord = match[2];
      const endYear = endWord.toLowerCase() === 'present' ? new Date().getFullYear() : parseInt(endWord, 10);
      if (endYear >= startYear && (endYear - startYear) < 15) {
        totalSpan += (endYear - startYear);
      }
    }
    experienceYears = Math.min(Math.max(totalSpan, 0), 25);
  }

  return {
    name,
    email,
    phone,
    links,
    skills: uniqueSkills,
    experienceYears,
    experienceText: sections.experience.substring(0, 1000), // truncate
    educationText: sections.education.substring(0, 500),
    resumeText: text
  };
}

/**
 * Score parsed resume details against job requirements.
 */
function scoreResumeAgainstJob(parsedResume, job) {
  const { skills: resumeSkills, experienceYears: resumeExp, educationText, email, phone, experienceText } = parsedResume;
  const { skills: reqSkills = [], experience: reqExp = 0, education: reqEdu = "Bachelor's" } = job;

  let scoreBreakdown = {
    skills: 0,       // Max 50
    experience: 0,   // Max 30
    education: 0,    // Max 10
    completeness: 0  // Max 10
  };

  const suggestions = [];

  // --- 1. Skills Scoring (Max 50) ---
  const matchedSkills = [];
  const missingSkills = [];

  reqSkills.forEach(reqSkill => {
    const matched = resumeSkills.some(skill => 
      skill.toLowerCase() === reqSkill.toLowerCase() ||
      (reqSkill.toLowerCase() === 'rest api' && skill.toLowerCase().includes('api'))
    );
    if (matched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  if (reqSkills.length > 0) {
    const matchRatio = matchedSkills.length / reqSkills.length;
    scoreBreakdown.skills = Math.round(matchRatio * 50);
  } else {
    // If no specific skills required, give full skill score
    scoreBreakdown.skills = 50;
  }

  // Add recommendations for missing skills
  missingSkills.forEach(skill => {
    suggestions.push(`Consider adding experience with '${skill}' to align with job requirements.`);
  });

  // --- 2. Experience Scoring (Max 30) ---
  // If candidate has >= required experience, give max points. Otherwise scale down.
  if (reqExp === 0) {
    scoreBreakdown.experience = 30;
  } else {
    const expRatio = Math.min(resumeExp / reqExp, 1);
    scoreBreakdown.experience = Math.round(expRatio * 30);
    if (resumeExp < reqExp) {
      suggestions.push(`Job requires ${reqExp} years of experience; parsed resume shows approx. ${resumeExp} years.`);
    }
  }

  // --- 3. Education Scoring (Max 10) ---
  // Heuristic matching for degrees
  const eduLower = educationText.toLowerCase();
  const degreeLevels = {
    "phd": ["phd", "ph.d", "doctorate", "doctor of philosophy"],
    "master's": ["master", "ms", "ma", "mba", "m.sc", "m.s"],
    "bachelor's": ["bachelor", "bs", "ba", "b.s", "b.a", "b.sc", "b.tech", "degree in"]
  };

  let hasRequiredEdu = false;
  const reqEduLower = reqEdu.toLowerCase();

  if (reqEduLower.includes('any') || reqEduLower.includes('none')) {
    hasRequiredEdu = true;
  } else {
    // Check degree level mapping
    let requiredDegreeGroup = [];
    if (reqEduLower.includes('phd') || reqEduLower.includes('doctor')) {
      requiredDegreeGroup = [...degreeLevels["phd"]];
    } else if (reqEduLower.includes('master')) {
      requiredDegreeGroup = [...degreeLevels["phd"], ...degreeLevels["master's"]];
    } else {
      requiredDegreeGroup = [...degreeLevels["phd"], ...degreeLevels["master's"], ...degreeLevels["bachelor's"]];
    }

    hasRequiredEdu = requiredDegreeGroup.some(keyword => {
      const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i');
      return regex.test(eduLower);
    });
  }

  if (hasRequiredEdu) {
    scoreBreakdown.education = 10;
  } else {
    scoreBreakdown.education = 5; // Partial credit if not found but text exists
    suggestions.push(`Ensure your educational credentials (e.g. ${reqEdu} degree) are clearly listed in the Education section.`);
  }

  // --- 4. Resume Completeness (Max 10) ---
  let completenessPoints = 0;
  if (email) completenessPoints += 2.5;
  if (phone) completenessPoints += 2.5;
  if (resumeSkills.length >= 5) completenessPoints += 2.5;
  if (experienceText.length > 100) completenessPoints += 2.5;
  
  scoreBreakdown.completeness = Math.round(completenessPoints);

  if (!email) suggestions.push("Add a contact email address.");
  if (!phone) suggestions.push("Add a contact phone number.");
  if (resumeSkills.length < 5) suggestions.push("List more of your specific technical and professional skills.");

  // Overall Score
  const score = scoreBreakdown.skills + scoreBreakdown.experience + scoreBreakdown.education + scoreBreakdown.completeness;

  // Add a generic positive message if score is high
  if (score >= 85) {
    suggestions.unshift("Strong candidate profile: Excellent alignment with core requirements and skills!");
  } else if (score >= 70) {
    suggestions.unshift("Good candidate profile: Fits major requirements, but has some areas for improvement.");
  }

  return {
    score,
    scoreBreakdown,
    matchedSkills,
    missingSkills,
    suggestions: suggestions.slice(0, 5) // Return top 5 suggestions
  };
}

module.exports = {
  parseResume,
  scoreResumeAgainstJob
};
