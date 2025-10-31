import { getActiveMembers } from '$lib/server/db/queries/members';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const activeMembers = await getActiveMembers();

	return {
		activeMembers,
	};
};
