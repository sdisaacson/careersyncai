# CareerSync AI

> AI-powered job matching and resume tailoring platform. Upload your resume, get interviewed by AI, discover 100+ matched opportunities across 8 sectors, and receive individually tailored resumes for every application.

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd careersync-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, APP_SECRET, etc.

# 4. Run database migrations
npm run db:migrate

# 5. Seed the database (optional)
npm run db:push
node db/seed.ts

# 6. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Tech Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| **Frontend**   | React 19 + TypeScript + Vite |
| **Styling**    | Tailwind CSS + shadcn/ui     |
| **Animations** | Framer Motion, GSAP, Lenis   |
| **Backend**    | Hono (Node.js) + tRPC        |
| **Database**   | PostgreSQL (Supabase)        |
| **ORM**        | Drizzle ORM                  |
| **Auth**       | JWT + bcrypt                 |
| **Email**      | Resend API                   |
| **AI**         | Moonshot API (optional)      |

---

## Available Scripts

| Script                | Description                                    |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Start Vite dev server with Hono backend        |
| `npm run build`       | Build frontend + bundle backend for production |
| `npm run start`       | Run production server (`dist/boot.js`)         |
| `npm run check`       | TypeScript type check                          |
| `npm run lint`        | ESLint                                         |
| `npm run format`      | Prettier format                                |
| `npm run test`        | Vitest                                         |
| `npm run db:generate` | Generate Drizzle migrations                    |
| `npm run db:migrate`  | Run Drizzle migrations                         |
| `npm run db:push`     | Push schema to database                        |

---

## Project Structure

```
├── api/                    # Backend (Hono + tRPC)
│   ├── auth/               # Auth utilities (JWT, session)
│   ├── lib/                # Backend helpers (email, env, cookies)
│   ├── queries/            # DB query helpers
│   ├── boot.ts             # Hono app entry
│   ├── router.ts           # tRPC router aggregation
│   ├── middleware.ts       # tRPC middleware (auth, roles)
│   └── *-router.ts         # Domain routers (auth, job, resume, etc.)
├── src/                    # Frontend (React)
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui components (50+)
│   │   ├── research/       # Research page components
│   │   └── resume/         # Resume page components
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Frontend utilities
│   └── providers/          # Context providers
├── db/                     # Database schema & migrations
│   ├── schema.ts           # Drizzle schema definitions
│   └── migrations/         # Generated SQL migrations
├── contracts/              # Shared types & constants
├── docs/                   # Documentation
│   └── how-it-works.md     # User guide
├── public/                 # Static assets
├── dist/                   # Build output
├── .env.example            # Environment variable template
├── vite.config.ts          # Vite configuration
├── drizzle.config.ts       # Drizzle ORM configuration
└── package.json
```

---

## Documentation

- [How It Works](docs/how-it-works.md) — End-user guide to the 5-step journey
- [Contributing](docs/CONTRIBUTING.md) — Developer setup and workflow
- [API Reference](docs/API.md) — tRPC endpoint documentation
- [Architecture](docs/ARCHITECTURE.md) — System design and data flow
- [Database](docs/DATABASE.md) — Schema reference and query patterns
- [Deployment](docs/DEPLOYMENT.md) — Production deployment guide
- [Changelog](docs/CHANGELOG.md) — Version history
- [Components](docs/COMPONENTS.md) — UI component catalog
- [Routing](docs/ROUTING.md) — Route definitions and guards
- [Security](docs/SECURITY.md) — Auth, RBAC, and security practices

---

## License

Proprietary — CareerSync AI. All rights reserved.
