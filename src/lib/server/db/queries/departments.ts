import { db } from "../db";
import { departmentsTable, memberDepartmentsTable } from "../schema";

export async function findMemberDepartmentsById(memberId: number) {
	const departments = await db
		.select()
		.from(memberDepartmentsTable)
		.where(eq(memberDepartmentsTable.memberId, memberId))
}