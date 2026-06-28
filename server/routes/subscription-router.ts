import { z } from "zod";
import { createRouter, authedQuery } from "../lib/api/middleware.js";
import { getDb } from "../queries/api/connection.js";
import { subscriptions } from "@db/schema";
import { eq } from "drizzle-orm";
import { addMonths } from "date-fns";

const PLANS: Record<
  string,
  { name: string; priceCents: number; interval: "month" | "year" }
> = {
  starter: { name: "Starter", priceCents: 900, interval: "month" },
  pro: { name: "Pro", priceCents: 1900, interval: "month" },
  premium: { name: "Premium", priceCents: 4900, interval: "month" },
};

export const subscriptionRouter = createRouter({
  getCurrentSubscription: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);
    return rows[0] ?? null;
  }),

  createCheckoutSession: authedQuery
    .input(z.object({ planId: z.enum(["starter", "pro", "premium"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const plan = PLANS[input.planId];
      if (!plan) {
        throw new Error("Invalid plan");
      }

      // Option A: mock Stripe checkout — create an active subscription directly.
      const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      const values = {
        userId: ctx.user.id,
        status: "active" as const,
        planId: input.planId,
        planName: plan.name,
        priceCents: plan.priceCents,
        interval: plan.interval,
        currentPeriodEnd: addMonths(new Date(), 1),
        cancelAtPeriodEnd: false,
        stripeCustomerId: `cus_mock_${ctx.user.id}`,
        stripeSubscriptionId: `sub_mock_${Date.now()}`,
      };

      if (existing[0]) {
        await db
          .update(subscriptions)
          .set(values)
          .where(eq(subscriptions.id, existing[0].id));
      } else {
        await db.insert(subscriptions).values(values);
      }

      return {
        sessionId: `cs_mock_${Date.now()}`,
        url: "/account?success=true",
      };
    }),

  cancelSubscription: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const existing = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!existing[0]) {
      throw new Error("No subscription found");
    }

    await db
      .update(subscriptions)
      .set({ status: "canceled", cancelAtPeriodEnd: true })
      .where(eq(subscriptions.id, existing[0].id));

    return { success: true };
  }),

  resumeSubscription: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const existing = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!existing[0]) {
      throw new Error("No subscription found");
    }

    await db
      .update(subscriptions)
      .set({
        status: "active",
        cancelAtPeriodEnd: false,
        currentPeriodEnd: addMonths(new Date(), 1),
      })
      .where(eq(subscriptions.id, existing[0].id));

    return { success: true };
  }),
});
