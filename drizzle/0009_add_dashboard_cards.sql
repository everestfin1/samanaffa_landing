CREATE TABLE IF NOT EXISTS "dashboard_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"dataSource" text NOT NULL,
	"color" text NOT NULL DEFAULT 'default',
	"colSpan" integer NOT NULL DEFAULT 3,
	"rowSpan" integer NOT NULL DEFAULT 1,
	"order" integer NOT NULL DEFAULT 0,
	"icon" text,
	"link" text,
	"visible" boolean NOT NULL DEFAULT true,
	"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
