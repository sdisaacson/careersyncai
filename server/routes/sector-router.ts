import { z } from "zod";
import { createRouter, publicQuery } from "../lib/api/middleware.js";
import { getDb } from "../queries/api/connection.js";
import { sectors } from "@db/schema";
import { eq, asc } from "drizzle-orm";

export const sectorRouter = createRouter({
  seed: publicQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select().from(sectors);
    if (existing.length > 0)
      return { message: "Already seeded", count: existing.length };

    const defaultSectors = [
      {
        name: "Technology",
        description:
          "Software engineering, data science, AI/ML, cybersecurity, cloud computing, and IT infrastructure",
        icon: "cpu",
        priority: 1,
      },
      {
        name: "Healthcare",
        description:
          "Medical research, clinical roles, biotech, pharmaceuticals, and healthcare IT",
        icon: "heart-pulse",
        priority: 2,
      },
      {
        name: "Finance",
        description:
          "Banking, investment, fintech, insurance, accounting, and financial analysis",
        icon: "landmark",
        priority: 3,
      },
      {
        name: "Energy",
        description:
          "Renewable energy, oil & gas, sustainability, power systems, and environmental engineering",
        icon: "zap",
        priority: 4,
      },
      {
        name: "Education",
        description:
          "Teaching, academic research, EdTech, curriculum development, and educational administration",
        icon: "graduation-cap",
        priority: 5,
      },
      {
        name: "Manufacturing",
        description:
          "Industrial engineering, supply chain, quality assurance, robotics, and production management",
        icon: "factory",
        priority: 6,
      },
      {
        name: "Consulting",
        description:
          "Management consulting, strategy, business analysis, and professional services",
        icon: "briefcase",
        priority: 7,
      },
      {
        name: "Government",
        description:
          "Public policy, government agencies, defense, regulatory affairs, and public administration",
        icon: "shield",
        priority: 8,
      },
    ];

    await db.insert(sectors).values(defaultSectors);
    return { message: "Seeded", count: defaultSectors.length };
  }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(sectors).orderBy(asc(sectors.priority));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(sectors)
        .where(eq(sectors.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),
});
