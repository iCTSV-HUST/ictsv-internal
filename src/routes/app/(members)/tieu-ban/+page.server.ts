import { getAllMembers } from '$lib/server/db/queries/members';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allMembers = await getAllMembers();
	return {
		allMembers
	};
};
