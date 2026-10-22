import { db } from '../db';
import { eq } from 'drizzle-orm';
import { departmentsTable, memberDepartmentsTable } from '../schema';

export async function getAllDepartments() {
	return await db.select().from(departmentsTable);
}

export async function findMemberDepartmentsById(memberId: number) {
	const departments = await db
		.select()
		.from(memberDepartmentsTable)
		.where(eq(memberDepartmentsTable.memberId, memberId));
	return departments;
}
