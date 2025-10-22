import { db } from '../db';
import { attendanceTable } from '../schema';
import { eq, gte } from 'drizzle-orm';

const mapAttendance = (r: {
	date: string;
	memberIds: any;
	locked: boolean;
}) => ({
	date: r.date,
	memberIds: (r.memberIds as number[]) || [],
	locked: r.locked
})

export async function getAttendancesSince(since: Date) {
	const checkingDate = since.toISOString().split('T')[0];

	const records = await db
		.select()
		.from(attendanceTable)
		.where(gte(attendanceTable.date, checkingDate))
		.orderBy(attendanceTable.date);

	return records.map(mapAttendance);
}

export async function createAttendance(date: string) {
	const [record] = await db
		.insert(attendanceTable)
		.values({ date, memberIds: [] })
		.returning();

	return mapAttendance(record);
}

export async function updateAttendance(date: string, memberIds: number[]) {
	const [record] = await db
		.update(attendanceTable)
		.set({ memberIds, updatedAt: new Date() })
		.where(eq(attendanceTable.date, date))
		.returning();

	return {
		date: record.date,
		memberIds: (record.memberIds as number[]) || [],
		locked: record.locked
	};
}

export async function deleteAttendance(date: string) {
	await db.delete(attendanceTable).where(eq(attendanceTable.date, date));
}

export async function lockAttendance(date: string, locked: boolean) {
	const [record] = await db
		.update(attendanceTable)
		.set({ locked, updatedAt: new Date() })
		.where(eq(attendanceTable.date, date))
		.returning();

	return mapAttendance(record);
}