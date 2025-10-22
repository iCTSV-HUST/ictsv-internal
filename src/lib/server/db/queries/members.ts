import { roleMap, type Member, type RoleId } from '$lib/types';
import { db } from '../db';
import { membersTable } from '../schema';
import { eq } from 'drizzle-orm';

function mapMemberRole<T extends { roleId: string }>(member: T) {
	return {
		...member,
		roleId: member.roleId as RoleId,
		role: roleMap[member.roleId as RoleId]
	};
}

function mapMemberRoleDepartments<
	T extends {
		roleId: string;
		departments: {
			department: {
				name: string;
			};
		}[];
	}
>(member: T) {
	return {
		...member,
		departments: member.departments.map((md) => md.department.name),
		roleId: member.roleId as RoleId,
		role: roleMap[member.roleId as RoleId]
	};
}

export async function findMemberByUsercode(usercode: string) {
	const member = await db.query.membersTable.findFirst({
		columns: {
			createdAt: false,
			updatedAt: false,
			lastLoginAt: false
		},
		with: {
			departments: {
				columns: {}, // Exclude junction table columns
				with: {
					department: true // Get actual department data
				}
			}
		},
		where: eq(membersTable.usercode, usercode)
	});

	return member ? mapMemberRoleDepartments(member) : null;
}

export async function findMemberById(memberId: number) {
	const member = await db.query.membersTable.findFirst({
		columns: {
			createdAt: false,
			updatedAt: false,
			lastLoginAt: false
		},
		with: {
			departments: {
				columns: {}, // Exclude junction table columns
				with: {
					department: true // Get actual department data
				}
			}
		},
		where: eq(membersTable.id, memberId)
	});

	return member ? mapMemberRoleDepartments(member) : null;
}

export async function updateLastLogin(memberId: number) {
	await db
		.update(membersTable)
		.set({ lastLoginAt: new Date() })
		.where(eq(membersTable.id, memberId));
}

// export async function createMember(data: {
// 	name: string;
// 	roleId: string;
// 	usercode: string;
// 	generation: string;
// 	email: string;
// 	passwordHash: string;
// }) {
// 	const [member] = await db.insert(membersTable).values(data).returning();

// 	return mapMemberRole(member);
// }

export async function getActiveMembers(): Promise<Member[]> {
	const members = await db.query.membersTable.findMany({
		columns: {
			createdAt: false,
			updatedAt: false,
			lastLoginAt: false,
			passwordHash: false
		},
		with: {
			departments: {
				columns: {}, // Exclude junction table columns
				with: {
					department: true // Get actual department data
				}
			}
		},
		where: eq(membersTable.active, true)
	});

	return members.map(mapMemberRoleDepartments);
}
