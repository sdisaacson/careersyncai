import { authRouter } from "./auth-router";
import { profileRouter } from "./profile-router";
import { interviewRouter } from "./interview-router";
import { jobRouter } from "./job-router";
import { resumeRouter } from "./resume-router";
import { researchRouter } from "./research-router";
import { sectorRouter } from "./sector-router";
import { subscriptionRouter } from "./subscription-router";
import { settingsRouter } from "./settings-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

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
});

export type AppRouter = typeof appRouter;
