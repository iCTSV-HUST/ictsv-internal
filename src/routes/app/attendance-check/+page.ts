import type { ClientResponseError } from 'pocketbase';
import type { PageLoad } from './$types';
import type { AttendancesRecord, MembersRequiredRecord } from '$lib/pocketbase-types';

import { error } from '@sveltejs/kit';

import { pb } from '$lib/pocketbase';

export const load: PageLoad = async () =>  {
	try {
		console.log("---attendance-check: ");
		const members = pb.collection('members').getFullList<MembersRequiredRecord>({
			sort: '-created',
			expand: 'department,role',
			fields: 'id,name,usercode,expand.department.name,expand.role.name,expand.role.rank,generation',
			filter: 'active = true',

		});

		const attendances = pb.collection('attendances').getFullList<AttendancesRecord>({
			sort: '-created',
			fields: 'date,members'
		})

		return {
			promises: {
				members,
				attendances,
			}
		};
	} catch (e) {
		const err = e as ClientResponseError;
		error(404, err.message);
	}
}

// export const actions: Actions  = {
// 	test: async ({ request, locals: { pb } }) => {
// 		const data = {
// 		    "date": "2022-01-01 10:00:00.123Z",
// 		    "members": [
// 		        "RELATION_RECORD_ID"
// 		    ]
// 		};

// 		const record = await pb.collection('attendances').create(data);
// 	},
// };
