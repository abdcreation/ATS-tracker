const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

const defaultData = {
  jobs: [
    {
      id: "job-1",
      title: "Senior React Developer",
      department: "Engineering",
      location: "San Francisco, CA (Hybrid)",
      type: "Full-time",
      description: "We are looking for a Senior Frontend Engineer with deep expertise in React, TypeScript, and modern state management. You will build user-facing features, design premium interfaces, and optimize performance.",
      skills: ["React", "TypeScript", "Redux", "CSS", "HTML", "Webpack", "Git", "Jest"],
      experience: 5,
      education: "Bachelor's",
      status: "Active",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
    },
    {
      id: "job-2",
      title: "Python Backend Engineer",
      department: "Engineering",
      location: "Remote (US/Canada)",
      type: "Full-time",
      description: "Join our core services team to design, build, and maintain robust API systems. You will work extensively with Python, Django, PostgreSQL, Docker, and AWS services. Experience with Redis and background task queues (Celery) is a major plus.",
      skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS", "Redis", "REST API", "Git"],
      experience: 3,
      education: "Bachelor's",
      status: "Active",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    },
    {
      id: "job-3",
      title: "Product Designer",
      department: "Design",
      location: "New York, NY",
      type: "Contract",
      description: "We are seeking a talented Product Designer to own user research, prototyping, and UI design for our main client portal. Expertise in Figma, prototyping, user flows, and typography is required.",
      skills: ["Figma", "UI Design", "UX Research", "Prototyping", "Wireframing", "Typography", "CSS"],
      experience: 4,
      education: "Any",
      status: "Active",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    }
  ],
  candidates: [
    {
      id: "cand-1",
      jobId: "job-1",
      name: "Alex Rivera",
      email: "alex.rivera@email.com",
      phone: "+1 (555) 019-2834",
      links: ["linkedin.com/in/alexrivera", "github.com/alexr-dev"],
      skills: ["React", "TypeScript", "Redux", "CSS", "HTML", "Git", "Jest", "Tailwind", "Next.js"],
      experienceText: "Senior Software Engineer at TechCorp (3 years). Built responsive React web apps, reduced load times by 40%. Software Developer at WebFlow (2 years). worked with React, Redux, and CSS.",
      educationText: "BS in Computer Science from Stanford University",
      resumeText: "Alex Rivera\nalex.rivera@email.com\n+1 (555) 019-2834\nlinkedin.com/in/alexrivera\ngithub.com/alexr-dev\n\nSKILLS:\nReact, TypeScript, Redux, CSS, HTML, Git, Jest, Tailwind, Next.js\n\nEXPERIENCE:\nSenior Software Engineer at TechCorp (2023 - Present)\n- Built responsive React web apps\n- Reduced load times by 40%\n\nSoftware Developer at WebFlow (2021 - 2023)\n- Worked with React, Redux, and CSS\n\nEDUCATION:\nBS in Computer Science, Stanford University",
      score: 95,
      scoreBreakdown: {
        skills: 50,
        experience: 25,
        education: 10,
        completeness: 10
      },
      matchedSkills: ["React", "TypeScript", "Redux", "CSS", "HTML", "Git", "Jest"],
      missingSkills: ["Webpack"],
      suggestions: [
        "Include mentions of 'Webpack' or bundling tools if you have worked with them.",
        "Your experience aligns well with the requirements."
      ],
      status: "Interview",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "cand-2",
      jobId: "job-1",
      name: "Sarah Chen",
      email: "sarah.chen@techmail.net",
      phone: "+1 (555) 120-4492",
      links: ["linkedin.com/in/sarahchen"],
      skills: ["React", "CSS", "HTML", "Git", "Javascript", "Bootstrap"],
      experienceText: "Junior Web Developer at PixelCraft (2 years). Maintained client websites using Javascript, HTML, and Bootstrap.",
      educationText: "Self-taught, Associate Degree in Graphic Design",
      resumeText: "Sarah Chen\nsarah.chen@techmail.net\n+1 (555) 120-4492\nlinkedin.com/in/sarahchen\n\nSummary:\nWeb Developer passionate about CSS and React.\n\nSkills:\nReact, CSS, HTML, Git, Javascript, Bootstrap\n\nExperience:\nJunior Web Developer at PixelCraft (2024 - Present)\n- Maintained client websites using Javascript, HTML, and Bootstrap.\n\nEducation:\nAssociate Degree in Graphic Design",
      score: 55,
      scoreBreakdown: {
        skills: 25,
        experience: 10,
        education: 10,
        completeness: 10
      },
      matchedSkills: ["React", "CSS", "HTML", "Git"],
      missingSkills: ["TypeScript", "Redux", "Webpack", "Jest"],
      suggestions: [
        "Add core skill 'TypeScript' to your resume, as it is a key requirement.",
        "Gain experience with 'Redux' or state management systems.",
        "Mention unit testing libraries like 'Jest' to improve testing alignment.",
        "Experience level is slightly below the requested 5 years (estimated 2 years)."
      ],
      status: "Screening",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "cand-3",
      jobId: "job-2",
      name: "Marcus Johnson",
      email: "marcus.j@codeflow.io",
      phone: "+1 (555) 998-3821",
      links: ["github.com/marcusj-codes"],
      skills: ["Python", "Django", "PostgreSQL", "Docker", "REST API", "Git", "Flask", "SQLAlchemy"],
      experienceText: "Software Engineer at DevGrid (4 years). Built backend REST APIs with Python and Flask. Configured Docker containers for deployment.",
      educationText: "Bachelor of Science in Software Engineering, UT Austin",
      resumeText: "Marcus Johnson\nmarcus.j@codeflow.io\n+1 (555) 998-3821\ngithub.com/marcusj-codes\n\nProfile:\nBackend software engineer specializing in Python and API architectures.\n\nSkills:\nPython, Django, PostgreSQL, Docker, REST API, Git, Flask, SQLAlchemy\n\nExperience:\nSoftware Engineer at DevGrid (2022 - Present)\n- Built backend REST APIs with Python and Flask\n- Configured Docker containers for deployment\n\nEducation:\nBS in Software Engineering, UT Austin",
      score: 85,
      scoreBreakdown: {
        skills: 38,
        experience: 27,
        education: 10,
        completeness: 10
      },
      matchedSkills: ["Python", "Django", "PostgreSQL", "Docker", "REST API", "Git"],
      missingSkills: ["AWS", "Redis"],
      suggestions: [
        "Add cloud services experience (like 'AWS') to your resume.",
        "Add database caching experience (like 'Redis') to your resume.",
        "Excellent alignment on Python and framework experience."
      ],
      status: "Applied",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(defaultData);
      return defaultData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB file:', error);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing DB file:', error);
    return false;
  }
}

module.exports = {
  readDb,
  writeDb
};
