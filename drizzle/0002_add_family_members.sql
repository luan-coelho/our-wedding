-- Add family member fields to guest table
ALTER TABLE "guest" ADD COLUMN "spouse" text;
ALTER TABLE "guest" ADD COLUMN "children" json DEFAULT '[]';
ALTER TABLE "guest" ADD COLUMN "companions" json DEFAULT '[]';
