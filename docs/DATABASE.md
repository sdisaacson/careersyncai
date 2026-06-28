# Database Reference

Complete reference for the CareerSync AI PostgreSQL database schema, managed by Drizzle ORM.

---

## Schema Overview

The database consists of **10 tables** and **7 enums**, supporting the full job-matching pipeline from user authentication to tailored resume generation.

---

## Enums

| Enum Name | Values |
|-----------|--------|
| `user_role` | `user`, `admin` |
| `profile_status` | `uploaded`, `interviewing`, `completed` |
| `interview_status` | `in_progress`, `completed` |
| `job_status` | `discovered`, `shortlisted`, `applied`, `archived` |
| `research_session_status` | `running`, `completed`, `failed` |
| `subscription_status` | `active`, `canceled`, `past_due`, `inactive` |
| `subscription_interval` | `month`, `year` |

---

## Tables

### `users`

Authentication and user management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment primary key |
| `unionId` | `varchar(255)` | Unique | External auth ID (optional) |
| `name` | `varchar(255)` | — | Display name |
| `email` | `varchar(320)` | Not null, Unique | Login email |
| `avatar` | `text` | — | Avatar URL |
| `passwordHash` | `varchar(255)` | — | bcrypt hash |
| `emailVerified` | `boolean` | Default: false | Verification status |
| `emailVerificationToken` | `varchar(255)` | — | Verification token |
| `emailVerificationTokenExpires` | `timestamp` | — | Token expiry |
| `passwordResetToken` | `varchar(255)` | — | Reset token |
| `passwordResetExpires` | `timestamp` | — | Reset expiry |
| `role` | `user_role` | Default: "user" | RBAC role |
| `createdAt` | `timestamp` | Default: now | Registration time |
| `updatedAt` | `timestamp` | Default: now, On update | Last update |
| `lastSignInAt` | `timestamp` | Default: now | Last login |
| `sessionVersion` | `integer` | Default: 0 | For session invalidation |

**TypeScript**: `User`, `InsertUser`

---

### `profiles`

Candidate profile extracted from resume + interview answers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment |
| `userId` | `integer` | Not null | FK → users.id |
| `fullName` | `varchar(255)` | — | Parsed from resume |
| `email` | `varchar(320)` | — | Contact email |
| `phone` | `varchar(50)` | — | Phone number |
| `location` | `varchar(255)` | — | Current location |
| `targetLocation` | `varchar(255)` | — | Desired work location |
| `summary` | `text` | — | Career summary |
| `skills` | `text` | — | Comma-separated skills |
| `education` | `text` | — | Education history |
| `experience` | `text` | — | Work experience |
| `researchFocus` | `text` | — | Research interests |
| `internships` | `text` | — | Internship history |
| `certifications` | `text` | — | Certifications |
| `preferredRoles` | `text` | — | Target roles (comma-separated) |
| `preferredIndustries` | `text` | — | Preferred sectors |
| `salaryExpectation` | `varchar(100)` | — | Salary range |
| `workType` | `varchar(50)` | — | Environment preference |
| `resumeText` | `text` | — | Full extracted resume text |
| `resumeUrl` | `text` | — | Original filename |
| `status` | `profile_status` | Default: "uploaded" | Pipeline progress |
| `createdAt` | `timestamp` | Default: now | Creation time |
| `updatedAt` | `timestamp` | Default: now, On update | Last update |

**TypeScript**: `Profile`, `InsertProfile`

---

### `interviews`

Interview session tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment |
| `profileId` | `integer` | Not null | FK → profiles.id |
| `status` | `interview_status` | Default: "in_progress" | Session state |
| `currentQuestion` | `integer` | Default: 0 | Progress index |
| `totalQuestions` | `integer` | Default: 8 | Total questions |
| `createdAt` | `timestamp` | Default: now | Start time |
| `completedAt` | `timestamp` | — | Completion time |

**TypeScript**: `Interview`, `InsertInterview`

---

### `interviewQuestions`

Individual Q&A pairs within an interview.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment |
| `interviewId` | `integer` | Not null | FK → interviews.id |
| `question` | `text` | Not null | Question text |
| `answer` | `text` | — | User's answer |
| `category` | `varchar(100)` | — | Question category |
| `order` | `integer` | Not null | Display order |
| `createdAt` | `timestamp` | Default: now | Creation time |

**TypeScript**: `InterviewQuestion`, `InsertInterviewQuestion`

---

### `sectors`

