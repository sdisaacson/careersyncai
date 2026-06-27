import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { researchSessions } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const researchRouter = createRouter({
  create: publicQuery
    .input(z.object({ profileId: z.number(), totalSectors: z.number().default(8) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [{ id }] = await db.insert(researchSessions).values({
        profileId: input.profileId,
        totalSectors: input.totalSectors,
        completedSectors: 0,
        totalJobsFound: 0,
        status: "running",
      }).returning({ id: researchSessions.id });
      return { id };
    }),

  get: publicQuery
    .input(z.object({ profileId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(researchSessions)
        .where(eq(researchSessions.profileId, input.profileId))
        .orderBy(desc(researchSessions.startedAt))
        .limit(1);
      return result[0] ?? null;
    }),

  updateProgress: publicQuery
    .input(
      z.object({
        id: z.number(),
        completedSectors: z.number().optional(),
        totalJobsFound: z.number().optional(),
        log: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db.update(researchSessions).set(data).where(eq(researchSessions.id, id));
      return { success: true };
    }),

  complete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(researchSessions)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(researchSessions.id, input.id));
      return { success: true };
    }),

  fail: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(researchSessions)
        .set({ status: "failed", completedAt: new Date() })
        .where(eq(researchSessions.id, input.id));
      return { success: true };
    }),

  appendLog: publicQuery
    .input(z.object({ id: z.number(), message: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const session = await db
        .select()
        .from(researchSessions)
        .where(eq(researchSessions.id, input.id))
        .limit(1);
      if (session[0]) {
        const currentLog = session[0].log ?? "";
        const newLog = currentLog + "\n" + input.message;
        await db
          .update(researchSessions)
          .set({ log: newLog })
          .where(eq(researchSessions.id, input.id));
      }
      return { success: true };
    }),
});
