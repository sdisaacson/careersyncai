# API Reference

CareerSync AI uses **tRPC** with **Hono** for type-safe API routes. All endpoints are accessible via `/api/trpc/*`.

---

## Router Overview

The API is organized into 10 domain routers:

| Router | File | Description | Auth Required |
|--------|------|-------------|---------------|
| `auth` | `api/auth-router.ts` | Authentication (login, signup, logout, password reset) | No |
| `profile` | `api/profile-router.ts` | User profile CRUD | No (demo mode) |
| `interview` | `api/interview-router.ts` | Interview session & Q&A | No |
| `job` | `api/job-router.ts` | Job discovery & filtering | No |
| `resume` | `api/resume-router.ts` | Tailored resume generation | No |
| `research` | `api/research-router.ts` | Research session tracking | No |
| `sector` | `api/sector-router.ts` | Economic sector management | No |
| `subscription` | `api/subscription-router.ts` | Billing & subscriptions | Yes |
| `settings` | `api/settings-router.ts` | App configuration (admin) | Admin |
| `admin` | `api/admin-router.ts` | Admin dashboard & user management | Admin |

---

## Auth Router (`auth`)

### `auth.me`
- **Type**: `query`
- **Auth**: Required (`authedQuery`)
- **Returns**: Current user object
- **Errors**: `UNAUTHORIZED` if not logged in

### `auth.signup`
- **Type**: `mutation`
- **Input**: `{ email: string, password: string }` (password min 8 chars)
- **Returns**: `{ success: true }`
- **Side Effects**: Creates user, hashes password with bcrypt, sends verification email

### `auth.login`
- **Type**: `mutation`
- **Input**: `{ email: string, password: string }`
- **Returns**: `{ success: true }` (sets HTTP-only session cookie)
- **Errors**: Invalid credentials, unverified email

### `auth.logout`
- **Type**: `mutation`
- **Auth**: Required
- **Returns**: `{ success: true }` (clears session cookie)

### `auth.verifyEmail`
- **Type**: `mutation`
- **Input**: `{ token: string }`
- **Returns**: `{ success: true }`
- **Errors**: Invalid or expired token

### `auth.resendVerification`
- **Type**: `mutation`
- **Input**: `{ email: string }`
- **Returns**: `{ success: true }`

### `auth.forgotPassword`
- **Type**: `mutation`
- **Input**: `{ email: string }`
- **Returns**: `{ success: true }` (sends reset email if user exists)

### `auth.resetPassword`
- **Type**: `mutation`
- **Input**: `{ token: string, password: string }` (min 8 chars)
- **Returns**: `{ success: true }`
- **Errors**: Invalid or expired token

---

## Profile Router (`profile`)

### `profile.create`
- **Type**: `mutation`
- **Input**: Profile fields (userId, fullName, email, skills, education, experience, etc.)
- **Returns**: `{ id: number, success: true }`

### `profile.getByUser`
- **Type**: `query`
- **Input**: `{ userId: number }`
- **Returns**: Profile object or null

### `profile.getById`
- **Type**: `query`
- **Input**: `{ id: number }`
- **Returns**: Profile object or null

### `profile.update`
- **Type**: `mutation`
- **Input**: `{ id: number }` + optional fields to update
- **Returns**: `{ success: true }`

### `profile.list`
- **Type**: `query`
- **Returns**: Array of all profiles

---

## Interview Router (`interview`)

### `interview.create`
- **Type**: `mutation`
- **Input**: `{ profileId: number }`
- **Returns**: `{ id: number }` (interview session ID)

### `interview.get`
- **Type**: `query`
- **Input**: `{ profileId: number }`
- **Returns**: Latest interview session or null

### `interview.addQuestion`
- **Type**: `mutation`
- **Input**: `{ interviewId: number, question: string, category: string, order: number }`
- **Returns**: `{ id: number, success: true }`

### `interview.answerQuestion`
- **Type**: `mutation`
- **Input**: `{ id: number, answer: string }`
- **Returns**: `{ success: true }`

### `interview.getQuestions`
- **Type**: `query`
- **Input**: `{ interviewId: number }`
- **Returns**: Array of questions with answers

### `interview.nextQuestion`
- **Type**: `mutation`
- **Input**: `{ id: number }`
- **Returns**: `{ success: true }` (increments currentQuestion counter)

### `interview.complete`
- **Type**: `mutation`
- **Input**: `{ id: number }`
- **Returns**: `{ success: true }` (sets status to "completed")

---

## Job Router (`job`)

### `job.create`
- **Type**: `mutation`
- **Input**: Job fields (profileId, title, company, location, fitScore, etc.)
- **Returns**: `{ id: number }`

### `job.createMany`
- **Type**: `mutation`
- **Input**: Array of job objects
- **Returns**: `{ count: number }`

### `job.getByProfile`
- **Type**: `query`
- **Input**: `{ profileId: number }`
- **Returns**: Array of jobs sorted by fitScore desc

### `job.getById`
- **Type**: `query`
- **Input**: `{ id: number }`
- **Returns**: Job object or null

### `job.updateStatus`
- **Type**: `mutation`
- **Input**: `{ id: number, status: "discovered" | "shortlisted" | "applied" | "archived" }`
- **Returns**: `{ success: true }`

### `job.filter`
- **Type**: `query`
- **Input**: `{ profileId: number, sectorId?, minFitScore?, status?, search?, sortBy?, sortOrder? }`
- **Returns**: Filtered & sorted array of jobs

### `job.stats`
- **Type**: `query`
- **Input**: `{ profileId: number }`
- **Returns**: `{ total, bySector, avgFitScore, shortlisted, applied }`

