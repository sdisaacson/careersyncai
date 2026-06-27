# Supabase (PostgreSQL) Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the database backend from MySQL to Supabase (PostgreSQL) while keeping Drizzle ORM, updating only the schema definitions, connection layer, dependencies, and environment documentation.

**Architecture:** Replace `drizzle-orm/mysql-core` with `drizzle-orm/pg-core`, swap the `mysql2` driver for the `postgres-js` driver, and map MySQL-specific column types to their PostgreSQL equivalents. Existing query code in `api/queries/` and `api/routers/` remains unchanged because Drizzle's query API is dialect-agnostic.

**Tech Stack:** TypeScript, Drizzle ORM, Drizzle Kit, postgres-js, Supabase Postgres, Vite, Hono.

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `package.json` | Dependency manifest | Remove `mysql2`, add `postgres` |
| `drizzle.config.ts` | Drizzle Kit configuration | Change dialect to `postgresql` |
| `db/schema.ts` | Database schema definitions | Convert MySQL types to PostgreSQL types |
| `db/relations.ts` | Drizzle relations | No changes required |
| `api/queries/connection.ts` | Singleton database client | Switch to `postgres-js` driver |
| `api/lib/env.ts` | Environment validation | No changes required |
| `.env.example` | Env template | Update `DATABASE_URL` comment |
| `.env` | Local env file | Update `DATABASE_URL` comment only |
| `db/seed.ts` | Seed script entry point | Update comment about connection close |

---

### Task 1: Swap database dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove `mysql2` and add `postgres`**

  In `package.json`, find the `mysql2` entry under `dependencies` and replace it with `postgres`:

  ```json
  "postgres": "^3.4.5"
  ```

  The `dependencies` block should no longer contain `mysql2`.

- [ ] **Step 2: Install dependencies**

  Run:
  ```bash
  npm install
  ```

  Expected: `node_modules/postgres` is created and `mysql2` is removed from `node_modules`.

- [ ] **Step 3: Commit**

  ```bash
  git add package.json package-lock.json
  git commit -m "deps: replace mysql2 with postgres-js driver"
  ```

---

### Task 2: Update Drizzle Kit configuration

**Files:**
- Modify: `drizzle.config.ts`

- [ ] **Step 1: Change dialect to `postgresql`**

  Replace:
  ```ts
  dialect: "mysql",
  ```
  with:
  ```ts
  dialect: "postgresql",
  ```

  The full file should be:

  ```ts
  import "dotenv/config";
  import { defineConfig } from "drizzle-kit";

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to run drizzle commands");
  }

  export default defineConfig({
    schema: "./db/schema.ts",
    out: "./db/migrations",
    dialect: "postgresql",
    dbCredentials: {
      url: connectionString,
    },
  });
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add drizzle.config.ts
  git commit -m "config: set drizzle dialect to postgresql"
  ```

---

### Task 3: Convert schema from MySQL to PostgreSQL

**Files:**
- Modify: `db/schema.ts`

