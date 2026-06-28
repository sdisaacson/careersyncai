import { z } from "zod";
import { createRouter, publicQuery } from "../lib/api/middleware.js";
import { getDb } from "../queries/api/connection.js";
import { jobs } from "@db/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";

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
        status: z.enum(["discovered", "shortlisted", "applied", "archived"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [{ id }] = await db
        .insert(jobs)
        .values(input)
        .returning({ id: jobs.id });
      return { id };
    }),

getByProfile: publicQuery
    .input(z.object({ profileId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(jobs)
        .where(eq(jobs.profileId, input.profileId))
        .orderBy(desc(jobs.createdAt));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [job] = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, input.id))
        .limit(1);
      return job ?? null;
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          company: z.string().optional(),
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
          status: z.enum(["discovered", "shortlisted", "applied", "archived"]).optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [updated] = await db
        .update(jobs)
        .set(input.data)
        .where(eq(jobs.id, input.id))
        .returning();
      return updated ?? null;
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(jobs).where(eq(jobs.id, input.id));
      return { success: true };
    }),

  search: publicQuery
    .input(
      z.object({
        profileId: z.number(),
        query: z.string().optional(),
        sectorId: z.number().optional(),
        jobType: z.string().optional(),
        experienceLevel: z.string().optional(),
        location: z.string().optional(),
        status: z.enum(["discovered", "shortlisted", "applied", "archived"]).optional(),
        minFitScore: z.number().optional(),
        sortBy: z.enum(["createdAt", "fitScore", "postedDate"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(jobs.profileId, input.profileId)];

      if (input.sectorId !== undefined) {
        conditions.push(eq(jobs.sectorId, input.sectorId));
      }
      if (input.jobType) {
        conditions.push(eq(jobs.jobType, input.jobType));
      }
      if (input.experienceLevel) {
        conditions.push(eq(jobs.experienceLevel, input.experienceLevel));
      }
      if (input.location) {
        conditions.push(eq(jobs.location, input.location));
      }
      if (input.status) {
        conditions.push(eq(jobs.status, input.status));
      }
      if (input.minFitScore !== undefined) {
        conditions.push(gte(jobs.fitScore, input.minFitScore));
      }

      const sortBy = input.sortBy ?? "createdAt";
      const sortOrder = input.sortOrder ?? "desc";

      const sortColumn =
        sortBy === "fitScore"
          ? jobs.fitScore
          : sortBy === "postedDate"
            ? jobs.postedDate
            : jobs.createdAt;

      const query = db
        .select()
        .from(jobs)
        .where(and(...conditions))
        .orderBy(sortOrder === "asc" ? sql`${sortColumn} asc` : sql`${sortColumn} desc`)
        .limit(input.limit ?? 100)
        .offset(input.offset ?? 0);

      return query;
    }),

  getStats: publicQuery
    .input(z.object({ profileId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [result] = await db
        .select({
          total: sql<number>`count(*)`,
          avgFitScore: sql<number>`avg(${jobs.fitScore})`,
          maxFitScore: sql<number>`max(${jobs.fitScore})`,
          minFitScore: sql<number>`min(${jobs.fitScore})`,
        })
        .from(jobs)
        .where(eq(jobs.profileId, input.profileId));

      return {
        total: result?.total ?? 0,
        avgFitScore: result?.avgFitScore ? Math.round(result.avgFitScore * 10) / 10 : 0,
        maxFitScore: result?.maxFitScore ?? 0,
        minFitScore: result?.minFitScore ?? 0,
      };
    }),
});
