import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContextFactory } from "./context";
import { env } from "./lib/env";
import { setCurrentCloudflareEnv } from "./lib/cloudflare-env";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// CORS middleware - allow all origins in dev
app.use("/api/*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (c.req.method === "OPTIONS") {
    return c.text("", 204);
  }
  await next();
});

// Request logging middleware
app.use("/api/*", async (c, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  try {
    await next();
  } catch (err) {
    console.error(`[ERROR] ${c.req.method} ${c.req.url}:`, err);
    throw err;
  }
  const duration = Date.now() - start;
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url} - ${c.res.status} (${duration}ms)`);
});

// Health check endpoint (no auth required)
app.get("/api/health", (c) => c.json({ ok: true, ts: Date.now() }));

// Simple test endpoint
app.post("/api/test", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  return c.json({ received: body, ok: true });
});

// tRPC handler - must match the endpoint exactly
app.use("/api/trpc/*", async (c) => {
  try {
    // For local dev, create a CloudflareEnv-like object from process.env
    const localEnv = {
      APP_SECRET: process.env.APP_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      FROM_EMAIL: process.env.FROM_EMAIL,
      MOONSHOT_API_KEY: process.env.MOONSHOT_API_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      APP_ID: process.env.APP_ID,
      BASE_URL: process.env.BASE_URL,
      ADMIN_SECRET_PATH: process.env.ADMIN_SECRET_PATH,
      ADMIN_EMAILS: process.env.ADMIN_EMAILS,
      NODE_ENV: process.env.NODE_ENV,
    };
    setCurrentCloudflareEnv(localEnv);
    
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext: createContextFactory(localEnv),
    });
    return response;
  } catch (err) {
    console.error("[tRPC ERROR]", err);
    return c.json({ error: "Internal Server Error", message: err instanceof Error ? err.message : "Unknown error" }, 500);
  }
});

// Catch-all for unmatched API routes
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
