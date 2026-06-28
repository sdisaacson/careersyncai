import { authRouter } from "../../routes/auth-router";
import { profileRouter } from "../../routes/profile-router";
import { interviewRouter } from "../../routes/interview-router";
import { jobRouter } from "../../routes/job-router";
import { resumeRouter } from "../../routes/resume-router";
import { researchRouter } from "../../routes/research-router";
import { sectorRouter } from "../../routes/sector-router";
import { subscriptionRouter } from "../../routes/subscription-router";
import { settingsRouter } from "../../routes/settings-router";
import { adminRouter } from "../../routes/admin-router";
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
