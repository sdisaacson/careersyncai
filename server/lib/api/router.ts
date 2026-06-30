import { authRouter } from "../../routes/auth-router.js";
import { profileRouter } from "../../routes/profile-router.js";
import { interviewRouter } from "../../routes/interview-router.js";
import { jobRouter } from "../../routes/job-router.js";
import { resumeRouter } from "../../routes/resume-router.js";
import { researchRouter } from "../../routes/research-router.js";
import { sectorRouter } from "../../routes/sector-router.js";
import { subscriptionRouter } from "../../routes/subscription-router.js";
import { settingsRouter } from "../../routes/settings-router.js";
import { adminRouter } from "../../routes/admin-router.js";
import { insightsRouter } from "../../routes/insights-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  profile: profileRouter,
  interview: interviewRouter,
  job: jobRouter,
  resume: resumeRouter,
  research: researchRouter,
  sector: sectorRouter,
  subscription: subscriptionRouter,
  settings: settingsRouter,
  admin: adminRouter,
  insights: insightsRouter,
});

export type AppRouter = typeof appRouter;
