// place files you want to import through the `$lib` alias in this folder.
import type { AttendancesRecord, MembersRequiredRecord, RecordIdString } from '$lib/pocketbase-types';
import { pb } from '$lib/pocketbase';

export type MembersInfo = {
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
	members: MembersInfo[];
	attendances: AttendancesRecord[];
}

export const appData = $state<MemberDataType>({
	members: [],
	attendances: [],
})


export async function refreshAppData() {
	const members = await pb.collection('members').getFullList<MembersRequiredRecord>({
		sort: '-created',
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

	const attendances = await pb.collection('attendances').getFullList<AttendancesRecord>({
		sort: '-created',
		fields: 'date,members'
	})

	appData.attendances = attendances;
}
