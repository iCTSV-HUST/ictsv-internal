ALTER TABLE "attendance" RENAME COLUMN "checkins" TO "member_ids";--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "locked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" DROP COLUMN "created_at";