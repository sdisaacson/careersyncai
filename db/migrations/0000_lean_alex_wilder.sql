CREATE TYPE "public"."interview_status" AS ENUM('in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('discovered', 'shortlisted', 'applied', 'archived');--> statement-breakpoint
CREATE TYPE "public"."profile_status" AS ENUM('uploaded', 'interviewing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."research_session_status" AS ENUM('running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."subscription_interval" AS ENUM('month', 'year');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'canceled', 'past_due', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "appSettings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "appSettings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "interviewQuestions" (
	"id" serial PRIMARY KEY NOT NULL,
	"interviewId" integer NOT NULL,
	"question" text NOT NULL,
	"answer" text,
	"category" varchar(100),
	"order" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"status" "interview_status" DEFAULT 'in_progress',
	"currentQuestion" integer DEFAULT 0,
	"totalQuestions" integer DEFAULT 8,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"sectorId" integer,
	"title" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"location" varchar(255),
	"jobDescription" text,
	"requirements" text,
	"responsibilities" text,
	"salaryRange" varchar(255),
	"jobType" varchar(50),
	"experienceLevel" varchar(50),
	"applicationLink" text,
	"deadline" varchar(100),
	"postedDate" varchar(100),
	"source" varchar(255),
	"fitScore" integer DEFAULT 0,
	"matchReasons" text,
	"skillGaps" text,
	"status" "job_status" DEFAULT 'discovered',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"fullName" varchar(255),
	"email" varchar(320),
	"phone" varchar(50),
	"location" varchar(255),
	"targetLocation" varchar(255),
	"summary" text,
	"skills" text,
	"education" text,
	"experience" text,
	"researchFocus" text,
	"internships" text,
	"certifications" text,
	"preferredRoles" text,
	"preferredIndustries" text,
	"salaryExpectation" varchar(100),
	"workType" varchar(50),
	"resumeText" text,
	"resumeUrl" text,
	"status" "profile_status" DEFAULT 'uploaded',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "researchSessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"status" "research_session_status" DEFAULT 'running',
	"totalSectors" integer DEFAULT 0,
	"completedSectors" integer DEFAULT 0,
	"totalJobsFound" integer DEFAULT 0,
	"log" text,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "sectors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"priority" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"status" "subscription_status" DEFAULT 'inactive',
	"planId" varchar(100),
	"planName" varchar(255),
	"priceCents" integer,
	"interval" "subscription_interval",
	"currentPeriodEnd" timestamp,
	"cancelAtPeriodEnd" boolean DEFAULT false,
	"stripeCustomerId" varchar(255),
	"stripeSubscriptionId" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "tailoredResumes" (
	"id" serial PRIMARY KEY NOT NULL,
	"jobId" integer NOT NULL,
	"profileId" integer NOT NULL,
	"content" text NOT NULL,
	"pdfUrl" text,
	"highlights" text,
	"changesMade" text,
	"narrativeSummary" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"unionId" varchar(255) NOT NULL,
	"name" varchar(255),
	"email" varchar(320),
	"avatar" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignInAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_unionId_unique" UNIQUE("unionId")
);
