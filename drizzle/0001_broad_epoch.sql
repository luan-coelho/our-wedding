ALTER TABLE "guest" ADD COLUMN "spouse" text;--> statement-breakpoint
ALTER TABLE "guest" ADD COLUMN "children" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "guest" ADD COLUMN "companions" json DEFAULT '[]'::json;