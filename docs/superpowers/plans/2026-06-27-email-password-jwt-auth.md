# Email/Password JWT Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Kimi OAuth with custom email/password authentication using JWT sessions, email verification, and password reset emails via Resend.

**Architecture:** Add password/auth columns to the existing `users` table, reuse the existing `jose` JWT cookie session plumbing with a new `{ userId, email }` payload, and replace OAuth routes/pages with email/password forms. Resend sends transactional emails; development falls back to console logging.

**Tech Stack:** TypeScript, React, Hono, tRPC, Drizzle ORM, PostgreSQL (Supabase), jose, bcrypt, Resend.

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `package.json` | Dependencies | Add `bcryptjs` and `resend` |
| `db/schema.ts` | User schema | Add password/auth columns; make `email` required+unique |
| `api/lib/env.ts` | Env validation | Add `adminEmails`, `resendApiKey`, `fromEmail` |
| `api/lib/email.ts` | Email service | New module: send verification/reset emails via Resend or console |
| `api/auth/session.ts` | JWT signing/verification | Moved from `api/kimi/session.ts`; new payload shape |
| `api/auth/authenticate.ts` | Cookie → user | New module: parse cookie, verify JWT, load user |
| `api/queries/users.ts` | User DB helpers | Add find/create/update helpers for email/password auth |
| `api/auth-router.ts` | Auth tRPC routes | Add signup/login/verify/resend/forgot/reset mutations |
| `api/context.ts` | tRPC context | Import new `authenticateRequest` |
| `api/boot.ts` | Hono app bootstrap | Remove OAuth callback route; ensure auth router is mounted |
| `api/kimi/*` | OAuth-specific code | Delete if no longer used |
| `src/pages/Login.tsx` | Login UI | Replace OAuth button with email/password form |
| `src/pages/RegisterPage.tsx` | Signup UI | New email/password registration form |
| `src/pages/VerifyEmail.tsx` | Email verification UI | New: call verify mutation from URL token |
| `src/pages/ForgotPassword.tsx` | Password reset request UI | New |
| `src/pages/ResetPassword.tsx` | Password reset confirmation UI | New |
| `src/App.tsx` | Routes | Add `/register`, `/verify-email`, `/forgot-password`, `/reset-password` |
| `src/pages/SignupPage.tsx` | Pricing/signup landing | Update CTA link to `/register` |
| `.env.example` | Env template | Add `ADMIN_EMAILS`, `RESEND_API_KEY`, `FROM_EMAIL` |
| `.env` | Local env | Add placeholder comments |

---

### Task 1: Add dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add `bcryptjs` and `resend`**

  Add to `dependencies`:
  ```json
  "bcryptjs": "^2.4.3",
  "resend": "^3.2.0"
  ```

  Add to `devDependencies`:
  ```json
  "@types/bcryptjs": "^2.4.6"
  ```

- [ ] **Step 2: Install**

  Run: `npm install`

- [ ] **Step 3: Commit**

  ```bash
  git add package.json package-lock.json
  git commit -m "deps: add bcryptjs, resend, and bcryptjs types"
  ```

---

### Task 2: Update users schema

**Files:**
- Modify: `db/schema.ts`

- [ ] **Step 1: Update `users` table**

  Replace the `users` table definition with:
  ```ts
  export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    unionId: varchar("unionId", { length: 255 }),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 320 }).notNull().unique(),
    avatar: text("avatar"),
    passwordHash: varchar("passwordHash", { length: 255 }),
    emailVerified: boolean("emailVerified").default(false).notNull(),
    emailVerificationToken: varchar("emailVerificationToken", { length: 255 }),
    passwordResetToken: varchar("passwordResetToken", { length: 255 }),
    passwordResetExpires: timestamp("passwordResetExpires"),
    role: userRoleEnum("role").default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
  });
  ```

- [ ] **Step 2: Run type check**

  Run: `npm run check`

  Expected: errors may appear in files using `unionId` as required; those are fixed in later tasks.

