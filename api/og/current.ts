import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import fs from "fs";
import path from "path";
import postgres from "postgres";
import * as schema from "../../db/schema.js";
import { OG_CARD_COUNT } from "../../src/lib/og-cards";

const CURRENT_OG_KEY = "current_og_index";
const FALLBACK_IMAGE = "/og-careersync.jpg";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  return url;
}

function getCardPath(index: number): string {
  return path.resolve(process.cwd(), "public", "og-cards", `card-${index}.png`);
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  let index = 0;
  let client: ReturnType<typeof postgres> | null = null;

  try {
    client = postgres(getDatabaseUrl(), {
      prepare: false,
      ssl: { rejectUnauthorized: false },
    });
    const db = drizzle(client, { schema });

    const row = await db
      .select({ value: schema.appSettings.value })
      .from(schema.appSettings)
      .where(eq(schema.appSettings.key, CURRENT_OG_KEY))
      .limit(1);

    const parsed = row[0]?.value ? parseInt(row[0].value, 10) : 0;
    index = Number.isNaN(parsed) ? 0 : parsed % OG_CARD_COUNT;
  } catch (err) {
    console.error("[og/current] database error:", err);
    index = 0;
  } finally {
    await client?.end();
  }

  const cardPath = getCardPath(index);

  if (!fs.existsSync(cardPath)) {
    res.redirect(302, FALLBACK_IMAGE);
    return;
  }

  res.setHeader("Content-Type", "image/png");
  res.setHeader(
    "Cache-Control",
    "public, max-age=300, stale-while-revalidate=86400"
  );
  const stream = fs.createReadStream(cardPath);
  stream.pipe(res);
}
