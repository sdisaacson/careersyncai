import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../../../db/schema.js";
import * as relations from "../../../db/relations.js";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  return url;
}

export function getDb() {
  if (!instance) {
    const client = postgres(getDatabaseUrl(), { prepare: false, ssl: { rejectUnauthorized: false } });
    instance = drizzle(client, { schema: fullSchema });
  }
  return instance;
}
