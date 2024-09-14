import type { ClientResponseError } from 'pocketbase';
import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';


export const load: PageServerLoad = async ({ locals: { pb } }) =>  {
	try {
		console.log("---attendance-check: ");
		const members = pb.collection('members').getFullList({
			sort: '-created',
		});

		const attendances = pb.collection('attendances').getFullList({
			sort: '-created',
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