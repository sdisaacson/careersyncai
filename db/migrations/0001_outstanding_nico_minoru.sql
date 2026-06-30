CREATE TYPE "public"."insight_severity" AS ENUM('opportunity', 'warning', 'info');--> statement-breakpoint
CREATE TABLE "jobInsights" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"profileId" integer NOT NULL,
	"insightType" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"data" jsonb,
	"severity" "insight_severity" DEFAULT 'info' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
