import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { interviews, interviewQuestions } from "@db/schema";
import { eq, desc, asc } from "drizzle-orm";

export const interviewRouter = createRouter({
  create: publicQuery
    .input(z.object({ profileId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [{ id }] = await db.insert(interviews).values({
        profileId: input.profileId,
        status: "in_progress",
        currentQuestion: 0,
        totalQuestions: 8,
      }).returning({ id: interviews.id });
      return { id };
    }),

  get: publicQuery
    .input(z.object({ profileId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(interviews)
        .where(eq(interviews.profileId, input.profileId))
        .orderBy(desc(interviews.createdAt))
        .limit(1);
      return result[0] ?? null;
    }),

  addQuestion: publicQuery
    .input(
      z.object({
        interviewId: z.number(),
        question: z.string(),
        category: z.string(),
        order: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [{ id }] = await db.insert(interviewQuestions).values(input).returning({ id: interviewQuestions.id });
      return { id, success: true };
    }),

  answerQuestion: publicQuery
    .input(
      z.object({
        id: z.number(),
        answer: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, answer } = input;
      const db = getDb();
      await db
        .update(interviewQuestions)
        .set({ answer })
        .where(eq(interviewQuestions.id, id));
      return { success: true };
    }),

  getQuestions: publicQuery
    .input(z.object({ interviewId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(interviewQuestions)
        .where(eq(interviewQuestions.interviewId, input.interviewId))
        .orderBy(asc(interviewQuestions.order));
    }),

  nextQuestion: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const interview = await db
        .select()
        .from(interviews)
        .where(eq(interviews.id, input.id))
        .limit(1);
      if (interview[0]) {
        const next = (interview[0].currentQuestion ?? 0) + 1;
        await db
          .update(interviews)
          .set({ currentQuestion: next })
          .where(eq(interviews.id, input.id));
      }
      return { success: true };
    }),

  complete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(interviews)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(interviews.id, input.id));
      return { success: true };
    }),
});
