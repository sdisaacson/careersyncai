import { z } from "zod";
import { createRouter, adminQuery } from "../lib/api/middleware";
import { getDb } from "../queries/api/connection";
import { appSettings } from "@db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createRouter({
  getAll: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(appSettings);
  }),

  get: adminQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(appSettings)
        .where(eq(appSettings.key, input.key))
        .limit(1);
      return rows[0]?.value ?? null;
    }),

  update: adminQuery
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .insert(appSettings)
        .values({ key: input.key, value: input.value })
        .onConflictDoUpdate({
          target: appSettings.key,
          set: { value: input.value },
        });
      return { success: true };
    }),

  updateMany: adminQuery
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const [key, value] of Object.entries(input)) {
        await db
          .insert(appSettings)
          .values({ key, value })
          .onConflictDoUpdate({ target: appSettings.key, set: { value } });
      }
      return { success: true };
    }),
});
