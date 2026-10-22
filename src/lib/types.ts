export type RoleId = 'dev' | 'president' | 'topho' | 'tt' | 'ttmr' | 'tv' | 'ctv';

export enum RoleLevel {
	DEV = 2020,
	ToTruong = 6,
	ToPho = 5,
	TT = 4,
	TTMR = 3,
	TV = 2,
	CTV = 1
}

export const roleMap: Record<RoleId, { name: string; level: RoleLevel }> = {
	dev: { name: 'Developer', level: RoleLevel.DEV },
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
	// active first then inactive
	Number(b.active) - Number(a.active) ||
	// level 1 always at top
	Number(b.role.level === RoleLevel.ToTruong) - Number(a.role.level === RoleLevel.ToTruong) ||
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
	active: boolean;
};
