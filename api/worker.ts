import { Hono } from "hono";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContextFactory } from "./context";
import { setCurrentCloudflareEnv } from "./lib/cloudflare-env";

const app = new Hono();

// CORS middleware
app.use("/api/*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (c.req.method === "OPTIONS") {
    return c.text("", 204);
  }
  await next();
});

// Request logging
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

// Health check
app.get("/api/health", (c) => c.json({ ok: true, ts: Date.now() }));

// tRPC handler
app.use("/api/trpc/*", async (c) => {
  try {
    // Set the Cloudflare env globally so getDb() and other functions can access it
    setCurrentCloudflareEnv(c.env as any);
    
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext: createContextFactory(c.env as any),
    });
    return response;
  } catch (err) {
    console.error("[tRPC ERROR]", err);
    return c.json({ error: "Internal Server Error", message: err instanceof Error ? err.message : "Unknown error" }, 500);
  }
});

// Catch-all for unmatched API routes
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// SPA fallback - serve index.html for non-API routes
// Note: With not_found_handling = "single-page-application" in wrangler.toml,
// navigation requests (with Sec-Fetch-Mode: navigate) are handled by Cloudflare
// automatically. This fallback handles non-navigation requests and API errors.
app.get("*", async (c) => {
  try {
    const asset = await c.env.ASSETS.fetch(c.req.raw);
    if (asset.status === 404) {
      const index = await c.env.ASSETS.fetch(new URL("/index.html", c.req.url));
      return index;
    }
    return asset;
  } catch {
    // If ASSETS.fetch throws (e.g., path doesn't exist), fallback to index.html
    try {
      const index = await c.env.ASSETS.fetch(new URL("/index.html", c.req.url));
      return index;
    } catch {
      return c.text("Not Found", 404);
    }
  }
});

export default app;
