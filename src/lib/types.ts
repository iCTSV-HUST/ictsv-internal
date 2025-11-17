export type RoleId = 'dev' | 'president' | 'topho' | 'tt' | 'ttmr' | 'tv' | 'ctv';

export enum RoleLevel {
	ToTruong = 1,
	ToPho = 2,
	TT = 3,
	TTMR = 4,
	TV = 5,
	CTV = 6
}

export const roleMap: Record<RoleId, { name: string; level: number }> = {
	dev: { name: 'Developer', level: -1 },
	president: { name: 'Tổ trưởng', level: RoleLevel.ToTruong },
	topho: { name: 'Tổ phó', level: RoleLevel.ToPho },
	tt: { name: 'Tổ viên Thường trực', level: RoleLevel.TT },
	ttmr: { name: 'Tổ viên Thường trực mở rộng', level: RoleLevel.TTMR },
	tv: { name: 'Tổ viên', level: RoleLevel.TV },
	ctv: { name: 'Cộng tác viên', level: RoleLevel.CTV }
};

export type Member = {
	id: number;
	name: string;
	roleId: RoleId;
	usercode: string;
	generation: string;
	active: boolean;
	email: string;
	role: {
		name: string;
		level: number;
	};
	departments: string[];
};

export const memberSort = (a: Member, b: Member) =>
	// level 1 always at top
	Number(b.role.level === 1) - Number(a.role.level === 1) ||
	// sort by depts
	(a.departments?.[0] ?? '').localeCompare(b.departments?.[0] ?? '') ||
	// sort by level in each depts
	a.role.level - b.role.level ||
	// sort by generation
	Number(a.generation) - Number(b.generation);

export type PermissionCheckMember = {
	id: number;
	roleId: RoleId;
	departments: string[];
};
