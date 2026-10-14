import { roleMap, type Member, type RoleId } from '$lib/types';
import { db } from '../db';
import { memberDepartmentsTable, membersTable } from '../schema';
import { eq, inArray, or } from 'drizzle-orm';
import { hashPassword } from '$lib/server/auth/password';
import { getAllDepartments } from './departments';

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

export type NewMemberInput = {
	name: string;
	usercode: string;
	generation: string;
	email: string;
	roleId: RoleId;
	departments: string[];
};

export async function createMembersBatch(membersInput: NewMemberInput[]): Promise<Member[]> {
	if (membersInput.length === 0) return [];

	const usercodes = membersInput.map((m) => m.usercode);
	const emails = membersInput.map((m) => m.email);

	// Check if any usercode or email already exists in DB
	const existing = await db.query.membersTable.findMany({
		where: or(inArray(membersTable.usercode, usercodes), inArray(membersTable.email, emails)),
		columns: { usercode: true, email: true }
	});

	if (existing.length > 0) {
		const existingUsercodes = existing
			.map((e) => e.usercode)
			.filter((u) => usercodes.includes(u));
		if (existingUsercodes.length > 0) {
			throw new Error(`MSSV đã tồn tại trong hệ thống: ${existingUsercodes.join(', ')}`);
		}
		const existingEmails = existing.map((e) => e.email).filter((em) => emails.includes(em));
		if (existingEmails.length > 0) {
			throw new Error(`Email đã tồn tại trong hệ thống: ${existingEmails.join(', ')}`);
		}
	}

	const allDepts = await getAllDepartments();
	const deptMap = new Map<string, number>();
	for (const dept of allDepts) {
		deptMap.set(dept.name, dept.id);
	}

	const createdMembers: Member[] = [];

	for (const input of membersInput) {
		const passwordHash = await hashPassword(input.usercode);

		const [insertedMember] = await db
			.insert(membersTable)
			.values({
				name: input.name,
				usercode: input.usercode,
				generation: input.generation,
				email: input.email,
				roleId: input.roleId,
				active: true,
				passwordHash
			})
			.returning();

		const deptRows = [];
		for (const deptName of input.departments) {
			const deptId = deptMap.get(deptName);
			if (deptId) {
				deptRows.push({
					memberId: insertedMember.id,
					departmentId: deptId
				});
			}
		}

		if (deptRows.length > 0) {
			await db.insert(memberDepartmentsTable).values(deptRows);
		}

		createdMembers.push({
			id: insertedMember.id,
			name: insertedMember.name,
			usercode: insertedMember.usercode,
			generation: insertedMember.generation,
			active: insertedMember.active,
			email: insertedMember.email,
			roleId: insertedMember.roleId as RoleId,
			role: roleMap[insertedMember.roleId as RoleId],
			departments: input.departments
		});
	}

	return createdMembers;
}


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

export async function getAllMembers(): Promise<Member[]> {
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
		}
	});

	return members.map(mapMemberRoleDepartments);
}

export async function updateMember(memberId: number, roleid: RoleId, active: boolean) {
	await db
		.update(membersTable)
		.set({ roleId: roleid, active })
		.where(eq(membersTable.id, memberId));
}
