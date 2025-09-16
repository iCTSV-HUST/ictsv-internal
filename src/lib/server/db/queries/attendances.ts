import { db } from '../db';
import { attendanceTable } from '../schema';
import { gte } from 'drizzle-orm';

// Bulk operations
export async function bulkCheckInToday(memberIds: number[]) {
	if (memberIds.length === 0) return [];

	const today = new Date().toISOString().split('T')[0];
	const memberList = memberIds.sort();

	return await db
		.insert(attendanceTable)
		.values({
			date: today,
			checkins: memberList
		})
		.onConflictDoUpdate({
			target: attendanceTable.date,
			set: {
				checkins: memberList,
				updatedAt: new Date()
			}
		});
}

export async function getCheckinsSince(since: Date) {
	const records = await db
		.select()
		.from(attendanceTable)
		.where(gte(attendanceTable.date, since.toISOString()))
		.orderBy(attendanceTable.date);

	return records.map((r) => ({
		date: r.date,
		members: r.checkins as number[] // Drizzle returns parsed JSON
	}));
}
