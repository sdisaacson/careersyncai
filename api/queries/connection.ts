import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@db/schema";
import * as relations from "@db/relations";
import { getCurrentCloudflareEnv } from "../lib/cloudflare-env";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

function getDatabaseUrl(): string {
  // First try the per-request Cloudflare env (set by worker.ts)
  const cloudflareEnv = getCurrentCloudflareEnv();
  if (cloudflareEnv?.DATABASE_URL) {
    return cloudflareEnv.DATABASE_URL;
  }
  // Fallback to process.env for local Node.js development
  if (typeof process !== "undefined" && process.env?.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  throw new Error("DATABASE_URL is not configured");
}

export function getDb() {
  if (!instance) {
    const client = postgres(getDatabaseUrl(), { prepare: false });
    instance = drizzle(client, { schema: fullSchema });
  }
  return instance;
}
