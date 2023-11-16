CREATE TABLE IF NOT EXISTS "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"href" text,
	"image" text,
	"title" text,
	"description" text,
	"folder" text,
	"ingredients" text[],
	"directions" text[]
);
