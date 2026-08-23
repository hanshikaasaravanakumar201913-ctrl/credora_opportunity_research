# Credora — Career Opportunity Intelligence & Decision-Support Platform

> **Tagline:** *"Research. Compare. Verify. Decide."*  
> **Brand Message:** *"Know more before you decide."*

---

## 📌 Project Overview

**Credora** is a career opportunity research and decision-support web application designed primarily for college students and fresh graduates who discover unfamiliar internships, jobs, online courses, training programs, or opportunities through websites, WhatsApp, Telegram, LinkedIn, email, and social media.

### Core Philosophy
**Credora is NOT merely a binary scam detector or red/green flag tool.**

Credora organizes fragmented public records, digital touchpoints, corporate registration indices, and opportunity parameters into a transparent **Research Dossier** to help students make informed, confident career decisions.

```
       [ Unfamiliar Opportunity / Message / URL ]
                          │
                          ▼
            ┌───────────────────────────┐
            │   Credora Research Hub    │
            └─────────────┬─────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
┌─────────────────┐ ┌───────────┐ ┌──────────────────┐
│ Company Dossier │ │  Message  │ │ Multi-Opportunity│
│ & Registry Info │ │ Warnings  │ │  Compare Matrix  │
└─────────────────┘ └───────────┘ └──────────────────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                          ▼
       ┌──────────────────────────────────────┐
       │     13-Section Research Report       │
       │   "Research. Compare. Verify. Decide."│
       └──────────────────────────────────────┘
```

---

## 🚀 Key Features

1. **Complete Company / Organization Research Dossier**
   - Multi-modal input: Company Name, Official Website, Job Posting URL, Pasted Message, or Forwarded Email.
   - Comprehensive profiling: Incorporation records, CIN/LLP registration, physical headquarters, domain age, website SSL status, milestones, employee scale, and Glassdoor/AmbitionBox ratings.
   - Source provenance tracking for every claim (`VERIFIED`, `POSSIBLY OUTDATED`, `INCOMPLETE`, `CONFLICTING`, `NOT VERIFIED`).
   - Explicit zero-fabrication guarantee: *"Information not available from the sources checked."*

2. **Smart Raw Message Analysis & Indicator Extraction**
   - Accepts raw text from WhatsApp forwards, Telegram channels, LinkedIn InMails, or campus emails.
   - Automatically detects 18+ attributes: Recruiter names, fees, security deposits, upfront payments, compensation claims, shortened URLs (bit.ly/tinyurl), free personal webmail domains (`@gmail.com`), and artificial urgency pressure.
   - Evaluates risk levels (`LOW RISK`, `MODERATE RISK`, `HIGH RISK`, `INSUFFICIENT INFORMATION`) with evidence-based reasoning.

3. **Transparent 8-Factor Credibility Scoring (0–100)**
   - Auditable composite index across 8 dimensions:
     1. Company Existence
     2. Website Credibility
     3. Company History
     4. Public Presence
     5. Contact Verification
     6. Opportunity Consistency
     7. Information Completeness
     8. Risk Indicators
   - Categorized signals: Positive Signals, Warning Signals, High-Risk Signals, Unknown Information.

4. **Multi-Opportunity Side-by-Side Comparison Matrix**
   - Interactive selector allowing side-by-side comparison of **2 to 5 opportunities**.
   - Evaluates: Interest Alignment (%), Skill Match (%), Credibility Score, Risk Index, Learning Potential, Stipend/Salary, Work Mode, Duration, Eligibility, and Key Pros/Cons.
   - Tailored **"Best Match For You"** recommendation narrative that balances **Career Fit + Credibility + Risk + Learning Quality**.

5. **Contact Discovery & Independent Verification Toolkit**
   - Aggregates verified public contact channels grouped by source (Official Website, LinkedIn, Corporate Directory).
   - Ready-to-use formal email templates for students to independently inquire with an organization's HR desk.

