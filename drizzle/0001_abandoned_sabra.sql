ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'guest';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "active" boolean DEFAULT true NOT NULL;