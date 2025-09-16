export type RolesRecord = {
	id: string;
	name: string;
	rank: number;
};

export type MemberRecord = {
	id: number;
	name: string;
	usercode: string;
	generation: number;
	role_id: string;
	member_departments: number[];
	active: boolean;
};

type IsoDateString = string;

export type AttendanceRecord = {
	id: number;
	date: IsoDateString;
	member_ids: number[];
	locked: boolean;
};
