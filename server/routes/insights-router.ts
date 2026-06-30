import { z } from "zod";
import { createRouter, publicQuery } from "../lib/api/middleware.js";
import { getDb } from "../queries/api/connection.js";
import { jobInsights } from "../../db/schema.js";
import { eq, desc } from "drizzle-orm";

const insightInput = z.object({
  insightType: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.enum(["opportunity", "warning", "info"]),
  data: z.any().optional(),
});

export const insightsRouter = createRouter({
  getByProfile: publicQuery
    .input(z.object({ profileId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(jobInsights)
        .where(eq(jobInsights.profileId, input.profileId))
        .orderBy(desc(jobInsights.createdAt));
    }),

  // Replace the persisted insight set for a profile with a freshly computed one.
  upsertMany: publicQuery
    .input(
      z.object({
        profileId: z.number(),
        userId: z.number(),
        insights: z.array(insightInput),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(jobInsights)
        .where(eq(jobInsights.profileId, input.profileId));

      if (input.insights.length === 0) {
        return { count: 0 };
      }

      const rows = input.insights.map(i => ({
        profileId: input.profileId,
        userId: input.userId,
        insightType: i.insightType,
        title: i.title,
        description: i.description,
        severity: i.severity,
        data: i.data ?? null,
      }));

      await db.insert(jobInsights).values(rows);
      return { count: rows.length };
    }),
});
