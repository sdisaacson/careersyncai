# Deployment Guide

This guide covers deploying CareerSync AI to production.

---

## Prerequisites

- Node.js 20+ runtime
- PostgreSQL 14+ database (Supabase recommended)
- Domain name (optional but recommended)
- Resend API key (for transactional emails)
- Stripe account (for payments, optional)

---

## Environment Variables

Copy `.env.example` to `.env` and configure all required variables:

### Required

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | PostgreSQL connection string |
| `APP_SECRET` | `your-32-char-secret-here` | JWT signing key (min 32 chars) |
| `BASE_URL` | `https://careersync.app` | Public base URL |

### Optional

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Email sending via Resend |
| `FROM_EMAIL` | Sender email address |
| `MOONSHOT_API_KEY` | LLM-powered features |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `STRIPE_PRICE_STARTER` | Price ID for Starter plan |
| `STRIPE_PRICE_PRO` | Price ID for Pro plan |
| `STRIPE_PRICE_PREMIUM` | Price ID for Premium plan |

---

## Build Process

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Build frontend + backend
npm run build
```

The build produces:
- `dist/public/` — Static frontend assets (Vite output)
- `dist/boot.js` — Bundled Hono backend (esbuild)

---

## Production Server

### Start the Server

```bash
NODE_ENV=production node dist/boot.js
```

The server:
1. Serves static files from `dist/public/`
2. Handles SPA routing (returns `index.html` for unknown routes)
3. Runs tRPC API at `/api/trpc/*`
4. Listens on port `PORT` env var (default: 3000)

### Process Management (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start dist/boot.js --name careersync

# Save PM2 config
pm2 save
pm2 startup
```

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist/ ./dist/
COPY .env ./
EXPOSE 3000
CMD ["node", "dist/boot.js"]
```

---

## Database Deployment

### Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy the connection string from Settings → Database
3. Set `DATABASE_URL` in your environment
4. Run migrations: `npm run db:migrate`

### Self-Hosted PostgreSQL

```bash
# Create database
createdb careersync

# Run migrations
DATABASE_URL=postgresql://user:pass@localhost:5432/careersync npm run db:migrate
```

---

## Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name careersync.app;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

For HTTPS, use Certbot:

```bash
sudo certbot --nginx -d careersync.app
```

---

## Health Checks

The server exposes a health endpoint:

```bash
curl https://careersync.app/api/health
# { "ok": true, "ts": 1234567890 }
```

Use this for load balancer health checks and monitoring.

---

## Admin Setup

### First Admin

1. Sign up with an email listed in `ADMIN_EMAILS`
2. Verify email
3. Navigate to `/admin` (or your configured `ADMIN_SECRET_PATH`)
4. Access the admin dashboard

### Admin Features

- View total users, active subscriptions
- Manage user roles
- View subscription data
- Configure app settings (API keys, default plans)

---

## Monitoring

### Logs

The server logs all requests:

```
[2024-01-01T00:00:00.000Z] GET https://careersync.app/api/health - 200 (5ms)
```

### Error Tracking

Consider integrating:
- Sentry for error tracking
- Logtail for log aggregation
- UptimeRobot for uptime monitoring

---

## SSL/TLS

Always use HTTPS in production. The auth system relies on secure cookies (`secure: true` when not localhost).

---

## Scaling Considerations

- **Stateless backend**: Each request is independent; scale horizontally
- **Database**: Use connection pooling (Supabase handles this automatically)
- **Static assets**: Serve via CDN for best performance
- **Sessions**: Stored client-side in JWT cookies; no server session state needed
