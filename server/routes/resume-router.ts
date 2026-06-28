import { z } from "zod";
import { createRouter, publicQuery } from "../lib/api/middleware";
import { getDb } from "../queries/api/connection";
import { tailoredResumes } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const resumeRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        jobId: z.number(),
        profileId: z.number(),
        content: z.string(),
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

  createMany: publicQuery
    .input(z.array(z.record(z.any())))
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.length === 0) return { count: 0 };
      await db.insert(tailoredResumes).values(input as unknown[]);
      return { count: input.length };
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
      const result = await db
        .select()
        .from(tailoredResumes)
        .where(eq(tailoredResumes.jobId, input.jobId))
        .limit(1);
      return result[0] ?? null;
    }),

  updatePdfUrl: publicQuery
    .input(z.object({ id: z.number(), pdfUrl: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(tailoredResumes)
        .set({ pdfUrl: input.pdfUrl })
        .where(eq(tailoredResumes.id, input.id));
      return { success: true };
    }),
});
