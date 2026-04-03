CREATE TYPE "public"."FormDraftStatus" AS ENUM('ABANDONED', 'CONTACTED', 'CONVERTED', 'DISMISSED');--> statement-breakpoint
CREATE TABLE "form_drafts" (
	"id" text PRIMARY KEY NOT NULL,
	"anonymousId" text NOT NULL,
	"formType" text NOT NULL,
	"draftData" json NOT NULL,
	"email" text,
	"phone" text,
	"stepReached" text,
	"fieldsCompleted" integer,
	"totalFields" integer,
	"source" json,
	"deviceInfo" json,
	"score" integer DEFAULT 0 NOT NULL,
	"status" "FormDraftStatus" DEFAULT 'ABANDONED' NOT NULL,
	"adminNotes" text,
	"firstSeenAt" timestamp DEFAULT now() NOT NULL,
	"lastActivityAt" timestamp DEFAULT now() NOT NULL,
	"convertedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "form_events" (
	"id" text PRIMARY KEY NOT NULL,
	"anonymousId" text NOT NULL,
	"formType" text NOT NULL,
	"eventType" text NOT NULL,
	"fieldKey" text,
	"step" text,
	"metadata" json,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pee_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"civilite" text NOT NULL,
	"prenom" text NOT NULL,
	"nom" text NOT NULL,
	"categorie" text NOT NULL,
	"pays" text NOT NULL,
	"ville" text NOT NULL,
	"telephone" text NOT NULL,
	"email" text,
	"status" text DEFAULT 'NEW' NOT NULL,
	"adminNotes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "form_drafts_anonymous_form_type_unique" ON "form_drafts" USING btree ("anonymousId","formType");--> statement-breakpoint
CREATE INDEX "form_drafts_status_idx" ON "form_drafts" USING btree ("formType","status");--> statement-breakpoint
CREATE INDEX "form_drafts_email_idx" ON "form_drafts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "form_drafts_phone_idx" ON "form_drafts" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "form_drafts_score_idx" ON "form_drafts" USING btree ("score");--> statement-breakpoint
CREATE INDEX "form_events_anon_form_idx" ON "form_events" USING btree ("anonymousId","formType");--> statement-breakpoint
CREATE INDEX "form_events_event_time_idx" ON "form_events" USING btree ("eventType","createdAt");