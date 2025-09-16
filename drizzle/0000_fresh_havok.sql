CREATE TABLE "attendance" (
	"date" date PRIMARY KEY NOT NULL,
	"checkins" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "departments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "departments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "departments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "member_departments" (
	"memberId" integer NOT NULL,
	"departmentId" integer NOT NULL,
	CONSTRAINT "member_departments_memberId_departmentId_pk" PRIMARY KEY("memberId","departmentId")
);
--> statement-breakpoint
ALTER TABLE "member_departments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "members" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "members_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"roleId" varchar(10) NOT NULL,
	"usercode" text NOT NULL,
	"generation" numeric(3, 1) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"email" text NOT NULL,
	"passwordHash" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastLoginAt" timestamp,
	CONSTRAINT "members_usercode_unique" UNIQUE("usercode"),
	CONSTRAINT "members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"memberId" integer NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"ipAddress" varchar(45),
	"userAgent" text
);
--> statement-breakpoint
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "member_departments" ADD CONSTRAINT "member_departments_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_departments" ADD CONSTRAINT "member_departments_departmentId_departments_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "crud-editor-policy-select" ON "attendance" AS PERMISSIVE FOR SELECT TO "editor" USING (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-insert" ON "attendance" AS PERMISSIVE FOR INSERT TO "editor" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-update" ON "attendance" AS PERMISSIVE FOR UPDATE TO "editor" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-delete" ON "attendance" AS PERMISSIVE FOR DELETE TO "editor" USING (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-select" ON "departments" AS PERMISSIVE FOR SELECT TO "editor" USING (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-insert" ON "departments" AS PERMISSIVE FOR INSERT TO "editor" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-update" ON "departments" AS PERMISSIVE FOR UPDATE TO "editor" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-delete" ON "departments" AS PERMISSIVE FOR DELETE TO "editor" USING (false);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-select" ON "member_departments" AS PERMISSIVE FOR SELECT TO "editor" USING (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-insert" ON "member_departments" AS PERMISSIVE FOR INSERT TO "editor" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-update" ON "member_departments" AS PERMISSIVE FOR UPDATE TO "editor" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-delete" ON "member_departments" AS PERMISSIVE FOR DELETE TO "editor" USING (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-select" ON "members" AS PERMISSIVE FOR SELECT TO "editor" USING (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-insert" ON "members" AS PERMISSIVE FOR INSERT TO "editor" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-update" ON "members" AS PERMISSIVE FOR UPDATE TO "editor" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-delete" ON "members" AS PERMISSIVE FOR DELETE TO "editor" USING (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-select" ON "sessions" AS PERMISSIVE FOR SELECT TO "editor" USING (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-insert" ON "sessions" AS PERMISSIVE FOR INSERT TO "editor" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-update" ON "sessions" AS PERMISSIVE FOR UPDATE TO "editor" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "crud-editor-policy-delete" ON "sessions" AS PERMISSIVE FOR DELETE TO "editor" USING (true);