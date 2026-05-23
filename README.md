# PrepWise — AI-Powered Mock Interview Platform

PrepWise is a production-grade, full-stack mock interview platform designed to help technical candidates prepare for interviews. Users upload their PDF resumes to extract skills, receive custom AI-generated technical questions tailored to their expertise, submit answers, and get structured question-by-question scoring and feedback powered by LLMs.

---

## Key Features

*   **Secure Authentication**: JWT-based user register/login flow with encrypted password hashing.
*   **Resume Skill Extraction**: Parses text from uploaded PDF resumes and automatically extracts matching tech stack badges (React, Node, Java, etc.) using `pdf-parse`.
*   **Tailored Questions**: Generates exactly 5 targeted technical interview questions using the OpenRouter API (model: `stepfun/step-3.5-flash:free`) based on the candidate's skills.
*   **AI Grading & Summary Feedback**: Scores candidate responses (0 to 10 scale per question) and generates a detailed corrective critique block pointing out strengths and improvements.
*   **Interview History Logs**: Preserves previous mock session records to track score progression over time.
*   **Premium Dark UI**: Refined dark, editorial style utilizing modern glassmorphism panels, Google Fonts (`Syne` + `DM Sans`), and clean stagger transitions powered by `framer-motion`.

---

## Tech Stack

### Backend
*   **Runtime**: Node.js & Express
*   **Database**: MongoDB (Object data modeling via Mongoose)
*   **File Handlers**: Multer (Memory buffers, 5MB file upload limit)
*   **Text Parser**: `pdf-parse` (Extracts textual contents from PDF documents)
*   **LLM Gateway**: OpenRouter API (`stepfun/step-3.5-flash:free` model)

### Frontend
*   **Bundler & Dev Server**: Vite (Vite React + TypeScript template)
*   **Framework**: React (v18)
*   **Styling**: Tailwind CSS & custom CSS variables
*   **Motion**: Framer Motion
*   **Icons**: Lucide React
*   **Navigation**: React Router DOM (v6)

---

## Project Structure

```text
PrepWise/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB database connection configuration
│   │   ├── controllers/     # Controller logic (Auth, Resume Parsing, LLM Simulator)
│   │   ├── middlewares/     # JWT authentication & Multer upload middleware
│   │   ├── models/          # Mongoose Schemas (User, Resume, Interview)
│   │   ├── routes/          # Express API route endpoints
│   │   └── app.js           # Server initializer & CORS rules (Port 5000)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/ui/   # RADIX & Tailwind CSS custom UI primitives
│   │   ├── hooks/           # useAuth token hooks
│   │   ├── lib/             # api.ts (HTTP fetch wrappers) & utils.ts (class merge)
│   │   ├── pages/           # Landing, Login, Register, Dashboard, Active, Results
│   │   ├── App.tsx          # Client-side router & route guard protection
│   │   ├── main.tsx         # React app mounting script
│   │   └── index.css        # Tailwind loading & custom styling vars
│   ├── index.html           # Google Fonts (Syne + DM Sans) & viewport setup
│   ├── vite.config.ts       # Path alias resolver & Port 8080 setup
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## API Documentation

All protected routes require the header `Authorization: Bearer <your_jwt_token>`.

### Authentication
*   `POST /api/auth/register` — Registers a new user.
    *   *Payload*: `{ "name": "...", "email": "...", "password": "..." }`
    *   *Returns*: `{ "message": "User registered", "token": "..." }`
*   `POST /api/auth/login` — Sign-in validation.
    *   *Payload*: `{ "email": "...", "password": "..." }`
    *   *Returns*: `{ "token": "..." }`

### Resume Management
*   `POST /api/resume/upload` *(Protected)* — Uploads and parses PDF resume.
    *   *Payload*: `multipart/form-data` with field name `resume` (PDF max 5MB).
    *   *Returns*: `{ "message": "...", "resumeId": "...", "extractedSkills": [...] }`

### Interview Simulator
*   `POST /api/interview/start` *(Protected)* — Generates questions.
    *   *Payload*: `{ "resumeId": "..." }`
    *   *Returns*: `{ "message": "...", "interviewId": "...", "questions": [...] }`
*   `POST /api/interview/submit` *(Protected)* — Submits answers.
    *   *Payload*: `{ "interviewId": "...", "answers": ["...", "..."] }` (Exactly 5 responses)
    *   *Returns*: `{ "message": "...", "scores": [8, 9, 7, 8, 6], "feedback": "..." }`
*   `GET /api/interview/history` *(Protected)* — Retrieves historical evaluations (excludes raw answers).
    *   *Returns*: Array of `{ _id, questions, scores, feedback, createdAt }`.

---

## Environment Configurations

### Backend Setup
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/prepwise
JWT_SECRET=your_jwt_secret_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---

## Local Run Guide

Follow these steps to run the application in a local development environment.

### 1. Prerequisite Checklist
*   Node.js (v18+ recommended)
*   MongoDB installed and running locally

### 2. Start the Backend
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Boot up the development server (runs on Port 5000):
    ```bash
    npm run dev
    ```

### 3. Start the Frontend
1.  Open a new terminal tab and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the Vite development server (runs on Port 8080):
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:8080](http://localhost:8080) in your web browser.