Economic sectors for job categorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment |
| `name` | `varchar(100)` | Not null | Sector name |
| `description` | `text` | — | Sector description |
| `icon` | `varchar(50)` | — | Lucide icon name |
| `priority` | `integer` | Default: 0 | Display order |
| `createdAt` | `timestamp` | Default: now | Creation time |

**Default Sectors**: Technology, Healthcare, Finance, Energy, Education, Manufacturing, Consulting, Government

**TypeScript**: `Sector`, `InsertSector`

---

### `jobs`

Discovered job opportunities.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment |
| `profileId` | `integer` | Not null | FK → profiles.id |
| `sectorId` | `integer` | — | FK → sectors.id |
| `title` | `varchar(255)` | Not null | Job title |
| `company` | `varchar(255)` | Not null | Company name |
| `location` | `varchar(255)` | — | Job location |
| `jobDescription` | `text` | — | Full description |
| `requirements` | `text` | — | Required skills |
| `responsibilities` | `text` | — | Role responsibilities |
| `salaryRange` | `varchar(255)` | — | Compensation range |
| `jobType` | `varchar(50)` | — | Full-time, contract, etc. |
| `experienceLevel` | `varchar(50)` | — | Entry, Mid, Senior |
| `applicationLink` | `text` | — | Direct apply URL |
| `deadline` | `varchar(100)` | — | Application deadline |
| `postedDate` | `varchar(100)` | — | Posting date |
| `source` | `varchar(255)` | — | Job board source |
| `fitScore` | `integer` | Default: 0 | Match score 0-100 |
| `matchReasons` | `text` | — | Why this matches |
| `skillGaps` | `text` | — | Missing skills |
| `status` | `job_status` | Default: "discovered" | Tracking status |
| `createdAt` | `timestamp` | Default: now | Discovery time |

**TypeScript**: `Job`, `InsertJob`

---

### `tailoredResumes`

AI-generated resumes tailored to specific jobs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment |
| `jobId` | `integer` | Not null | FK → jobs.id |
| `profileId` | `integer` | Not null | FK → profiles.id |
| `content` | `text` | Not null | Full resume text |
| `pdfUrl` | `text` | — | Generated PDF URL |
| `highlights` | `text` | — | Key changes (JSON) |
| `changesMade` | `text` | — | Detailed modifications (JSON) |
| `narrativeSummary` | `text` | — | Human-readable summary |
| `createdAt` | `timestamp` | Default: now | Generation time |

**TypeScript**: `TailoredResume`, `InsertTailoredResume`

---

### `researchSessions`

Research agent progress tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment |
| `profileId` | `integer` | Not null | FK → profiles.id |
| `status` | `research_session_status` | Default: "running" | Session state |
| `totalSectors` | `integer` | Default: 0 | Sectors to search |
| `completedSectors` | `integer` | Default: 0 | Completed count |
| `totalJobsFound` | `integer` | Default: 0 | Jobs discovered |
| `log` | `text` | — | Activity log |
| `startedAt` | `timestamp` | Default: now | Start time |
| `completedAt` | `timestamp` | — | Completion time |

---

### `subscriptions`

User billing and plan subscriptions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment |
| `userId` | `integer` | Not null, Unique | FK → users.id |
| `status` | `subscription_status` | Default: "inactive" | Billing status |
| `planId` | `varchar(100)` | — | Plan identifier |
| `planName` | `varchar(255)` | — | Display name |
| `priceCents` | `integer` | — | Price in cents |
| `interval` | `subscription_interval` | — | month/year |
| `currentPeriodEnd` | `timestamp` | — | Renewal date |
| `cancelAtPeriodEnd` | `boolean` | Default: false | Cancellation flag |
| `stripeCustomerId` | `varchar(255)` | — | Stripe customer ID |
| `stripeSubscriptionId` | `varchar(255)` | — | Stripe subscription ID |
| `createdAt` | `timestamp` | Default: now | Creation time |
| `updatedAt` | `timestamp` | Default: now, On update | Last update |

**TypeScript**: `Subscription`, `InsertSubscription`

---

### `appSettings`

Runtime application configuration (admin-editable).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment |
| `key` | `varchar(255)` | Not null, Unique | Setting name |
| `value` | `text` | — | Setting value |
| `updatedAt` | `timestamp` | Default: now, On update | Last update |

**TypeScript**: `AppSetting`, `InsertAppSetting`

**Default Keys**: `moonshot_api_key`, `stripe_publishable_key`, `stripe_secret_key`, `default_plan_id`

---

## Entity Relationship Diagram

