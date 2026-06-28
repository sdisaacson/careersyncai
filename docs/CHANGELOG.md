# Changelog

All notable changes to CareerSync AI.

---

## [0.1.0] — 2025-06-27

### Initial Release

CareerSync AI is a full-stack AI-powered job matching and resume tailoring platform.

### Features

#### Authentication & User Management

- Email/password registration with bcrypt hashing
- JWT session authentication with HTTP-only cookies
- Email verification flow with Resend
- Password reset flow with secure tokens
- Role-based access control (user / admin)
- Admin dashboard with user management

#### Resume Pipeline (5-Step Journey)

- **Step 1 — Upload**: Client-side PDF/DOCX parsing with structured profile extraction
- **Step 2 — Interview**: 8-question adaptive AI interview with live profile sidebar
- **Step 3 — Research**: Simulated parallel agent research across 8 economic sectors
- **Step 4 — Results**: Filterable, sortable job dashboard with fit scoring
- **Step 5 — Resumes**: 100+ individually tailored resumes with download (HTML/ZIP)

#### Job Discovery

- 8 sector agents: Technology, Healthcare, Finance, Energy, Education, Manufacturing, Consulting, Government
- Fit score calculation (0-100) based on skills, experience, location, work type
- Job filtering by sector, fit score, status, search text
- Grid and list view modes
- Job detail drawer with apply links
- Status tracking: discovered → shortlisted → applied → archived

#### Resume Tailoring

- Sector-specific tailoring templates (15 sectors)
- Narrative summary per job
- Keyword analysis (matched vs missing)
- HTML resume renderer
- Batch download (ZIP)
- Multi-select mode for bulk operations

#### Data Sheet

- Complete 100-role data table
- Column customization (show/hide)
- CSV and JSON export
- Print view
- Side-by-side job comparison (up to 3)
- Summary analytics cards

#### Admin Portal

- Dashboard with user/subscription stats
- User list with role management
- Subscription management
- App settings configuration (API keys, plans)

#### UI/UX

- Dark theme with custom CSS variables
- Responsive design (mobile, tablet, desktop)
- Framer Motion animations throughout
- Neural canvas background animation
- Animated counters and progress indicators
- Smooth scroll with Lenis
- shadcn/ui component library (50+ components)

#### Tech Stack

- React 19 + TypeScript + Vite
- Hono backend with tRPC
- PostgreSQL + Drizzle ORM
- Tailwind CSS + shadcn/ui
- Framer Motion + GSAP animations

### Known Issues

- Demo mode uses mock data for job research (designed for real API integration)
- Stripe integration is mocked (creates active subscriptions directly)
- Email sending falls back to console logging without Resend API key
- Some footer links are placeholder (`href="/"`)

### Database

- 10 tables: users, profiles, interviews, interviewQuestions, sectors, jobs, tailoredResumes, researchSessions, subscriptions, appSettings
- 7 enums for status/role fields
- Full migration history in `db/migrations/`

---

## Future Roadmap

### Planned

- [ ] Live job board API integrations (LinkedIn, Indeed, etc.)
- [ ] Real Moonshot AI integration for dynamic resume tailoring
- [ ] Cover letter generation
- [ ] Interview preparation materials
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

### Under Consideration

- [ ] OAuth providers (Google, GitHub, LinkedIn)
- [ ] Resume template marketplace
- [ ] ATS compatibility checker
- [ ] Salary negotiation assistant
