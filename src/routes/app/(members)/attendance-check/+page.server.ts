import { getActiveMembers } from '#lib/server/db/queries/members';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const activeMembers = await getActiveMembers();
	return {
		activeMembers
	};
};

