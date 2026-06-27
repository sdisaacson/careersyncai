# Email/Password JWT Authentication Design

## Goal

Replace the existing Kimi OAuth authentication flow with custom email/password authentication using JWT sessions, email verification, and password reset emails sent via Resend.

## Context

The project currently authenticates users through Kimi OAuth:

- `src/pages/Login.tsx` redirects to Kimi's OAuth authorize URL.
- `api/kimi/auth.ts` exchanges the OAuth code for an access token, fetches the user profile, and upserts a local user keyed by `unionId`.
- `api/kimi/session.ts` signs a session JWT containing `{ unionId, clientId }`.
- `api/context.ts` validates the session cookie on every tRPC request and loads the user by `unionId`.
- `api/middleware.ts` provides `authedQuery` and `adminQuery`.
- `src/hooks/useAuth.ts` calls `trpc.auth.me` to get the current user.

The database migration to Supabase (PostgreSQL) is complete, and the `users` table is defined in `db/schema.ts`.

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Migration approach | Minimal migration | Reuse existing JWT session plumbing and user table shape; add password/auth columns. |
| External identity key (`unionId`) | Keep nullable | Backwards compatibility; other tables/code still reference it indirectly. |
| Password hashing | bcrypt | Widely supported, simpler than Argon2id in Node.js, sufficient for this threat model. |
| Email provider | Resend | Simple API; falls back to console logging in development. |
| Admin designation | `ADMIN_EMAILS` env var | Matches the previous `OWNER_UNION_ID` pattern but uses email. |
| Session payload | `{ userId, email }` | Decouples session from OAuth `unionId`/`clientId`. |
| Verification/reset tokens | Crypto random 32-byte hex | Simple and secure; reset tokens expire in 1 hour. |

## Schema Changes (`db/schema.ts`)

Update the `users` table:

1. Make `email` required and unique:
   ```ts
   email: varchar("email", { length: 320 }).notNull().unique(),
   ```
2. Keep `unionId` but make it nullable and no longer unique:
   ```ts
   unionId: varchar("unionId", { length: 255 }),
   ```
3. Add auth columns:
   ```ts
   passwordHash: varchar("passwordHash", { length: 255 }),
   emailVerified: boolean("emailVerified").default(false).notNull(),
   emailVerificationToken: varchar("emailVerificationToken", { length: 255 }),
   passwordResetToken: varchar("passwordResetToken", { length: 255 }),
   passwordResetExpires: timestamp("passwordResetExpires"),
   ```

## Backend Architecture

### Session layer (`api/auth/session.ts`)

Move and adapt `api/kimi/session.ts`:

- Change `SessionPayload` to `{ userId: number; email: string }`.
- Keep `JWT_ALG = "HS256"` and signing with `env.appSecret`.
- Keep 1-year expiration.

### Request authentication (`api/auth/authenticate.ts`)

Replace `api/kimi/auth.ts`'s `authenticateRequest`:

1. Parse session cookie.
2. Verify JWT with `verifySessionToken`.
3. Load user by `userId`.
4. If user not found or `emailVerified` is false, throw `UNAUTHORIZED`.
5. Return user.

### Email service (`api/lib/email.ts`)

Create a small email module:

- If `RESEND_API_KEY` is set, initialize `Resend` and send via `resend.emails.send`.
- If not set (development), log the message/link to the console and return success.
- Expose:
  - `sendVerificationEmail(to, token)`
  - `sendPasswordResetEmail(to, token)`

### User queries (`api/queries/users.ts`)

Add helper functions:

- `findUserByEmail(email)`
- `findUserById(id)`
- `findUserByVerificationToken(token)`
- `findUserByResetToken(token)`
- `createUser(data)` — inserts a new user; if email is in `ADMIN_EMAILS`, set `role=admin`.
- `markEmailVerified(userId)`
- `setPasswordResetToken(userId, token, expiresAt)`
- `updatePasswordHash(userId, hash)`
- `clearPasswordResetToken(userId)`

### Auth router (`api/auth-router.ts`)

Extend the existing router with public mutations:

- `signup` — input: `{ email, password }` (Zod validation, password min 8 chars).
  - Check email is not already registered.
  - Hash password with bcrypt.
  - Generate `emailVerificationToken`.
  - Insert user.
  - Send verification email.
  - Return `{ success: true }`.
- `login` — input: `{ email, password }`.
  - Find user by email.
  - Compare password with bcrypt.
  - Reject if `emailVerified` is false.
  - Sign session JWT with `{ userId, email }`.
  - Set HTTP-only cookie.
  - Return `{ success: true }`.
