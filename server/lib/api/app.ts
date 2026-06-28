import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";

const app = new Hono();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// CORS middleware
app.use("/api/*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (c.req.method === "OPTIONS") {
    return c.text("", 204 as unknown as Parameters<typeof c.text>[1]);
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
  console.log(
    `[${new Date().toISOString()}] ${c.req.method} ${c.req.url} - ${c.res.status} (${duration}ms)`
  );
});

// Health check
app.get("/api/health", c => c.json({ ok: true, ts: Date.now() }));

// tRPC handler
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

export default app;