- [ ] **Step 1: Replace the entire schema file**

  Overwrite `db/schema.ts` with the following PostgreSQL-compatible version:

  ```ts
  import {
    pgTable,
    pgEnum,
    serial,
    varchar,
    text,
    timestamp,
    integer,
    boolean,
  } from "drizzle-orm/pg-core";

  export const roleEnum = pgEnum("role", ["user", "admin"]);
  export const profileStatusEnum = pgEnum("profile_status", [
    "uploaded",
    "interviewing",
    "completed",
  ]);
  export const interviewStatusEnum = pgEnum("interview_status", [
    "in_progress",
    "completed",
  ]);
  export const jobStatusEnum = pgEnum("job_status", [
    "discovered",
    "shortlisted",
    "applied",
    "archived",
  ]);
  export const researchSessionStatusEnum = pgEnum("research_session_status", [
    "running",
    "completed",
    "failed",
  ]);
  export const subscriptionStatusEnum = pgEnum("subscription_status", [
    "active",
    "canceled",
    "past_due",
    "inactive",
  ]);
  export const subscriptionIntervalEnum = pgEnum("subscription_interval", [
    "month",
    "year",
  ]);

  export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    unionId: varchar("unionId", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 320 }),
    avatar: text("avatar"),
    role: roleEnum("role").default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
  });

  export type User = typeof users.$inferSelect;
  export type InsertUser = typeof users.$inferInsert;

  // ─── Candidate Profile (extracted from resume + interview) ────────────────
  export const profiles = pgTable("profiles", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    fullName: varchar("fullName", { length: 255 }),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 50 }),
    location: varchar("location", { length: 255 }),
    targetLocation: varchar("targetLocation", { length: 255 }),
    summary: text("summary"),
    skills: text("skills"),
    education: text("education"),
    experience: text("experience"),
    researchFocus: text("researchFocus"),
    internships: text("internships"),
    certifications: text("certifications"),
    preferredRoles: text("preferredRoles"),
    preferredIndustries: text("preferredIndustries"),
    salaryExpectation: varchar("salaryExpectation", { length: 100 }),
    workType: varchar("workType", { length: 50 }),
    resumeText: text("resumeText"),
    resumeUrl: text("resumeUrl"),
    status: profileStatusEnum("status").default("uploaded"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  });

  export type Profile = typeof profiles.$inferSelect;
  export type InsertProfile = typeof profiles.$inferInsert;

  // ─── Interview Session ─────────────────────────────────────────────────────
  export const interviews = pgTable("interviews", {
    id: serial("id").primaryKey(),
    profileId: integer("profileId").notNull(),
    status: interviewStatusEnum("status").default("in_progress"),
    currentQuestion: integer("currentQuestion").default(0),
    totalQuestions: integer("totalQuestions").default(8),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    completedAt: timestamp("completedAt"),
  });

  export type Interview = typeof interviews.$inferSelect;
  export type InsertInterview = typeof interviews.$inferInsert;

  // ─── Interview Q&A ─────────────────────────────────────────────────────────
  export const interviewQuestions = pgTable("interviewQuestions", {
    id: serial("id").primaryKey(),
    interviewId: integer("interviewId").notNull(),
    question: text("question").notNull(),
    answer: text("answer"),
    category: varchar("category", { length: 100 }),
    order: integer("order").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  });

  export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
  export type InsertInterviewQuestion = typeof interviewQuestions.$inferInsert;

  // ─── Economic Sectors ──────────────────────────────────────────────────────
  export const sectors = pgTable("sectors", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 50 }),
    priority: integer("priority").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  });

  export type Sector = typeof sectors.$inferSelect;
  export type InsertSector = typeof sectors.$inferInsert;

  // ─── Job Opportunities ─────────────────────────────────────────────────────
  export const jobs = pgTable("jobs", {
    id: serial("id").primaryKey(),
    profileId: integer("profileId").notNull(),
    sectorId: integer("sectorId"),
    title: varchar("title", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }),
    jobDescription: text("jobDescription"),
    requirements: text("requirements"),
    responsibilities: text("responsibilities"),
    salaryRange: varchar("salaryRange", { length: 255 }),
    jobType: varchar("jobType", { length: 50 }),
    experienceLevel: varchar("experienceLevel", { length: 50 }),
    applicationLink: text("applicationLink"),
    deadline: varchar("deadline", { length: 100 }),
    postedDate: varchar("postedDate", { length: 100 }),
    source: varchar("source", { length: 255 }),
    fitScore: integer("fitScore").default(0),
    matchReasons: text("matchReasons"),
    skillGaps: text("skillGaps"),
    status: jobStatusEnum("status").default("discovered"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  });

  export type Job = typeof jobs.$inferSelect;
  export type InsertJob = typeof jobs.$inferInsert;

  // ─── Tailored Resumes ──────────────────────────────────────────────────────
  export const tailoredResumes = pgTable("tailoredResumes", {
    id: serial("id").primaryKey(),
    jobId: integer("jobId").notNull(),
    profileId: integer("profileId").notNull(),
    content: text("content").notNull(),
    pdfUrl: text("pdfUrl"),
    highlights: text("highlights"),
    changesMade: text("changesMade"),
    narrativeSummary: text("narrativeSummary"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  });

  export type TailoredResume = typeof tailoredResumes.$inferSelect;
  export type InsertTailoredResume = typeof tailoredResumes.$inferInsert;

  // ─── Research Sessions ─────────────────────────────────────────────────────
  export const researchSessions = pgTable("researchSessions", {
    id: serial("id").primaryKey(),
    profileId: integer("profileId").notNull(),
    status: researchSessionStatusEnum("status").default("running"),
    totalSectors: integer("totalSectors").default(0),
    completedSectors: integer("completedSectors").default(0),
    totalJobsFound: integer("totalJobsFound").default(0),
    log: text("log"),
    startedAt: timestamp("startedAt").defaultNow().notNull(),
    completedAt: timestamp("completedAt"),
  });

  // ─── Subscriptions ─────────────────────────────────────────────────────────
  export const subscriptions = pgTable("subscriptions", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull().unique(),
    status: subscriptionStatusEnum("status").default("inactive"),
    planId: varchar("planId", { length: 100 }),
    planName: varchar("planName", { length: 255 }),
    priceCents: integer("priceCents"),
    interval: subscriptionIntervalEnum("interval"),
    currentPeriodEnd: timestamp("currentPeriodEnd"),
    cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
    stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  });

  export type Subscription = typeof subscriptions.$inferSelect;
  export type InsertSubscription = typeof subscriptions.$inferInsert;

  // ─── App Settings ──────────────────────────────────────────────────────────
  export const appSettings = pgTable("appSettings", {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    value: text("value"),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  });

  export type AppSetting = typeof appSettings.$inferSelect;
  export type InsertAppSetting = typeof appSettings.$inferInsert;
  ```

