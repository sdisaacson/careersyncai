import { z } from "zod";
import { createRouter, publicQuery } from "../lib/api/middleware.js";
import { getDb } from "../queries/api/connection.js";
import { tailoredResumes } from "../../db/schema.js";
import { eq, desc } from "drizzle-orm";

export const resumeRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        jobId: z.number(),
        profileId: z.number(),
        content: z.string(),
        pdfUrl: z.string().optional(),
        highlights: z.string().optional(),
        changesMade: z.string().optional(),
        narrativeSummary: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [{ id }] = await db
        .insert(tailoredResumes)
        .values(input)
        .returning({ id: tailoredResumes.id });
      return { id };
    }),

getByProfile: publicQuery
    .input(z.object({ profileId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(tailoredResumes)
        .where(eq(tailoredResumes.profileId, input.profileId))
        .orderBy(desc(tailoredResumes.createdAt));
    }),

  getByJob: publicQuery
    .input(z.object({ jobId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [resume] = await db
        .select()
        .from(tailoredResumes)
        .where(eq(tailoredResumes.jobId, input.jobId))
        .limit(1);
      return resume ?? null;
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          content: z.string().optional(),
          pdfUrl: z.string().optional(),
          highlights: z.string().optional(),
          changesMade: z.string().optional(),
          narrativeSummary: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [updated] = await db
        .update(tailoredResumes)
        .set(input.data)
        .where(eq(tailoredResumes.id, input.id))
        .returning();
      return updated ?? null;
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(tailoredResumes).where(eq(tailoredResumes.id, input.id));
      return { success: true };
    }),
});
