import { mapMemberRole } from '$lib/server/types';
import { db } from '../db';
import { membersTable } from '../schema';
import { eq, getTableColumns } from 'drizzle-orm';

const {
	passwordHash, 
	createdAt,
	updatedAt,
	lastLoginAt, 
	...rest
} = getTableColumns(membersTable);

const publicCols = { ...rest }

export async function findMemberByUsercode(usercode: string) {
	const [member] = await db
		.select()
		.from(membersTable)
		.where(eq(membersTable.usercode, usercode))
		.limit(1);
	return member;
}


// export async function findMemberByEmail(email: string) {
// 	const [member] = await db
// 		.select(publicCols)
// 		.from(membersTable)
// 		.where(eq(membersTable.email, email))
// 		.limit(1);
// 	return member;
// }

// export async function findMemberById(id: number) {
// 	const [member] = await db
// 		.select(publicCols)
// 		.from(membersTable)
// 		.where(eq(membersTable.id, id))
// 		.limit(1);
// 	return member;
// }




export async function updateLastLogin(memberId: number) {
	await db
		.update(membersTable)
		.set({ lastLoginAt: new Date() })
		.where(eq(membersTable.id, memberId));
}

export async function createMember(data: {
	name: string;
	roleId: string;
	usercode: string;
	generation: string;
	email: string;
	passwordHash: string;
}) {
	const [member] = await db.insert(membersTable).values(data).returning();
	return mapMemberRole(member);
}

export async function getMembers() {
	const members = await db.select(publicCols).from(membersTable).where(eq(membersTable.active, true));
	return members.map(mapMemberRole);
}
