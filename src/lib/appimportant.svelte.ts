// Global store

import type { IsoDateString, MembersRequiredRecord, RecordIdString } from '$lib/pocketbase-types';
import { pb } from '$lib/pocketbase';


export type AttendancesInfo = {
	date: IsoDateString;
	members?: RecordIdString[];

	locked: boolean;
	id: RecordIdString;
}

export type MemberInfo = {
    email?: string;
	active: boolean;
	avatar: string;
	name: string;
	usercode: string;

	department: string[];
	role: string;
	rank: number;
	generation: number;
	id: RecordIdString;
}


type MemberDataType = {
	members: MemberInfo[];
	attendances: AttendancesInfo[];
}

export const userData = $state<{
	info?: MemberInfo, 
}>({});

export const appData = $state<MemberDataType>({
	members: [],
	attendances: [],
})


export async function refreshAppData(userId: RecordIdString) {
	const members = await pb.collection('members').getFullList<MembersRequiredRecord>({
		sort: '-sort_override,-department.name,+role.rank,+generation',
		expand: 'department,role',
		fields: 'id,name,usercode,expand.department.name,expand.role.name,expand.role.rank,generation',
		filter: 'active = true',

	});

	appData.members = members.map(m => {
		return {
			active: m.active ?? false,
			avatar: m.avatar ?? "",
			name: m.name,
			usercode: m.usercode,

			department: m.expand.department.map(dept => dept.name),
			role: m.expand.role.name,
			rank: m.expand.role.rank,
			generation: m.generation,
			id: m.id,
		}
	});

	const attendances = await pb.collection('attendances').getFullList<AttendancesInfo>({
		sort: '+date',
		fields: 'id,date,members,locked'
	});

	appData.attendances = attendances;

	userData.info = appData.members.find(m => m.id === userId);

	console.info("Data loaded");
}