## ⚖️ ClearClause 
Making Legal Contracts Legible for Everyone.

ClearClause is a premium AI-powered legal document analyzer designed to strip away "legalese" and expose hidden risks. We provide a privacy-first, instant audit of your contracts so you can sign with confidence.

## 🛑 The Problem
Legal documents are intentionally complex. Most people sign contracts without fully understanding them because:

Hidden Risks: Unfair "Limitation of Liability" or "Termination" clauses are buried in fine print.

Costly Advice: Consulting a lawyer for every minor document is expensive and slow.

Privacy Concerns: Existing AI tools often store your sensitive documents to train their models.

## ✅ The Solution
ClearClause solves this by providing a high-speed, AI-driven "risk radar" that:

Categorizes Risk: Instantly flags clauses as "High Risk" (Red), "Medium Risk" (Orange), or "Secure" (Green).

Privacy-First Architecture: Operates on a non-retention basis. Your documents are processed in real-time and deleted the moment you close the session.

Accessibility: Translates complex legal jargon into plain English summaries.

## ✨ Core Features
Smart PDF Analysis: Drag-and-drop PDF files for instant scanning.

AI Risk Radar: Visual breakdown of ambiguous terms and unfair clauses.

Premium UI/UX: A minimalist, "Sora-inspired" interface optimized for both mobile and laptop 

Secure Auth: Supabase-backed user accounts to manage your profile securely.

## 📱 Design Philosophy: Mobile-First
ClearClause is built for the modern user.We intentionally prioritized the **mobile experience** 
to ensure that document analysis is accessible during meetings, at signing tables, or on the move.
While we support laptop views, the most "premium" and polished experience is found on mobile devices.

## 🛠️ Tech Stack
Frontend: React.js, Tailwind CSS

Backend & Database: NodeJS, Express, Supabase (PostgreSQL + Auth)

AI Engine: Google Gemini AI, Model(gemini-2.5-flash)

Deployment: Vercel for frontend, Render for backend

## 🚀 How to Run & Test

ClearClause is divided into two main directories:frontend and backend. You will need to run both simultaneously for the application to function.

1. Prerequisites
   
Node.js (v18+ recommended)

npm or yarn

A Supabase account and a Google Gemini API key.

3. Installation & Setup
   
First, clone the repository:

git clone https://github.com/Houria-hs/ClearClause--CWThackathon-teamOdin.git

cd ClearClause--CWThackathon-teamOdin


🛠️ Backend Setup

Navigate to the backend folder:

cd backend

Install dependencies:

npm install

Create a .env file in the backend folder:

PORT=5000

DATABASE_URL=your_supabase_db_url

GEMINI_API_KEY=your_gemini_api_key

JWT_SECRET=your_custom_jwt_secret

Start the backend server:

npm start


💻 Frontend Setup

Open a new terminal window and navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Create a .env file in the frontend folder:
VITE_API_URL=https://clearclause-975k.onrender.com

Start the frontend development server

npm run dev

5. Testing
   
UI Testing: Check the "Laptop View" vs "Mobile View" by resizing your browser.

Upload Test: Use a sample PDF to test the scanning animation and risk categorization.

Auth Test: Register a new account and verify the login flow.

## 🌐 Live Deployment
The project is live and can be accessed here:

👉 https://clearclause-six.vercel.app/

## 📄 Privacy Policy
ClearClause does not store your documents. We use a transient data-processing pipeline that ensures your legal information stays yours.
