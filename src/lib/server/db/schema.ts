import { crudPolicy } from 'drizzle-orm/neon';
import {
	integer,
	pgTable,
	serial,
	text,
	varchar,
	numeric,
	timestamp,
	boolean,
	date,
	primaryKey,
	jsonb,
	pgRole
} from 'drizzle-orm/pg-core';

export const editor = pgRole('editor').existing();

export const membersTable = pgTable(
	'members',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		name: text().notNull(),
		roleId: varchar({ length: 10 }).notNull(),
		usercode: text().notNull().unique(), // Can be used to login
		generation: numeric({ precision: 3, scale: 1 }).notNull(),
		active: boolean().notNull().default(true),

		email: text().notNull().unique(),

		// Authentication
		passwordHash: text().notNull(),

		// Timestamps
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp()
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
		lastLoginAt: timestamp()
	},
	(t) => [
		// Restrict editor to read-only for this table
		crudPolicy({ role: editor, read: true, modify: true })
	]
);

export const sessionsTable = pgTable(
	'sessions',
	{
		id: text().primaryKey(),
		memberId: integer()
			.notNull()
			.references(() => membersTable.id, { onDelete: 'cascade' }),
		expiresAt: timestamp().notNull(),
		createdAt: timestamp().notNull().defaultNow(),
		ipAddress: varchar({ length: 45 }), // For security log
		userAgent: text() // For tracking devices
	},
	(t) => [
		// Restrict editor to read-only for this table
		crudPolicy({ role: editor, read: true, modify: true })
	]
);

export const departmentsTable = pgTable(
	'departments',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		name: varchar({ length: 50 }).notNull()
	},
	(t) => [
		// Restrict editor to read-only for this table
		crudPolicy({ role: editor, read: true, modify: false })
	]
);

export const memberDepartmentsTable = pgTable(
	'member_departments',
	{
		memberId: integer()
			.notNull()
			.references(() => membersTable.id, { onDelete: 'cascade' }),
		departmentId: integer()
			.notNull()
			.references(() => departmentsTable.id, { onDelete: 'cascade' })
	},
	(table) => [
		primaryKey({ columns: [table.memberId, table.departmentId] }),
		crudPolicy({ role: editor, read: true, modify: true })
	]
);

export type InsertMember = typeof membersTable.$inferInsert;
export type SelectMember = typeof membersTable.$inferSelect;

export type InsertSession = typeof sessionsTable.$inferInsert;
export type SelectSession = typeof sessionsTable.$inferSelect;

export const attendanceTable = pgTable(
	'attendance',
	{
		date: date('date').notNull().primaryKey(),

		// Store array of member IDs that checked in on this date
		checkins: jsonb('checkins').notNull().default([]),

		createdAt: timestamp('created_at').notNull().defaultNow(),

		updatedAt: timestamp('updated_at').notNull().defaultNow()
	},
	(t) => [
		// Restrict editor to read-only for this table
		crudPolicy({ role: editor, read: true, modify: true })
	]
);

export type InsertAttendance = typeof attendanceTable.$inferInsert;
export type SelectAttendance = typeof attendanceTable.$inferSelect;
