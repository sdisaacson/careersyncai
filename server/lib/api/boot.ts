import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "../../../api/lib/env.js";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
  console.log(
    `[${new Date().toISOString()}] ${c.req.method} ${c.req.url} - ${c.res.status} (${duration}ms)`
  );
});

// Health check endpoint (no auth required)
app.get("/api/health", c => c.json({ ok: true, ts: Date.now() }));

// Simple test endpoint
app.post("/api/test", async c => {
  const body = await c.req.json().catch(() => ({}));
  return c.json({ received: body, ok: true });
});

// tRPC handler - must match the endpoint exactly
app.use("/api/trpc/*", async c => {
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext,
    });
    return response;
  } catch (err) {
    console.error("[tRPC ERROR]", err);
    return c.json(
      {
        error: "Internal Server Error",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      500
    );
  }
});

// Catch-all for unmatched API routes
app.all("/api/*", c => c.json({ error: "Not Found" }, 404));

// Serve static files and SPA fallback in production
if (env.isProduction) {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const distPath = path.resolve(__dirname, "../dist/public");

  app.use("*", serveStatic({ root: "./dist/public" }));

  app.notFound(c => {
    const accept = c.req.header("accept") ?? "";
    if (!accept.includes("text/html")) {
      return c.json({ error: "Not Found" }, 404);
    }
    const indexPath = path.resolve(distPath, "index.html");
    const content = fs.readFileSync(indexPath, "utf-8");
    return c.html(content);
  });
}

export default app;
