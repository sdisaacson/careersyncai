import { relations } from "drizzle-orm";
import {
  users,
  profiles,
  subscriptions,
  jobs,
  tailoredResumes,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
  subscriptions: many(subscriptions),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
  jobs: many(jobs),
  tailoredResumes: many(tailoredResumes),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [jobs.profileId],
    references: [profiles.id],
  }),
  tailoredResumes: many(tailoredResumes),
}));

export const tailoredResumesRelations = relations(
  tailoredResumes,
  ({ one }) => ({
    job: one(jobs, { fields: [tailoredResumes.jobId], references: [jobs.id] }),
    profile: one(profiles, {
      fields: [tailoredResumes.profileId],
      references: [profiles.id],
    }),
  })
);
