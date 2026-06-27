import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { jobs } from "@db/schema";
import { eq, desc, asc, and, gte, sql } from "drizzle-orm";

export const jobRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        profileId: z.number(),
        sectorId: z.number().optional(),
        title: z.string(),
        company: z.string(),
        location: z.string().optional(),
        jobDescription: z.string().optional(),
        requirements: z.string().optional(),
        responsibilities: z.string().optional(),
        salaryRange: z.string().optional(),
        jobType: z.string().optional(),
        experienceLevel: z.string().optional(),
        applicationLink: z.string().optional(),
        deadline: z.string().optional(),
        postedDate: z.string().optional(),
        source: z.string().optional(),
        fitScore: z.number().optional(),
        matchReasons: z.string().optional(),
        skillGaps: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [{ id }] = await db.insert(jobs).values(input).returning({ id: jobs.id });
      return { id };
    }),

  createMany: publicQuery
    .input(z.array(z.any()))
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.length === 0) return { count: 0 };
      await db.insert(jobs).values(input as any);
      return { count: input.length };
    }),

  getByProfile: publicQuery
    .input(z.object({ profileId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(jobs)
        .where(eq(jobs.profileId, input.profileId))
        .orderBy(desc(jobs.fitScore));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["discovered", "shortlisted", "applied", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(jobs)
        .set({ status: input.status })
        .where(eq(jobs.id, input.id));
      return { success: true };
    }),

  filter: publicQuery
    .input(
      z.object({
        profileId: z.number(),
        sectorId: z.number().optional(),
        minFitScore: z.number().optional(),
        status: z.enum(["discovered", "shortlisted", "applied", "archived"]).optional(),
        search: z.string().optional(),
        sortBy: z.enum(["fitScore", "createdAt", "title", "company"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { profileId, sectorId, minFitScore, status, search, sortBy, sortOrder } = input;
      const db = getDb();
      const conditions = [eq(jobs.profileId, profileId)];

      if (sectorId) conditions.push(eq(jobs.sectorId, sectorId));
      if (minFitScore) conditions.push(gte(jobs.fitScore, minFitScore));
      if (status) conditions.push(eq(jobs.status, status));
      if (search) {
        conditions.push(
          sql`${jobs.title} LIKE ${`%${search}%`} OR ${jobs.company} LIKE ${`%${search}%`}`
        );
      }

      const orderCol =
        sortBy === "fitScore"
          ? jobs.fitScore
          : sortBy === "title"
            ? jobs.title
            : sortBy === "company"
              ? jobs.company
              : jobs.createdAt;

      return db
        .select()
        .from(jobs)
        .where(and(...conditions))
        .orderBy(sortOrder === "asc" ? asc(orderCol) : desc(orderCol));
    }),

  stats: publicQuery
    .input(z.object({ profileId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const all = await db
        .select()
        .from(jobs)
        .where(eq(jobs.profileId, input.profileId));

      return {
        total: all.length,
        bySector: all.reduce((acc, job) => {
          const sector = job.sectorId?.toString() ?? "unknown";
          acc[sector] = (acc[sector] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        avgFitScore: all.length > 0 ? Math.round(all.reduce((s, j) => s + (j.fitScore ?? 0), 0) / all.length) : 0,
        shortlisted: all.filter((j) => j.status === "shortlisted").length,
        applied: all.filter((j) => j.status === "applied").length,
      };
    }),

  deleteByProfile: publicQuery
    .input(z.object({ profileId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(jobs).where(eq(jobs.profileId, input.profileId));
      return { success: true };
    }),
});
