import type { SelectMember } from "./db/schema";

export const roleMap: Record<string, { name: string; level: number }> = {
	dev: { name: 'Developer', level: -1 },
	president: { name: 'Tổ trưởng', level: 1 },
	topho: { name: 'Tổ phó', level: 2 },
	tt: { name: 'Tổ viên Thường trực', level: 3 },
	ttmr: { name: 'Tổ viên Thường trực mở rộng', level: 4 },
	tv: { name: 'Tổ viên', level: 5 },
	ctv: { name: 'Cộng tác viên', level: 6 }
};


export type Member = {
	id: number;
	name: string;
	roleId: string;
	usercode: string;
	generation: string;
	active: boolean;
	email: string;
}


export function memberPublicize(member: SelectMember) {
	const {
		passwordHash, 
		createdAt,
		updatedAt,
		lastLoginAt, 
		...memberPublic 
	} = member;

	return mapMemberRole({ ...memberPublic });
}

export function mapMemberRole(member: Member) {
	return {
		...member,
		role: roleMap[member.roleId]
	};
}