### `job.deleteByProfile`
- **Type**: `mutation`
- **Input**: `{ profileId: number }`
- **Returns**: `{ success: true }`

---

## Resume Router (`resume`)

### `resume.create`
- **Type**: `mutation`
- **Input**: `{ jobId, profileId, content, highlights?, changesMade?, narrativeSummary? }`
- **Returns**: `{ id: number }`

### `resume.createMany`
- **Type**: `mutation`
- **Input**: Array of resume objects
- **Returns**: `{ count: number }`

### `resume.getByProfile`
- **Type**: `query`
- **Input**: `{ profileId: number }`
- **Returns**: Array of tailored resumes

### `resume.getByJob`
- **Type**: `query`
- **Input**: `{ jobId: number }`
- **Returns**: Tailored resume or null

### `resume.updatePdfUrl`
- **Type**: `mutation`
- **Input**: `{ id: number, pdfUrl: string }`
- **Returns**: `{ success: true }`

---

## Research Router (`research`)

### `research.create`
- **Type**: `mutation`
- **Input**: `{ profileId: number, totalSectors?: number }` (default 8)
- **Returns**: `{ id: number }`

### `research.get`
- **Type**: `query`
- **Input**: `{ profileId: number }`
- **Returns**: Latest research session or null

### `research.updateProgress`
- **Type**: `mutation`
- **Input**: `{ id: number, completedSectors?, totalJobsFound?, log? }`
- **Returns**: `{ success: true }`

### `research.complete`
- **Type**: `mutation`
- **Input**: `{ id: number }`
- **Returns**: `{ success: true }`

### `research.fail`
- **Type**: `mutation`
- **Input**: `{ id: number }`
- **Returns**: `{ success: true }`

### `research.appendLog`
- **Type**: `mutation`
- **Input**: `{ id: number, message: string }`
- **Returns**: `{ success: true }`

---

## Sector Router (`sector`)

### `sector.seed`
- **Type**: `mutation`
- **Returns**: `{ message: string, count: number }`
- **Side Effects**: Inserts 8 default sectors if none exist

### `sector.list`
- **Type**: `query`
- **Returns**: Array of all sectors ordered by priority

### `sector.getById`
- **Type**: `query`
- **Input**: `{ id: number }`
- **Returns**: Sector object or null

---

## Subscription Router (`subscription`)

### `subscription.getCurrentSubscription`
- **Type**: `query`
- **Auth**: Required
- **Returns**: Subscription object or null

### `subscription.createCheckoutSession`
- **Type**: `mutation`
- **Auth**: Required
- **Input**: `{ planId: "starter" | "pro" | "premium" }`
- **Returns**: `{ sessionId: string, url: string }`
- **Note**: Mock Stripe integration — creates active subscription directly

### `subscription.cancelSubscription`
- **Type**: `mutation`
- **Auth**: Required
- **Returns**: `{ success: true }`

### `subscription.resumeSubscription`
- **Type**: `mutation`
- **Auth**: Required
- **Returns**: `{ success: true }`

---

## Settings Router (`settings`)

### `settings.getAll`
- **Type**: `query`
- **Auth**: Admin
- **Returns**: Array of all app settings

### `settings.get`
- **Type**: `query`
- **Auth**: Admin
- **Input**: `{ key: string }`
- **Returns**: Setting value or null

### `settings.update`
- **Type**: `mutation`
- **Auth**: Admin
- **Input**: `{ key: string, value: string }`
- **Returns**: `{ success: true }`

### `settings.updateMany`
- **Type**: `mutation`
- **Auth**: Admin
- **Input**: `Record<string, string>`
- **Returns**: `{ success: true }`

---

## Admin Router (`admin`)

### `admin.dashboard`
- **Type**: `query`
- **Auth**: Admin
- **Returns**: `{ totalUsers, activeSubscriptions, canceledSubscriptions }`

### `admin.users.list`
- **Type**: `query`
- **Auth**: Admin
- **Returns**: Array of users (id, name, email, role, createdAt, lastSignInAt)

### `admin.users.updateRole`
- **Type**: `mutation`
- **Auth**: Admin
- **Input**: `{ id: number, role: "user" | "admin" }`
- **Returns**: `{ success: true }`

### `admin.subscriptions.list`
- **Type**: `query`
- **Auth**: Admin
- **Returns**: Array of subscription records

---

## Auth & Middleware

### Session Authentication

- JWT tokens stored in HTTP-only cookies (`kimi_sid`)
- Signed with `APP_SECRET` using HS256
- 1-year expiration
- Session version checked for invalidation

### Middleware Levels

| Level | Middleware | Usage |
|-------|-----------|-------|
| Public | `publicQuery` | No auth required |
| Authenticated | `authedQuery` | Valid session required |
| Admin | `adminQuery` | Valid session + role === "admin" |

### Error Codes

| tRPC Code | HTTP Status | Meaning |
|-----------|-------------|---------|
| `UNAUTHORIZED` | 401 | Not logged in |
| `FORBIDDEN` | 403 | Logged in but insufficient role |
| `BAD_REQUEST` | 400 | Invalid input (Zod validation) |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error |

---

## Client Usage

```tsx
import { trpc } from "@/lib/trpc.tsx";

// Query
const { data, isLoading } = trpc.job.getByProfile.useQuery({ profileId: 1 });

// Mutation
const createProfile = trpc.profile.create.useMutation({
  onSuccess: (data) => console.log("Created:", data.id),
});

// Auth-required query
const { data: user } = trpc.auth.me.useQuery();

// Invalidate cache
const utils = trpc.useUtils();
utils.job.getByProfile.invalidate();
```

---

## Health Check

```bash
curl http://localhost:3000/api/health
# { "ok": true, "ts": 1234567890 }
```
