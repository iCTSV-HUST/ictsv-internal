import { db } from "../db";
import { eq } from 'drizzle-orm';
import { memberDepartmentsTable } from "../schema";

export async function findMemberDepartmentsById(memberId: number) {
	const departments = await db
		.select()
		.from(memberDepartmentsTable)
		.where(eq(memberDepartmentsTable.memberId, memberId))
}