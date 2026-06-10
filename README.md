# Antigravity ATS - Smart Resume Screener & Candidate Tracker

A premium, full-stack Applicant Tracking System (ATS) built for clients and recruiters to manage job postings, parse candidate resumes, review automated keyword match analysis, and track applications on an interactive pipeline board.

## 🚀 Key Features

* **Recruiter Dashboard**: High-level counters showing Active Jobs, Total Applicants, Average Match Score, and Interview pipelines.
* **Resume Parsing Engine**: Automatically extracts name, email, phone number, URLs (LinkedIn/GitHub), estimated years of experience, and educations.
* **Match Score Analytics**: Ranks candidates on a 0-100% scale comparing their resume keywords against the job's target requirements (Skills, Experience, Education level).
* **Skills Comparison Grid**: Side-by-side display of matching terms and missing keywords, along with actionable optimization tips.
* **Interactive Kanban Board**: Native drag-and-drop recruiter pipeline board supporting stages: `Applied` ➔ `Screening` ➔ `Interview` ➔ `Offered` ➔ `Rejected`.
* **Batch Uploading**: Drop multiple resume PDF or TXT files at once to parse and score them concurrently.
* **JSON Persistence**: File-based storage to preserve candidates, scores, and job configurations across server restarts.

## 🛠️ Technology Stack

* **Frontend**: React, Vite, TypeScript, and custom Vanilla CSS (featuring HSL glassmorphic aesthetics, responsive layout grid, and custom scrollbars).
* **Backend**: Node.js, Express, Multer (in-memory file buffers), CORS, and PDF-Parse (for secure, offline PDF text extraction).
* **Database**: Local File-based JSON Database.

## 📂 Project Structure

```text
├── backend/
│   ├── db.js            # JSON database reader/writer helper
│   ├── parser.js        # Heuristic parser and scoring engine
│   ├── server.js        # Express API endpoints and upload handler
│   ├── test-parser.js   # Script to verify parsing rules
│   └── package.json     # Node scripts and dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # DashboardStats, JobCard, ResumeUpload, PipelineBoard, etc.
│   │   ├── types/       # TypeScript interface declarations
│   │   ├── App.tsx      # Main application state and routing coordinator
│   │   ├── index.css    # Premium CSS design tokens and layouts
│   │   └── main.tsx     # React renderer
│   ├── index.html       # Entry document
│   └── package.json     # Vite scripts and dependencies
└── .gitignore           # File and folder exclusions
```

## ⚙️ Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
The server will start listening on `http://localhost:5000`.

### 2. Start the Frontend Dev Environment
```bash
cd ../frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.
