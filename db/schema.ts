import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const profileStatusEnum = pgEnum("profile_status", [
  "uploaded",
  "interviewing",
  "completed",
]);
export const interviewStatusEnum = pgEnum("interview_status", [
  "in_progress",
  "completed",
]);
export const jobStatusEnum = pgEnum("job_status", [
  "discovered",
  "shortlisted",
  "applied",
  "archived",
]);
export const researchSessionStatusEnum = pgEnum("research_session_status", [
  "running",
  "completed",
  "failed",
]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "inactive",
]);
export const subscriptionIntervalEnum = pgEnum("subscription_interval", [
  "month",
  "year",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  avatar: text("avatar"),
  passwordHash: varchar("passwordHash", { length: 255 }),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  emailVerificationToken: varchar("emailVerificationToken", { length: 255 }),
  emailVerificationTokenExpires: timestamp("emailVerificationTokenExpires", {
    withTimezone: true,
  }),
  passwordResetToken: varchar("passwordResetToken", { length: 255 }),
  passwordResetExpires: timestamp("passwordResetExpires", { withTimezone: true }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
  sessionVersion: integer("sessionVersion").default(0).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Candidate Profile (extracted from resume + interview) ────────────────
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  fullName: varchar("fullName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  targetLocation: varchar("targetLocation", { length: 255 }),
  summary: text("summary"),
  skills: text("skills"),
  education: text("education"),
  experience: text("experience"),
  researchFocus: text("researchFocus"),
  internships: text("internships"),
  certifications: text("certifications"),
  preferredRoles: text("preferredRoles"),
  preferredIndustries: text("preferredIndustries"),
  salaryExpectation: varchar("salaryExpectation", { length: 100 }),
  workType: varchar("workType", { length: 50 }),
  resumeText: text("resumeText"),
  resumeUrl: text("resumeUrl"),
  status: profileStatusEnum("status").default("uploaded"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

// ─── Interview Session ─────────────────────────────────────────────────────
export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  profileId: integer("profileId").notNull(),
  status: interviewStatusEnum("status").default("in_progress"),
  currentQuestion: integer("currentQuestion").default(0),
  totalQuestions: integer("totalQuestions").default(8),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Interview = typeof interviews.$inferSelect;
export type InsertInterview = typeof interviews.$inferInsert;

// ─── Interview Q&A ─────────────────────────────────────────────────────────
export const interviewQuestions = pgTable("interviewQuestions", {
  id: serial("id").primaryKey(),
  interviewId: integer("interviewId").notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  category: varchar("category", { length: 100 }),
  order: integer("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type InsertInterviewQuestion = typeof interviewQuestions.$inferInsert;

// ─── Economic Sectors ──────────────────────────────────────────────────────
export const sectors = pgTable("sectors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  priority: integer("priority").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Sector = typeof sectors.$inferSelect;
export type InsertSector = typeof sectors.$inferInsert;

// ─── Job Opportunities ─────────────────────────────────────────────────────
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  profileId: integer("profileId").notNull(),
  sectorId: integer("sectorId"),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  jobDescription: text("jobDescription"),
  requirements: text("requirements"),
  responsibilities: text("responsibilities"),
  salaryRange: varchar("salaryRange", { length: 255 }),
  jobType: varchar("jobType", { length: 50 }),
  experienceLevel: varchar("experienceLevel", { length: 50 }),
  applicationLink: text("applicationLink"),
  deadline: varchar("deadline", { length: 100 }),
  postedDate: varchar("postedDate", { length: 100 }),
  source: varchar("source", { length: 255 }),
  fitScore: integer("fitScore").default(0),
  matchReasons: text("matchReasons"),
  skillGaps: text("skillGaps"),
  status: jobStatusEnum("status").default("discovered"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

// ─── Tailored Resumes ──────────────────────────────────────────────────────
export const tailoredResumes = pgTable("tailoredResumes", {
  id: serial("id").primaryKey(),
  jobId: integer("jobId").notNull(),
  profileId: integer("profileId").notNull(),
  content: text("content").notNull(),
  pdfUrl: text("pdfUrl"),
  highlights: text("highlights"),
  changesMade: text("changesMade"),
  narrativeSummary: text("narrativeSummary"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TailoredResume = typeof tailoredResumes.$inferSelect;
export type InsertTailoredResume = typeof tailoredResumes.$inferInsert;

// ─── Research Sessions ─────────────────────────────────────────────────────
export const researchSessions = pgTable("researchSessions", {
  id: serial("id").primaryKey(),
  profileId: integer("profileId").notNull(),
  status: researchSessionStatusEnum("status").default("running"),
  totalSectors: integer("totalSectors").default(0),
  completedSectors: integer("completedSectors").default(0),
  totalJobsFound: integer("totalJobsFound").default(0),
  log: text("log"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

// ─── Subscriptions ─────────────────────────────────────────────────────────
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique(),
  status: subscriptionStatusEnum("status").default("inactive"),
  planId: varchar("planId", { length: 100 }),
  planName: varchar("planName", { length: 255 }),
  priceCents: integer("priceCents"),
  interval: subscriptionIntervalEnum("interval"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// ─── App Settings ──────────────────────────────────────────────────────────
export const appSettings = pgTable("appSettings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type AppSetting = typeof appSettings.$inferSelect;
export type InsertAppSetting = typeof appSettings.$inferInsert;
