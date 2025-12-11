CREATE TYPE "public"."SponsorCodeStatus" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED');--> statement-breakpoint
CREATE TABLE "ape_sponsor_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"createdBy" text NOT NULL,
	"status" "SponsorCodeStatus" DEFAULT 'ACTIVE' NOT NULL,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"maxUsage" integer,
	"expiresAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ape_sponsor_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "ape_sponsor_codes" ADD CONSTRAINT "ape_sponsor_codes_createdBy_admin_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;