# Contributing to CareerSync AI

Thank you for contributing to CareerSync AI! This guide covers everything you need to get started as a developer on this project.

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+ or **pnpm** 8+
- **PostgreSQL** 14+ (local or Supabase cloud instance)
- **Git**

---

## Environment Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd careersync-ai
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable           | Required | Description                                             |
| ------------------ | -------- | ------------------------------------------------------- |
| `DATABASE_URL`     | ✅       | PostgreSQL connection string                            |
| `APP_SECRET`       | ✅       | JWT signing secret (min 32 chars)                       |
| `BASE_URL`         | ✅       | Base URL for email links (e.g. `http://localhost:3000`) |
| `RESEND_API_KEY`   | ❌       | Resend API key for transactional emails                 |
| `FROM_EMAIL`       | ❌       | Sender email address                                    |
| `MOONSHOT_API_KEY` | ❌       | Moonshot AI API key for LLM features                    |
| `ADMIN_EMAILS`     | ❌       | Comma-separated admin emails                            |
| `STRIPE_*`         | ❌       | Stripe keys for payment integration                     |

### 3. Database Setup

```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate

# Or push schema directly (dev only)
npm run db:push
```

### 4. Seed Data (Optional)

```bash
node db/seed.ts
```

---

## Development Workflow

### Start the Dev Server

```bash
npm run dev
```

This starts:

- **Vite dev server** on port 3000 (frontend + HMR)
- **Hono backend** integrated via `@hono/vite-dev-server`
- **tRPC API** at `/api/trpc/*`

### Code Style

We use **Prettier** and **ESLint**:

```bash
# Format all files
npm run format

# Lint all files
npm run lint

# Type check
npm run check
```

### Testing

```bash
# Run all tests
npm run test

# Run in watch mode
npx vitest
```

Tests are written with **Vitest** and located alongside source files or in `__tests__` directories.

---

## Project Conventions

### File Organization

- **API routes**: `api/*-router.ts` — one router per domain
- **Pages**: `src/pages/*.tsx` — one page per route
- **Components**: `src/components/` — co-locate by feature
- **Hooks**: `src/hooks/*.ts` — reusable React hooks
- **Utils**: `src/lib/utils.ts` — shared helpers (`cn`, etc.)

### Naming

- Components: PascalCase (`JobCard.tsx`)
- Hooks: camelCase starting with `use` (`useAuth.ts`)
- Routers: kebab-case ending with `-router` (`job-router.ts`)
- Database tables: camelCase in schema, snake_case in SQL

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make atomic commits with clear messages
3. Ensure `npm run check` passes before pushing
4. Open a pull request with a description of changes

---

## Database Migrations

### Adding a New Table

1. Edit `db/schema.ts` to add the table definition
2. Run `npm run db:generate` to create a migration file
3. Review the generated SQL in `db/migrations/`
4. Run `npm run db:migrate` to apply

### Modifying Existing Tables

Same process — Drizzle Kit will generate `ALTER` statements.

---

## Common Tasks

### Add a New tRPC Router

1. Create `api/my-router.ts`:

```ts
import { createRouter, publicQuery } from "./middleware";

export const myRouter = createRouter({
  hello: publicQuery.query(() => "world"),
});
```

2. Register in `api/router.ts`:

```ts
import { myRouter } from "./my-router";

export const appRouter = createRouter({
  // ... existing routers
  my: myRouter,
});
```

3. Use in frontend:

```ts
const { data } = trpc.my.hello.useQuery();
```

### Add a New Page

1. Create `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`:

```tsx
import MyPage from "./pages/MyPage";

<Route path="/my-page" element={<MyPage />} />;
```

### Add a shadcn/ui Component

```bash
npx shadcn add <component-name>
```

Components are installed to `src/components/ui/`.

---

## Troubleshooting

| Issue                      | Solution                                                    |
| -------------------------- | ----------------------------------------------------------- |
| `DATABASE_URL not found`   | Ensure `.env` is present and `DATABASE_URL` is set          |
| `tRPC client errors`       | Check that backend is running on same port                  |
| `Migration failures`       | Verify PostgreSQL is accessible and credentials are correct |
| `Type errors in build`     | Run `npm run check` to see all TypeScript errors            |
| `Email not sending in dev` | Without `RESEND_API_KEY`, email links are logged to console |

---

## Questions?

- Check [docs/ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Check [docs/API.md](API.md) for API details
- Check [docs/DATABASE.md](DATABASE.md) for schema reference