- `verifyEmail` — input: `{ token }`.
  - Find user by token.
  - Mark `emailVerified=true` and clear token.
  - Return `{ success: true }`.
- `resendVerification` — input: `{ email }`.
  - Find user by email.
  - If not verified, generate new token and send email.
  - Return `{ success: true }` (even if user not found, to prevent email enumeration).
- `forgotPassword` — input: `{ email }`.
  - Find user by email.
  - Generate `passwordResetToken` and `passwordResetExpires` (+1 hour).
  - Send reset email.
  - Return `{ success: true }` (even if user not found).
- `resetPassword` — input: `{ token, password }`.
  - Find user by token.
  - Check expiry.
  - Hash new password, update user, clear reset token.
  - Return `{ success: true }`.

Keep `me` (now uses `ctx.user` populated by new auth) and `logout`.

### Wiring

- Update `api/context.ts` to import `authenticateRequest` from `api/auth/authenticate.ts`.
- Remove the OAuth callback route (`/api/oauth/callback`) from `api/boot.ts` or wherever it is registered.
- Remove `api/kimi/auth.ts`, `api/kimi/session.ts`, `api/kimi/platform.ts`, `api/kimi/types.ts` if no longer used.

## Frontend Architecture

### `src/pages/Login.tsx`

Replace the Kimi OAuth button with:

- Email input
- Password input
- Submit button calling `trpc.auth.login.mutate()`
- Link to `/register`
- Link to `/forgot-password`
- On success, redirect to `/` (or original destination).

### `src/pages/SignupPage.tsx`

The existing page is a pricing/signup flow. Refactor it into two views or a new route:

- Option A: Keep `/signup` as the pricing page and add `/register` for the email/password form.
- Option B: Replace `/signup` with the registration form and move pricing to `/pricing`.

**Recommended:** Option A — add `/register` for the auth form and update the pricing page's unauthenticated CTA to link to `/register`. This minimizes disruption to the existing pricing UI.

New `/register` page:

- Email input
- Password input + confirm password
- Submit calling `trpc.auth.signup.mutate()`
- Show "Check your email to verify your account" on success.
- Link to `/login`.

### `src/pages/VerifyEmail.tsx`

Read `?token=` from URL on mount and call `trpc.auth.verifyEmail.mutate()`.

### `src/pages/ForgotPassword.tsx`

Email input; submit calls `trpc.auth.forgotPassword.mutate()`; show success message regardless of whether email exists.

### `src/pages/ResetPassword.tsx`

Read `?token=` from URL.
New password + confirm; submit calls `trpc.auth.resetPassword.mutate()`.

### `src/App.tsx`

Add routes:

```tsx
<Route path="/register" element={<RegisterPage />} />
<Route path="/verify-email" element={<VerifyEmailPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
```

## Environment Variables

Update `.env.example`:

```bash
# ── Admin Role ──────────────────────────────────────────────────
ADMIN_EMAILS=             # Comma-separated list of emails that get admin role on signup

# ── Email (Resend) ──────────────────────────────────────────────
RESEND_API_KEY=           # Resend API key (optional in dev; logs link if omitted)
FROM_EMAIL=               # Sender address, e.g. noreply@yourdomain.com
```

Also update `.env` comments to match.

## Security Considerations

- Passwords are hashed with bcrypt (cost factor 10–12) before storage.
- Session cookies remain `httpOnly`, `secure` in production, `sameSite=None` cross-origin / `Lax` localhost.
- Verification and reset tokens are single-use and cleared after consumption.
- Reset tokens expire after 1 hour.
- `forgotPassword` and `resendVerification` return the same success message whether or not the email exists, to prevent enumeration.
- Login rejects unverified accounts.

## Testing Plan

1. `npm run check` passes for API files.
2. `npm run db:push` applies schema changes to Supabase.
3. Manual end-to-end flow:
   - Register with email/password → receive verification email (or console link).
   - Click verification link → account verified.
   - Login → redirected to dashboard.
   - Access admin route with an `ADMIN_EMAILS` account → succeeds.
   - Logout → session cleared.
   - Forgot password → receive reset email → set new password → login with new password.

## Out of Scope

- OAuth provider login (Kimi, Google, etc.).
- Rate limiting on auth endpoints.
- Advanced password strength requirements beyond minimum length.
- Refresh token rotation (session JWT has 1-year expiry as before).
