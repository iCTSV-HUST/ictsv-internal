ALTER TABLE "refresh_tokens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "crud-editor-policy-select" ON "refresh_tokens" AS PERMISSIVE FOR SELECT TO "editor" USING (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-insert" ON "refresh_tokens" AS PERMISSIVE FOR INSERT TO "editor" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-update" ON "refresh_tokens" AS PERMISSIVE FOR UPDATE TO "editor" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-delete" ON "refresh_tokens" AS PERMISSIVE FOR DELETE TO "editor" USING (true);