- [ ] **Step 3: Commit**

  ```bash
  git add db/schema.ts
  git commit -m "schema: add email/password auth columns to users"
  ```

---

### Task 3: Add environment variables

**Files:**
- Modify: `api/lib/env.ts`
- Modify: `.env.example`
- Modify: `.env`

- [ ] **Step 1: Update `api/lib/env.ts`**

  Add to the `env` object:
  ```ts
  adminEmails: process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? [],
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  fromEmail: process.env.FROM_EMAIL ?? "",
  ```

- [ ] **Step 2: Update `.env.example`**

  Add under Admin Role:
  ```bash
  ADMIN_EMAILS=             # Comma-separated list of emails that get admin role on signup
  ```

  Add a new Email section:
  ```bash
  # ── Email (Resend) ──────────────────────────────────────────────
  RESEND_API_KEY=           # Resend API key (optional in dev; logs link if omitted)
  FROM_EMAIL=               # Sender address, e.g. noreply@yourdomain.com
  ```

- [ ] **Step 3: Update `.env`**

  Add the same placeholders to `.env` (do not overwrite existing values).

- [ ] **Step 4: Commit**

  ```bash
  git add api/lib/env.ts .env.example
  git commit -m "config: add auth and email environment variables"
  ```

---

### Task 4: Create email service

**Files:**
- Create: `api/lib/email.ts`

