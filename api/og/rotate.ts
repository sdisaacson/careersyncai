import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../db/schema.js";
import { OG_CARD_COUNT } from "../../src/lib/og-cards";

const CURRENT_OG_KEY = "current_og_index";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  return url;
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    const client = postgres(getDatabaseUrl(), {
      prepare: false,
      ssl: { rejectUnauthorized: false },
    });
    const db = drizzle(client, { schema });

    const existing = await db
      .select({ value: schema.appSettings.value })
      .from(schema.appSettings)
      .where(eq(schema.appSettings.key, CURRENT_OG_KEY))
      .limit(1);

    const currentIndex = existing[0]?.value
      ? parseInt(existing[0].value, 10)
      : 0;
    const nextIndex = Number.isNaN(currentIndex)
      ? 0
      : (currentIndex + 1) % OG_CARD_COUNT;

    if (existing.length === 0) {
      await db.insert(schema.appSettings).values({
        key: CURRENT_OG_KEY,
        value: String(nextIndex),
      });
    } else {
      await db
        .update(schema.appSettings)
        .set({ value: String(nextIndex) })
        .where(eq(schema.appSettings.key, CURRENT_OG_KEY));
    }

    await client.end();

    res.status(200).json({
      success: true,
      previousIndex: currentIndex,
      currentIndex: nextIndex,
    });
  } catch (err) {
    console.error("[og/rotate] error:", err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
