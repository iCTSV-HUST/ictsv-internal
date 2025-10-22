CREATE TABLE "refresh_tokens" (
	"token_id" text PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text
);
--> statement-breakpoint
DROP POLICY "crud-editor-policy-select" ON "sessions" CASCADE;--> statement-breakpoint
DROP POLICY "crud-editor-policy-insert" ON "sessions" CASCADE;--> statement-breakpoint
DROP POLICY "crud-editor-policy-update" ON "sessions" CASCADE;--> statement-breakpoint
DROP POLICY "crud-editor-policy-delete" ON "sessions" CASCADE;--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;