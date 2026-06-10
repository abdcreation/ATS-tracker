const { parseResume, scoreResumeAgainstJob } = require('./parser');

// 1. Mock Job Posting
const mockJob = {
  title: "React Web Developer",
  skills: ["React", "TypeScript", "Redux", "CSS", "HTML", "Jest", "Git"],
  experience: 3,
  education: "Bachelor's"
};

// 2. Mock Resume Text
const mockResumeText = `
Johnathan Doe
Software Developer
Email: johnathan.doe@workmail.net
Phone: +1 555-442-9981
Web: github.com/johndoe-dev, linkedin.com/in/johndoedev

Summary:
Enthusiastic front-end software developer with 4 years of experience building high-quality interfaces.
Expertise in React development, writing TypeScript codes, and designing responsive CSS layouts.

Skills:
React, TypeScript, CSS, HTML, Git, TailwindCSS, Node.js, PostgreSQL

Work History:
Software Developer at DevCorp (2023 - Present)
- Crafted responsive templates using HTML and CSS.
- Developed React state management with standard context hooks.
- Configured local Git repositories for team collaboration.

Web Developer Intern at Pixel Labs (2022 - 2023)
- Maintained legacy JavaScript products.

Education:
Bachelor of Science in Computer Science
State University of New York (2018 - 2022)
`;

console.log("=== RUNNING RESUME PARSER TEST ===");
const parsed = parseResume(mockResumeText);

console.log("\n--- Parsed Candidate Info ---");
console.log("Name:", parsed.name);
console.log("Email:", parsed.email);
console.log("Phone:", parsed.phone);
console.log("Links:", parsed.links);
console.log("Experience Years (estimated):", parsed.experienceYears);
console.log("Extracted Skills (total", parsed.skills.length, "):", parsed.skills);

console.log("\n--- Scoring against Job: React Web Developer ---");
const scoring = scoreResumeAgainstJob(parsed, mockJob);
console.log("Overall Score:", scoring.score, "/ 100");
console.log("Score Breakdown:", scoring.scoreBreakdown);
console.log("Matched Skills:", scoring.matchedSkills);
console.log("Missing Skills:", scoring.missingSkills);
console.log("Suggestions:");
scoring.suggestions.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));

if (scoring.score > 70 && parsed.email === "johnathan.doe@workmail.net" && scoring.matchedSkills.includes("React")) {
  console.log("\nParser verification: SUCCESS!");
} else {
  console.log("\nParser verification: FAILED - check output data.");
}
