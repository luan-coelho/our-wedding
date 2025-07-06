ALTER TABLE "guest" ADD COLUMN "spouse_confirmation" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "guest" ADD COLUMN "children_confirmations" json DEFAULT '{}'::json;--> statement-breakpoint
ALTER TABLE "guest" ADD COLUMN "companions_confirmations" json DEFAULT '{}'::json;