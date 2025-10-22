import { relations } from 'drizzle-orm';
import { crudPolicy } from 'drizzle-orm/neon';
import {
	integer,
	pgTable,
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
	(t) => [crudPolicy({ role: editor, read: true, modify: true })]
);

export const refreshTokensTable = pgTable(
	'refresh_tokens',
	{
		tokenId: text().primaryKey(),
		memberId: integer()
			.notNull()
			.references(() => membersTable.id, { onDelete: 'cascade' }),
		expiresAt: timestamp().notNull(), // expiry datetime
		createdAt: timestamp().notNull().defaultNow(),
		ipAddress: text(),
		userAgent: text()
	},
	(t) => [crudPolicy({ role: editor, read: true, modify: true })]
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

export const attendanceTable = pgTable(
	'attendance',
	{
		date: date().notNull().primaryKey(),

		// Store array of member IDs that checked in on this date
		memberIds: jsonb().notNull().default([]),
		locked: boolean().notNull().default(false),
		updatedAt: timestamp('updated_at').notNull().defaultNow()
	},
	(t) => [crudPolicy({ role: editor, read: true, modify: true })]
);

export type InsertAttendance = typeof attendanceTable.$inferInsert;
export type SelectAttendance = typeof attendanceTable.$inferSelect;

// Relationship stuffs for querying

// Members-departments relations
export const membersRelations = relations(membersTable, ({ many }) => ({
	departments: many(memberDepartmentsTable)
}));

export const departmentsRelations = relations(departmentsTable, ({ many }) => ({
	members: many(memberDepartmentsTable)
}));

export const memberDepartmentsRelations = relations(memberDepartmentsTable, ({ one }) => ({
	member: one(membersTable, {
		fields: [memberDepartmentsTable.memberId],
		references: [membersTable.id]
	}),
	department: one(departmentsTable, {
		fields: [memberDepartmentsTable.departmentId],
		references: [departmentsTable.id]
	})
}));

// Members-refreshtoken relations

export const refreshTokenMembersRelations = relations(refreshTokensTable, ({ one }) => ({
	members: one(membersTable, {
		fields: [refreshTokensTable.memberId],
		references: [membersTable.id]
	})
}));
