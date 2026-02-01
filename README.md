⚖️ ClearClause 
Making Legal Contracts Legible for Everyone.

ClearClause is a premium AI-powered legal document analyzer designed to strip away "legalese" and expose hidden risks. We provide a privacy-first, instant audit of your contracts so you can sign with confidence.

🛑 The Problem
Legal documents are intentionally complex. Most people sign contracts without fully understanding them because:

Hidden Risks: Unfair "Limitation of Liability" or "Termination" clauses are buried in fine print.

Costly Advice: Consulting a lawyer for every minor document is expensive and slow.

Privacy Concerns: Existing AI tools often store your sensitive documents to train their models.

✅ The Solution
ClearClause solves this by providing a high-speed, AI-driven "risk radar" that:

Categorizes Risk: Instantly flags clauses as "High Risk" (Red), "Medium Risk" (Orange), or "Secure" (Green).

Privacy-First Architecture: Operates on a non-retention basis. Your documents are processed in real-time and deleted the moment you close the session.

Accessibility: Translates complex legal jargon into plain English summaries.

✨ Core Features
Smart PDF Analysis: Drag-and-drop PDF, DOCS, or PNG files for instant scanning.

AI Risk Radar: Visual breakdown of ambiguous terms and unfair clauses.

Premium UI/UX: A minimalist, "Sora-inspired" interface optimized for both mobile and laptop.

Secure Auth: Firebase-backed user accounts to manage your profile.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS

Backend & Auth: NodeJS, Express, Firebase

Deployment: Vercel for frontend, Render for backend

🚀 How to Run & Test
Follow these steps to get your local environment running:

1. Prerequisites
Ensure you have Node.js (v16+) and npm installed.

2. Installation

# Clone the repository
git clone https://github.com/Houria-hs/CWThackathon-teamOdin.git

# Enter the directory
cd clearclause

# Install dependencies
npm install

3. Environment Setup
Create a .env file in the root directory and add your supabase and AI API credentials:
DATABASE_URL=your_db_Url
GEMINI_API_KEY=you_API_Key

4. Running Locally
Bash
# Start the development server
npm run dev
Navigate to http://localhost:5173 to view the app.

5. Testing
UI Testing: Check the "Laptop View" vs "Mobile View" by resizing your browser.

Upload Test: Use a sample PDF to test the scanning animation and risk categorization.

Auth Test: Register a new account and verify the login flow.

🌐 Live Deployment
The project is live and can be accessed here:

👉 https://clearclause-six.vercel.app/

📄 Privacy Policy
ClearClause does not store your documents. We use a transient data-processing pipeline that ensures your legal information stays yours.