- [ ] **Step 1: Implement `api/lib/email.ts`**

  ```ts
  import { Resend } from "resend";
  import { env } from "./env";

  const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

  function buildUrl(path: string, token: string) {
    const baseUrl = process.env.BASE_URL ?? "http://localhost:5173";
    const url = new URL(path, baseUrl);
    url.searchParams.set("token", token);
    return url.toString();
  }

  export async function sendVerificationEmail(to: string, token: string) {
    const link = buildUrl("/verify-email", token);
    if (!resend || !env.fromEmail) {
      console.log(`[email] Verification link for ${to}: ${link}`);
      return { success: true };
    }
    await resend.emails.send({
      from: env.fromEmail,
      to,
      subject: "Verify your email",
      html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
    });
    return { success: true };
  }

  export async function sendPasswordResetEmail(to: string, token: string) {
    const link = buildUrl("/reset-password", token);
    if (!resend || !env.fromEmail) {
      console.log(`[email] Password reset link for ${to}: ${link}`);
      return { success: true };
    }
    await resend.emails.send({
      from: env.fromEmail,
      to,
      subject: "Reset your password",
      html: `<p>Click <a href="${link}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });
    return { success: true };
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add api/lib/email.ts
  git commit -m "feat: add Resend email service with dev fallback"
  ```

---

### Task 5: Move and adapt session layer

**Files:**
- Create: `api/auth/session.ts`
- Delete: `api/kimi/session.ts` (after creating new file)

- [ ] **Step 1: Create `api/auth/session.ts`**

  ```ts
  import * as jose from "jose";
  import { env } from "../lib/env";

  export type SessionPayload = {
    userId: number;
    email: string;
  };

  const JWT_ALG = "HS256";

  export async function signSessionToken(
    payload: SessionPayload,
  ): Promise<string> {
    const secret = new TextEncoder().encode(env.appSecret);
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg: JWT_ALG })
      .setIssuedAt()
      .setExpirationTime("1 year")
      .sign(secret);
  }

  export async function verifySessionToken(
    token: string,
  ): Promise<SessionPayload | null> {
    if (!token) {
      return null;
    }
    try {
      const secret = new TextEncoder().encode(env.appSecret);
      const { payload } = await jose.jwtVerify(token, secret, {
        algorithms: [JWT_ALG],
      });
      const { userId, email } = payload;
      if (!userId || !email) {
        return null;
      }
      return { userId: Number(userId), email: String(email) };
    } catch {
      return null;
    }
  }
  ```

- [ ] **Step 2: Delete old session file**

  ```bash
  git rm api/kimi/session.ts
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add api/auth/session.ts api/kimi/session.ts
  git commit -m "feat: add email/userId based JWT session"
  ```

---

### Task 6: Create request authenticator

**Files:**
- Create: `api/auth/authenticate.ts`
- Delete: `api/kimi/auth.ts` (after creating new file and updating references)

- [ ] **Step 1: Create `api/auth/authenticate.ts`**

  ```ts
  import * as cookie from "cookie";
  import { Session } from "@contracts/constants";
  import { Errors } from "@contracts/errors";
  import { verifySessionToken } from "./session";
  import { findUserById } from "../queries/users";

  export async function authenticateRequest(headers: Headers) {
    const cookies = cookie.parse(headers.get("cookie") || "");
    const token = cookies[Session.cookieName];
    if (!token) {
      throw Errors.forbidden("Invalid authentication token.");
    }
    const claim = await verifySessionToken(token);
    if (!claim) {
      throw Errors.forbidden("Invalid authentication token.");
    }
    const user = await findUserById(claim.userId);
    if (!user || !user.emailVerified) {
      throw Errors.forbidden("User not found or email not verified.");
    }
    return user;
  }
  ```

- [ ] **Step 2: Update `api/context.ts`**

  Replace:
  ```ts
  import { authenticateRequest } from "./kimi/auth";
  ```
  with:
  ```ts
  import { authenticateRequest } from "./auth/authenticate";
  ```

- [ ] **Step 3: Delete old auth file**

  ```bash
  git rm api/kimi/auth.ts
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add api/auth/authenticate.ts api/context.ts api/kimi/auth.ts
  git commit -m "feat: create cookie-based request authenticator"
  ```

---

### Task 7: Update user queries

**Files:**
- Modify: `api/queries/users.ts`

- [ ] **Step 1: Replace file content**

  ```ts
  import { eq } from "drizzle-orm";
  import * as schema from "@db/schema";
  import type { InsertUser } from "@db/schema";
  import { getDb } from "./connection";
  import { env } from "../lib/env";

  export async function findUserById(id: number) {
    const rows = await getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return rows.at(0);
  }

  export async function findUserByEmail(email: string) {
    const rows = await getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    return rows.at(0);
  }

  export async function findUserByVerificationToken(token: string) {
    const rows = await getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.emailVerificationToken, token))
      .limit(1);
    return rows.at(0);
  }

  export async function findUserByResetToken(token: string) {
    const rows = await getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.passwordResetToken, token))
      .limit(1);
    return rows.at(0);
  }

  export async function createUser(data: InsertUser) {
    const values = { ...data };
    if (
      values.role === undefined &&
      values.email &&
      env.adminEmails.includes(values.email)
    ) {
      values.role = "admin";
    }
    const [user] = await getDb()
      .insert(schema.users)
      .values(values)
      .returning({ id: schema.users.id });
    return user;
  }

  export async function markEmailVerified(userId: number) {
    await getDb()
      .update(schema.users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
      })
      .where(eq(schema.users.id, userId));
  }

  export async function setPasswordResetToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ) {
    await getDb()
      .update(schema.users)
      .set({
        passwordResetToken: token,
        passwordResetExpires: expiresAt,
      })
      .where(eq(schema.users.id, userId));
  }

  export async function updatePasswordHash(userId: number, hash: string) {
    await getDb()
      .update(schema.users)
      .set({
        passwordHash: hash,
        passwordResetToken: null,
        passwordResetExpires: null,
      })
      .where(eq(schema.users.id, userId));
  }

  export async function setEmailVerificationToken(
    userId: number,
    token: string,
  ) {
    await getDb()
      .update(schema.users)
      .set({ emailVerificationToken: token })
      .where(eq(schema.users.id, userId));
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add api/queries/users.ts
  git commit -m "feat: add user queries for email/password auth"
  ```

---

### Task 8: Extend auth router

**Files:**
- Modify: `api/auth-router.ts`

- [ ] **Step 1: Replace `api/auth-router.ts` with full implementation**

  ```ts
  import * as crypto from "crypto";
  import * as cookie from "cookie";
  import bcrypt from "bcryptjs";
  import { z } from "zod";
  import { setCookie } from "hono/cookie";
  import { Session } from "@contracts/constants";
  import { getSessionCookieOptions } from "./lib/cookies";
  import { createRouter, authedQuery, publicQuery } from "./middleware";
  import { signSessionToken } from "./auth/session";
  import {
    findUserByEmail,
    findUserByVerificationToken,
    findUserByResetToken,
    createUser,
    markEmailVerified,
    setPasswordResetToken,
    updatePasswordHash,
    setEmailVerificationToken,
  } from "./queries/users";
  import {
    sendVerificationEmail,
    sendPasswordResetEmail,
  } from "./lib/email";

  function generateToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  const authInput = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  export const authRouter = createRouter({
    me: authedQuery.query((opts) => opts.ctx.user),

    logout: authedQuery.mutation(async ({ ctx }) => {
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, "", {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: 0,
        }),
      );
      return { success: true };
    }),

    signup: publicQuery
      .input(authInput)
      .mutation(async ({ input }) => {
        const existing = await findUserByEmail(input.email);
        if (existing) {
          return { success: true };
        }
        const passwordHash = await bcrypt.hash(input.password, 12);
        const verificationToken = generateToken();
        const user = await createUser({
          email: input.email,
          passwordHash,
          emailVerificationToken: verificationToken,
        });
        await sendVerificationEmail(input.email, verificationToken);
        return { success: true, userId: user.id };
      }),

    login: publicQuery
      .input(authInput)
      .mutation(async ({ input, ctx }) => {
        const user = await findUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password.");
        }
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
          throw new Error("Invalid email or password.");
        }
        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in.");
        }
        const token = await signSessionToken({
          userId: user.id,
          email: user.email,
        });
        const cookieOpts = getSessionCookieOptions(ctx.req.headers);
        ctx.resHeaders.append(
          "set-cookie",
          cookie.serialize(Session.cookieName, token, {
            httpOnly: cookieOpts.httpOnly,
            path: cookieOpts.path,
            sameSite: cookieOpts.sameSite?.toLowerCase() as "lax" | "none",
            secure: cookieOpts.secure,
            maxAge: Session.maxAgeMs / 1000,
          }),
        );
        return { success: true };
      }),

    verifyEmail: publicQuery
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const user = await findUserByVerificationToken(input.token);
        if (!user) {
          throw new Error("Invalid or expired verification token.");
        }
        await markEmailVerified(user.id);
        return { success: true };
      }),

    resendVerification: publicQuery
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const user = await findUserByEmail(input.email);
        if (user && !user.emailVerified) {
          const token = generateToken();
          await setEmailVerificationToken(user.id, token);
          await sendVerificationEmail(input.email, token);
        }
        return { success: true };
      }),

    forgotPassword: publicQuery
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const user = await findUserByEmail(input.email);
        if (user) {
          const token = generateToken();
          const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
          await setPasswordResetToken(user.id, token, expiresAt);
          await sendPasswordResetEmail(input.email, token);
        }
        return { success: true };
      }),

    resetPassword: publicQuery
      .input(
        z.object({
          token: z.string(),
          password: z.string().min(8),
        }),
      )
      .mutation(async ({ input }) => {
        const user = await findUserByResetToken(input.token);
        if (!user || !user.passwordResetExpires) {
          throw new Error("Invalid or expired reset token.");
        }
        if (user.passwordResetExpires < new Date()) {
          throw new Error("Reset token has expired.");
        }
        const hash = await bcrypt.hash(input.password, 12);
        await updatePasswordHash(user.id, hash);
        return { success: true };
      }),
  });
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add api/auth-router.ts
  git commit -m "feat: add email/password auth routes"
  ```

---

### Task 9: Remove Kimi OAuth code

**Files:**
- Delete: `api/kimi/platform.ts`
- Delete: `api/kimi/types.ts`
- Modify: `api/boot.ts`
- Modify: `api/router.ts` (if needed)

- [ ] **Step 1: Delete unused Kimi files**

  ```bash
  git rm api/kimi/platform.ts api/kimi/types.ts
  ```

- [ ] **Step 2: Remove OAuth callback from `api/boot.ts`**

  Find and remove the route that mounts `createOAuthCallbackHandler()` (likely `/api/oauth/callback`).

- [ ] **Step 3: Run type check**

  Run: `npm run check`

  Expected: no errors in `api/`.

- [ ] **Step 4: Commit**

  ```bash
  git add api/boot.ts api/kimi/platform.ts api/kimi/types.ts
  git commit -m "chore: remove Kimi OAuth callback and unused platform files"
  ```

---

### Task 10: Create frontend auth pages

**Files:**
- Modify: `src/pages/Login.tsx`
- Create: `src/pages/RegisterPage.tsx`
- Create: `src/pages/VerifyEmail.tsx`
- Create: `src/pages/ForgotPassword.tsx`
- Create: `src/pages/ResetPassword.tsx`

- [ ] **Step 1: Replace `src/pages/Login.tsx`**

  ```tsx
  import { useState } from "react";
  import { Link, useNavigate } from "react-router";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { trpc } from "@/providers/trpc";

  export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const login = trpc.auth.login.useMutation({
      onSuccess: () => navigate("/"),
      onError: (err) => setError(err.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      login.mutate({ email, password });
    };

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm space-y-1">
              <p>
                <Link to="/register" className="text-blue-500 hover:underline">
                  Create an account
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  ```

- [ ] **Step 2: Create `src/pages/RegisterPage.tsx`**

  ```tsx
  import { useState } from "react";
  import { Link } from "react-router";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { trpc } from "@/providers/trpc";

  export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const signup = trpc.auth.signup.useMutation({
      onSuccess: () => setSent(true),
      onError: (err) => setError(err.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
      signup.mutate({ email, password });
    };

    if (sent) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <CardTitle>Check your email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm">
                We sent a verification link to {email}.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Create account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={signup.isPending}>
                {signup.isPending ? "Creating..." : "Create account"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  ```

- [ ] **Step 3: Create `src/pages/VerifyEmail.tsx`**

  ```tsx
  import { useEffect, useState } from "react";
  import { useSearchParams, Link } from "react-router";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { trpc } from "@/providers/trpc";

  export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">(
      "loading",
    );

    const verify = trpc.auth.verifyEmail.useMutation({
      onSuccess: () => setStatus("success"),
      onError: () => setStatus("error"),
    });

    useEffect(() => {
      if (token) {
        verify.mutate({ token });
      } else {
        setStatus("error");
      }
    }, [token]);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Email verification</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {status === "loading" && <p>Verifying your email...</p>}
            {status === "success" && (
              <>
                <p className="mb-4">Your email has been verified.</p>
                <Button asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
              </>
            )}
            {status === "error" && (
              <p className="text-red-500">
                Invalid or expired verification link.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
  ```

- [ ] **Step 4: Create `src/pages/ForgotPassword.tsx`**

  ```tsx
  import { useState } from "react";
  import { Link } from "react-router";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { trpc } from "@/providers/trpc";

  export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const forgot = trpc.auth.forgotPassword.useMutation({
      onSuccess: () => setSent(true),
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      forgot.mutate({ email });
    };

    if (sent) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <CardTitle>Check your email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm">
                If an account exists, we sent a password reset link.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Reset password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={forgot.isPending}>
                {forgot.isPending ? "Sending..." : "Send reset link"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm">
              <Link to="/login" className="text-blue-500 hover:underline">
                Back to sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  ```

- [ ] **Step 5: Create `src/pages/ResetPassword.tsx`**

  ```tsx
  import { useState } from "react";
  import { useSearchParams, Link } from "react-router";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { trpc } from "@/providers/trpc";

  export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const reset = trpc.auth.resetPassword.useMutation({
      onSuccess: () => setDone(true),
      onError: (err) => setError(err.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (!token) {
        setError("Invalid reset link.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
      reset.mutate({ token, password });
    };

    if (done) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <CardTitle>Password updated</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">Your password has been reset.</p>
              <Button asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Set new password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={reset.isPending}>
                {reset.isPending ? "Updating..." : "Update password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add src/pages/Login.tsx src/pages/RegisterPage.tsx src/pages/VerifyEmail.tsx src/pages/ForgotPassword.tsx src/pages/ResetPassword.tsx
  git commit -m "feat: add email/password frontend auth pages"
  ```

---

### Task 11: Wire up routes and update signup CTA

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/SignupPage.tsx`

- [ ] **Step 1: Update `src/App.tsx`**

  Add imports:
  ```tsx
  import RegisterPage from "./pages/RegisterPage"
  import VerifyEmail from "./pages/VerifyEmail"
  import ForgotPassword from "./pages/ForgotPassword"
  import ResetPassword from "./pages/ResetPassword"
  ```

  Add routes:
  ```tsx
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/verify-email" element={<VerifyEmail />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  ```

- [ ] **Step 2: Update signup CTA in `src/pages/SignupPage.tsx`**

  Find the link:
  ```tsx
  <Link to="/login" state={{ from: "/signup" }}>
    Continue with Kimi
  </Link>
  ```
  and replace with:
  ```tsx
  <Link to="/register" state={{ from: "/signup" }}>
    Create account
  </Link>
  ```

  Also update the paragraph text that mentions Kimi.

- [ ] **Step 3: Commit**

  ```bash
  git add src/App.tsx src/pages/SignupPage.tsx
  git commit -m "feat: wire up auth routes and update signup CTA"
  ```

---

### Task 12: Generate migration and verify

**Files:**
- Modify: `db/migrations/` (generated)

- [ ] **Step 1: Generate migration**

  Ensure `DATABASE_URL` is set in `.env`, then run:
  ```bash
  npm run db:generate
  ```

- [ ] **Step 2: Type check**

  Run: `npm run check`

  Expected: no errors in `api/`; only pre-existing frontend errors in `src/`.

- [ ] **Step 3: Commit**

  ```bash
  git add db/migrations/
  git commit -m "chore: generate auth schema migration"
  ```

---

### Task 13: Manual smoke test

**Files:**
- None (verification only)

- [ ] **Step 1: Start dev server**

  Run: `npm run dev`

- [ ] **Step 2: Run through flows**

  1. Register at `/register` → check console for verification link.
  2. Visit verification link → success.
  3. Login at `/login` → redirected to `/`.
  4. Logout → redirected to `/login`.
  5. Forgot password → check console for reset link.
  6. Visit reset link → set new password.
  7. Login with new password.

- [ ] **Step 3: Report results**

  Note any issues found. If all flows work, mark Task 13 complete.

---

## Self-Review Checklist

- **Spec coverage:**
  - Schema changes → Task 2
  - Env vars → Task 3
  - Email service → Task 4
  - Session layer → Task 5
  - Request authentication → Task 6
  - User queries → Task 7
  - Auth routes → Task 8
  - Remove OAuth → Task 9
  - Frontend pages → Tasks 10–11
  - Migration generation → Task 12
  - Testing → Task 13
- **Placeholder scan:** No TBD/TODO/fill-in-details steps.
- **Type consistency:** Session payload uses `{ userId, email }`; user queries match schema columns; auth router uses the same helper names defined in Task 7.