- [ ] **Step 2: Run TypeScript check**

  Run:
  ```bash
  npm run check
  ```

  Expected: No errors related to `db/schema.ts`. If there are errors about enum names or column types, fix them before continuing.

- [ ] **Step 3: Commit**

  ```bash
  git add db/schema.ts
  git commit -m "schema: migrate definitions from mysql-core to pg-core"
  ```

---

### Task 4: Switch database connection driver

**Files:**
- Modify: `api/queries/connection.ts`

- [ ] **Step 1: Replace connection implementation**

  Overwrite `api/queries/connection.ts` with:

  ```ts
  import postgres from "postgres";
  import { drizzle } from "drizzle-orm/postgres-js";
  import { env } from "../lib/env";
  import * as schema from "@db/schema";
  import * as relations from "@db/relations";

  const fullSchema = { ...schema, ...relations };

  let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

  export function getDb() {
    if (!instance) {
      const client = postgres(env.databaseUrl);
      instance = drizzle(client, { schema: fullSchema });
    }
    return instance;
  }
  ```

- [ ] **Step 2: Run TypeScript check**

  Run:
  ```bash
  npm run check
  ```

  Expected: No errors.

- [ ] **Step 3: Commit**

  ```bash
  git add api/queries/connection.ts
  git commit -m "feat: connect to postgres via postgres-js driver"
  ```

---

### Task 5: Update environment documentation

**Files:**
- Modify: `.env.example`
- Modify: `.env`

- [ ] **Step 1: Update `.env.example`**

  Change the database comment from:
  ```bash
  DATABASE_URL=             # MySQL connection string (mysql://user:pass@host:port/db)
  ```
  to:
  ```bash
  DATABASE_URL=             # Supabase Postgres connection string (postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres)
  ```

- [ ] **Step 2: Update `.env` comment only**

  In `.env`, update the same comment line to reference Supabase Postgres. Do **not** overwrite the existing `DATABASE_URL` value unless you have the new Supabase credentials ready.

- [ ] **Step 3: Commit**

  ```bash
  git add .env.example .env
  git commit -m "docs: update env comments for Supabase Postgres"
  ```

---

### Task 6: Update seed script comment

**Files:**
- Modify: `db/seed.ts`

- [ ] **Step 1: Update comment**

  Change:
  ```ts
  process.exit(0); // close MySQL connection pool
  ```
  to:
  ```ts
  process.exit(0); // close Postgres connection
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add db/seed.ts
  git commit -m "docs: update seed script comment for postgres"
  ```

---

### Task 7: Verify against a real Supabase database

**Files:**
- None (verification only)

- [ ] **Step 1: Obtain Supabase connection string**

  From the Supabase dashboard, copy the connection string for the `postgres` user in "Transaction" mode (or session mode). It looks like:
  ```
  postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
  ```

- [ ] **Step 2: Set `DATABASE_URL` in `.env`**

  Replace the placeholder value in `.env` with the real connection string.

- [ ] **Step 3: Push schema to Supabase**

  Run:
  ```bash
  npm run db:push
  ```

  Expected: Drizzle Kit connects to Supabase and creates all tables. No errors.

- [ ] **Step 4: Run full type check and lint**

  Run:
  ```bash
  npm run check
  npm run lint
  ```

  Expected: Both pass with no errors.

- [ ] **Step 5: Start dev server and smoke test**

  Run:
  ```bash
  npm run dev
  ```

  Exercise at least one database-dependent feature (e.g., user login/profile creation) to confirm the connection works.

- [ ] **Step 6: Commit final state**

  ```bash
  git add -A
  git commit -m "verify: migration to Supabase Postgres complete"
  ```

---

## Self-Review Checklist

- **Spec coverage:**
  - Schema converted to pg-core → Task 3
  - Connection switched to postgres-js → Task 4
  - Drizzle Kit dialect updated → Task 2
  - Dependencies updated → Task 1
  - Env comments updated → Task 5
  - Seed comment updated → Task 6
  - Verification steps → Task 7
- **Placeholder scan:** No TBD/TODO/fill-in-details steps.
- **Type consistency:** All foreign-key columns are `integer("...")`; `cancelAtPeriodEnd` is `boolean("...")`; enums are declared once and reused. TypeScript types inferred from the schema remain `number` and `string` where consumers expect them.
