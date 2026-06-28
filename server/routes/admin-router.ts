import { z } from "zod";
import { createRouter, adminQuery } from "../lib/api/middleware";
import { getDb } from "../queries/api/connection";
import { users, subscriptions } from "@db/schema";
import { eq, desc, count } from "drizzle-orm";

export const adminRouter = createRouter({
  dashboard: adminQuery.query(async () => {
    const db = getDb();
    const [userCount] = await db.select({ count: count() }).from(users);
    const [activeSubCount] = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, "active"));
    const [canceledSubCount] = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, "canceled"));

    return {
      totalUsers: Number(userCount?.count ?? 0),
      activeSubscriptions: Number(activeSubCount?.count ?? 0),
      canceledSubscriptions: Number(canceledSubCount?.count ?? 0),
    };
  }),

  users: createRouter({
    list: adminQuery.query(async () => {
      const db = getDb();
      return db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
          lastSignInAt: users.lastSignInAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt));
    }),

    updateRole: adminQuery
      .input(z.object({ id: z.number(), role: z.enum(["user", "admin"]) }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db
          .update(users)
          .set({ role: input.role })
          .where(eq(users.id, input.id));
        return { success: true };
      }),
  }),

  subscriptions: createRouter({
    list: adminQuery.query(async () => {
      const db = getDb();
      return db
        .select({
          id: subscriptions.id,
          userId: subscriptions.userId,
          status: subscriptions.status,
          planName: subscriptions.planName,
          priceCents: subscriptions.priceCents,
          interval: subscriptions.interval,
          currentPeriodEnd: subscriptions.currentPeriodEnd,
          cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
          createdAt: subscriptions.createdAt,
        })
        .from(subscriptions)
        .orderBy(desc(subscriptions.createdAt));
    }),
  }),
});