6. **13-Section Full Research Report with PDF / Print Export**
   - Executive Summary, Company Overview, Opportunity Details, Credibility Breakdown, Risk Indicators, Positive Signals, Information Gaps, Source Verification, Contact Channels, Career Relevance, Benchmark Comparison, Recommendation, and Audit Timestamp.
   - Instant 1-click **Print / Save as PDF** formatting.

7. **Student Profile & Personalization Engine**
   - Stores degree, branch, graduation year, verified skills, career goals, preferred roles, locations, and work modes.
   - Updates skill overlap and opportunity match ratings dynamically.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite | Lightning-fast, modern reactive UI |
| **Styling** | Tailwind CSS + Lucide Icons | Surrealism + Minimalism design system with dark/light themes |
| **Backend** | Node.js + Express + TypeScript | Modular, scalable REST API architecture |
| **Database** | SQLite / PostgreSQL via Prisma ORM | Relational data integrity with full migrations |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs | Secure stateless student authentication |
| **AI / Heuristics** | Deterministic Heuristic Engine + Gemini Adapter | Extraction & multi-factor trust calculation |
| **Exports** | Print-to-PDF stylesheet engine | High-resolution printable research reports |

---

## 📂 Project Structure

```
credora/
├── backend/
│   ├── src/
│   │   ├── ai/
│   │   │   ├── heuristicAnalyzer.ts   # Rule-based multi-attribute & risk extractor
│   │   │   └── geminiAdapter.ts       # Extensible Gemini AI synthesis adapter
│   │   ├── controllers/               # Route controllers (Auth, Company, Opportunity, etc.)
│   │   ├── integrations/
│   │   │   ├── providers/             # Search, Domain, Registry, Reputation providers
│   │   │   └── externalData.ts        # Unified provider aggregator
│   │   ├── middleware/                # JWT Auth middleware & validation
│   │   ├── routes/
│   │   │   └── api.routes.ts          # Central REST API route definitions
│   │   ├── services/                  # Business logic (Credibility, Comparison, Report, etc.)
│   │   ├── prisma.ts                  # Shared Prisma client instance
│   │   └── index.ts                   # Express server entry point
│   ├── prisma/
│   │   ├── schema.prisma              # Relational schema
│   │   └── seed.ts                    # Realistic demo database seeder
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/                # Reusable UI (Navbar, Sidebar, UniversalSearch, Gauge, etc.)
│   │   ├── contexts/                  # AuthContext with 1-click persona switcher, ThemeContext
│   │   ├── layouts/                   # DashboardLayout & PublicLayout
│   │   ├── pages/                     # 17 interactive pages (Search, Message, Compare, etc.)
│   │   ├── services/
│   │   │   └── api.ts                 # Typed API client wrapper
│   │   ├── types/                     # Shared TypeScript interfaces
│   │   ├── App.tsx                    # React Router configuration
│   │   ├── main.tsx
│   │   └── index.css                  # Tailwind CSS design system & print styles
│   ├── package.json
│   └── vite.config.ts
├── start-all.bat                      # One-click Windows launcher
└── README.md
```

---

## ⚙️ Installation & Running

### Option 1: 1-Click Launch (Windows)
Double-click [`start-all.bat`](file:///c:/Users/Priyadharshini/Desktop/credora/start-all.bat) in the project root.

### Option 2: Terminal Launch
```powershell
# 1. Start Backend
cd backend
npm run dev

# 2. In another terminal, start Frontend
cd frontend
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 🔑 Demo Student Credentials

For instant evaluation without manual typing, Credora includes a **1-Click Profile Switcher** in the top navigation and login page:

| Student Persona | Email | Password | Academic Profile |
|---|---|---|---|
| **Alex Chen (Default)** | `student@credora.io` | `password123` | B.Tech CSE '26 (Python, React, SQL, Cloud) |
| **Priya Sharma** | `priya.sharma@college.edu` | `password123` | M.Sc Data Science '25 (PyTorch, ML, SQL) |
