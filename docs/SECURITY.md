# Security

Security practices and implementation details for CareerSync AI.

---

## Authentication

### JWT Session Tokens

- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret**: `APP_SECRET` environment variable (min 32 characters)
- **Payload**: `{ userId, email, sessionVersion }`
- **Expiration**: 1 year
- **Storage**: HTTP-only cookie (`kimi_sid`)

```ts
// api/auth/session.ts
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(secret);
}
```

### Cookie Security

```ts
// api/lib/cookies.ts
export function getSessionCookieOptions(headers: Headers): CookieOptions {
  const localhost = isLocalhost(headers);
  return {
    httpOnly: true,      // Not accessible via JavaScript
    path: "/",
    sameSite: localhost ? "Lax" : "None",
    secure: !localhost,  // HTTPS only in production
  };
}
```

### Session Invalidation

- Each user has a `sessionVersion` counter
- Changing password increments `sessionVersion`
- Old tokens fail verification against new version
- No server-side session storage needed

---

## Password Security

### Hashing

- **Algorithm**: bcrypt
- **Cost factor**: 12 rounds
- **Storage**: `users.passwordHash` column

```ts
// Hash on signup
const passwordHash = await bcrypt.hash(input.password, 12);

// Verify on login
const valid = await bcrypt.compare(input.password, user.passwordHash);
```

### Password Requirements

- Minimum 8 characters (enforced by Zod schema)
- No additional complexity requirements (length is sufficient entropy)

---

## Role-Based Access Control (RBAC)

### Roles

| Role | Description | Access |
|------|-------------|--------|
| `user` | Default role | Own profile, jobs, resumes, subscription |
| `admin` | Elevated privileges | All user access + admin dashboard, user management, settings |

### Middleware Levels

```ts
// api/middleware.ts
publicQuery   → no auth required
authedQuery   → valid JWT session required
adminQuery    → authedQuery + role === "admin"
```

### Admin Assignment

1. **Auto-assignment**: Emails in `ADMIN_EMAILS` env var get `admin` role on signup
2. **Manual**: Admin can promote/demote users via `/admin/users`

---

## Input Validation

### Zod Schemas

All tRPC inputs are validated with Zod:

```ts
// api/auth-router.ts
const authInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Validation Coverage

- Auth: email format, password length
- Profile: optional fields with type constraints
- Jobs: required title/company, optional metadata
- Interviews: numeric IDs, string answers

---

## Email Security

### Verification Flow

1. User signs up → `emailVerificationToken` generated (random 32-byte hex)
2. Token stored hashed in database
3. Email sent with verification link (`/verify-email?token={token}`)
4. Token expires after 24 hours
5. Verified users can log in

### Password Reset Flow

1. User requests reset → `passwordResetToken` generated
2. Token expires after 1 hour
3. Email sent with reset link (`/reset-password?token={token}`)
4. Token validated before allowing new password

### Email Sending

- **Production**: Resend API with verified domain
- **Development**: Links logged to console (no real email sent)
- **Fallback**: Errors are logged, not exposed to client

---

## Database Security

### Connection Security

- PostgreSQL connection via `DATABASE_URL` (SSL enforced in production)
- Connection pooling handled by Supabase or pgBouncer
- No raw SQL injection risk (Drizzle ORM parameterizes all queries)

### Data Protection

| Data | Storage | Notes |
|------|---------|-------|
| Passwords | bcrypt hash | Never stored plain text |
| JWT tokens | Client cookies | HTTP-only, secure flag |
| API keys | Environment vars | Never in code or client |
| Resume text | Database | Encrypted at rest (if DB supports) |
| Email tokens | Hashed in DB | SHA-256 hash of random token |

---

## Environment Variable Security

### Required Variables

```bash
APP_SECRET=          # JWT signing key (generate with: openssl rand -base64 32)
DATABASE_URL=        # PostgreSQL connection (use SSL)
BASE_URL=            # Public URL for email links
```

### Sensitive Variables

```bash
RESEND_API_KEY=      # Email service API key
MOONSHOT_API_KEY=    # LLM API key
STRIPE_SECRET_KEY=   # Payment processing
STRIPE_WEBHOOK_SECRET= # Stripe webhook verification
```

### Best Practices

- Never commit `.env` to version control
- Use `.env.example` as template (no real values)
- Rotate secrets periodically
- Use different secrets per environment (dev/staging/prod)

---

## CORS & CSRF

### CORS Policy

```ts
// api/boot.ts
app.use("/api/*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");  // Dev only
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // ...
});
```

**Production**: Restrict `Access-Control-Allow-Origin` to your domain.

### CSRF Protection

- `SameSite` cookie attribute (Lax in dev, None with secure in prod)
- tRPC mutations require authentication (not vulnerable to simple CSRF)
- No state-changing GET endpoints

---

## Rate Limiting

Currently implemented via:
- Body size limit: 50MB (`hono/body-limit`)
- No explicit rate limiting on API endpoints (recommended for production)

**Recommended additions**:
- `hono-rate-limiter` for per-IP limits
- Cloudflare rate limiting (if behind Cloudflare)

---

## Security Headers

Recommended for production (add via Hono middleware or reverse proxy):

```ts
app.use("*", async (c, next) => {
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  await next();
});
```

---

## Security Checklist

### Before Production

- [ ] `APP_SECRET` is strong and unique
- [ ] `NODE_ENV=production` sets `secure: true` on cookies
- [ ] Database uses SSL connection
- [ ] Resend API key configured for real emails
- [ ] Stripe keys configured for real payments (if enabled)
- [ ] CORS restricted to production domain
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] `.env` excluded from git
- [ ] Admin emails configured
- [ ] Database backups scheduled

---

## Reporting Security Issues

If you discover a security vulnerability, please contact the maintainers directly rather than opening a public issue.