```mermaid
erDiagram
    users {
        serial id PK
        varchar unionId UK
        varchar name
        varchar email UK
        text avatar
        varchar passwordHash
        boolean emailVerified
        varchar emailVerificationToken
        timestamp emailVerificationTokenExpires
        varchar passwordResetToken
        timestamp passwordResetExpires
        user_role role
        timestamp createdAt
        timestamp updatedAt
        timestamp lastSignInAt
        integer sessionVersion
    }

    profiles {
        serial id PK
        integer userId FK
        varchar fullName
        varchar email
        varchar phone
        varchar location
        varchar targetLocation
        text summary
        text skills
        text education
        text experience
        text researchFocus
        text internships
        text certifications
        text preferredRoles
        text preferredIndustries
        varchar salaryExpectation
        varchar workType
        text resumeText
        text resumeUrl
        profile_status status
        timestamp createdAt
        timestamp updatedAt
    }

    interviews {
        serial id PK
        integer profileId FK
        interview_status status
        integer currentQuestion
        integer totalQuestions
        timestamp createdAt
        timestamp completedAt
    }

    interviewQuestions {
        serial id PK
        integer interviewId FK
        text question
        text answer
        varchar category
        integer order
        timestamp createdAt
    }

    sectors {
        serial id PK
        varchar name
        text description
        varchar icon
        integer priority
        timestamp createdAt
    }

    jobs {
        serial id PK
        integer profileId FK
        integer sectorId FK
        varchar title
        varchar company
        varchar location
        text jobDescription
        text requirements
        text responsibilities
        varchar salaryRange
        varchar jobType
        varchar experienceLevel
        text applicationLink
        varchar deadline
        varchar postedDate
        varchar source
        integer fitScore
        text matchReasons
        text skillGaps
        job_status status
        timestamp createdAt
    }

    tailoredResumes {
        serial id PK
        integer jobId FK
        integer profileId FK
        text content
        text pdfUrl
        text highlights
        text changesMade
        text narrativeSummary
        timestamp createdAt
    }

    researchSessions {
        serial id PK
        integer profileId FK
        research_session_status status
        integer totalSectors
        integer completedSectors
        integer totalJobsFound
        text log
        timestamp startedAt
        timestamp completedAt
    }

    subscriptions {
        serial id PK
        integer userId FK
        subscription_status status
        varchar planId
        varchar planName
        integer priceCents
        subscription_interval interval
        timestamp currentPeriodEnd
        boolean cancelAtPeriodEnd
        varchar stripeCustomerId
        varchar stripeSubscriptionId
        timestamp createdAt
        timestamp updatedAt
    }

    appSettings {
        serial id PK
        varchar key UK
        text value
        timestamp updatedAt
    }

    users ||--o{ profiles : "has"
    users ||--o| subscriptions : "has"
    profiles ||--o{ interviews : "has"
    profiles ||--o{ jobs : "matched to"
    profiles ||--o{ tailoredResumes : "generates"
    profiles ||--o{ researchSessions : "triggers"
    interviews ||--o{ interviewQuestions : "contains"
    sectors ||--o{ jobs : "categorizes"
    jobs ||--o| tailoredResumes : "tailored for"
```

---

## Query Patterns

### Basic CRUD with Drizzle

```ts
import { getDb } from "@/api/queries/connection";
import { profiles, jobs } from "@db/schema";
import { eq, desc, and, gte } from "drizzle-orm";

// Select one
const result = await db.select().from(profiles).where(eq(profiles.id, 1)).limit(1);

// Select with order
const allJobs = await db.select().from(jobs).orderBy(desc(jobs.fitScore));

// Insert
const [{ id }] = await db.insert(profiles).values({ userId: 1, fullName: "John" }).returning({ id: profiles.id });

// Update
await db.update(profiles).set({ status: "completed" }).where(eq(profiles.id, 1));

// Delete
await db.delete(jobs).where(eq(jobs.profileId, 1));

// Filter with AND
const filtered = await db.select().from(jobs)
  .where(and(eq(jobs.profileId, 1), gte(jobs.fitScore, 80)));
```

### Aggregation

```ts
import { count, avg } from "drizzle-orm";

const [userCount] = await db.select({ count: count() }).from(users);
const [avgScore] = await db.select({ avg: avg(jobs.fitScore) }).from(jobs);
```

---

## Migrations

### Generate a New Migration

```bash
npm run db:generate
```

This reads `db/schema.ts` and creates a new SQL file in `db/migrations/`.

### Apply Migrations

```bash
npm run db:migrate
```

### Push Schema Directly (Development Only)

```bash
npm run db:push
```

### Configuration

Migrations are configured in `drizzle.config.ts`:

```ts
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
});
```
