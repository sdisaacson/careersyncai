import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  tinyint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Candidate Profile (extracted from resume + interview) ────────────────
export const profiles = mysqlTable("profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
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
  status: mysqlEnum("status", ["uploaded", "interviewing", "completed"]).default("uploaded"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

// ─── Interview Session ─────────────────────────────────────────────────────
export const interviews = mysqlTable("interviews", {
  id: serial("id").primaryKey(),
  profileId: bigint("profileId", { mode: "number", unsigned: true }).notNull(),
  status: mysqlEnum("status", ["in_progress", "completed"]).default("in_progress"),
  currentQuestion: int("currentQuestion").default(0),
  totalQuestions: int("totalQuestions").default(8),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Interview = typeof interviews.$inferSelect;
export type InsertInterview = typeof interviews.$inferInsert;

// ─── Interview Q&A ─────────────────────────────────────────────────────────
export const interviewQuestions = mysqlTable("interviewQuestions", {
  id: serial("id").primaryKey(),
  interviewId: bigint("interviewId", { mode: "number", unsigned: true }).notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  category: varchar("category", { length: 100 }),
  order: int("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type InsertInterviewQuestion = typeof interviewQuestions.$inferInsert;

// ─── Economic Sectors ──────────────────────────────────────────────────────
export const sectors = mysqlTable("sectors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  priority: int("priority").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Sector = typeof sectors.$inferSelect;
export type InsertSector = typeof sectors.$inferInsert;

// ─── Job Opportunities ─────────────────────────────────────────────────────
export const jobs = mysqlTable("jobs", {
  id: serial("id").primaryKey(),
  profileId: bigint("profileId", { mode: "number", unsigned: true }).notNull(),
  sectorId: bigint("sectorId", { mode: "number", unsigned: true }),
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
  fitScore: int("fitScore").default(0),
  matchReasons: text("matchReasons"),
  skillGaps: text("skillGaps"),
  status: mysqlEnum("status", ["discovered", "shortlisted", "applied", "archived"]).default("discovered"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

// ─── Tailored Resumes ──────────────────────────────────────────────────────
export const tailoredResumes = mysqlTable("tailoredResumes", {
  id: serial("id").primaryKey(),
  jobId: bigint("jobId", { mode: "number", unsigned: true }).notNull(),
  profileId: bigint("profileId", { mode: "number", unsigned: true }).notNull(),
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
export const researchSessions = mysqlTable("researchSessions", {
  id: serial("id").primaryKey(),
  profileId: bigint("profileId", { mode: "number", unsigned: true }).notNull(),
  status: mysqlEnum("status", ["running", "completed", "failed"]).default("running"),
  totalSectors: int("totalSectors").default(0),
  completedSectors: int("completedSectors").default(0),
  totalJobsFound: int("totalJobsFound").default(0),
  log: text("log"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

// ─── Subscriptions ─────────────────────────────────────────────────────────
export const subscriptions = mysqlTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().unique(),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "inactive"]).default("inactive"),
  planId: varchar("planId", { length: 100 }),
  planName: varchar("planName", { length: 255 }),
  priceCents: int("priceCents"),
  interval: mysqlEnum("interval", ["month", "year"]),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: tinyint("cancelAtPeriodEnd").default(0),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// ─── App Settings ──────────────────────────────────────────────────────────
export const appSettings = mysqlTable("appSettings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type AppSetting = typeof appSettings.$inferSelect;
export type InsertAppSetting = typeof appSettings.$inferInsert;
