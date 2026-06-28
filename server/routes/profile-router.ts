import { z } from "zod";
import { createRouter, publicQuery } from "../lib/api/middleware.js";
import { getDb } from "../queries/api/connection.js";
import { profiles } from "../../db/schema.js";
import { eq, desc } from "drizzle-orm";

export const profileRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        userId: z.number(),
        fullName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        targetLocation: z.string().optional(),
        summary: z.string().optional(),
        skills: z.string().optional(),
        education: z.string().optional(),
        experience: z.string().optional(),
        researchFocus: z.string().optional(),
        internships: z.string().optional(),
        certifications: z.string().optional(),
        preferredRoles: z.string().optional(),
        preferredIndustries: z.string().optional(),
        salaryExpectation: z.string().optional(),
        workType: z.string().optional(),
        resumeText: z.string().optional(),
        resumeUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [{ id }] = await db
        .insert(profiles)
        .values(input)
        .returning({ id: profiles.id });
      return { id, success: true };
    }),

  getByUser: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, input.userId))
        .orderBy(desc(profiles.createdAt))
        .limit(1);
      return result[0] ?? null;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        fullName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        targetLocation: z.string().optional(),
        summary: z.string().optional(),
        skills: z.string().optional(),
        education: z.string().optional(),
        experience: z.string().optional(),
        researchFocus: z.string().optional(),
        internships: z.string().optional(),
        certifications: z.string().optional(),
        preferredRoles: z.string().optional(),
        preferredIndustries: z.string().optional(),
        salaryExpectation: z.string().optional(),
        workType: z.string().optional(),
        resumeText: z.string().optional(),
        resumeUrl: z.string().optional(),
        status: z.enum(["uploaded", "interviewing", "completed"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db.update(profiles).set(data).where(eq(profiles.id, id));
      return { success: true };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(profiles).orderBy(desc(profiles.createdAt));
  }),
});
