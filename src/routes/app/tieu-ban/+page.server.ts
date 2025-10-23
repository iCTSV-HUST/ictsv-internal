import { getActiveMembers } from '$lib/server/db/queries/members';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const activeMembers = await getActiveMembers();

    // Cache the page for 1 day (86400 seconds)
	setHeaders({
		'cache-control': 'max-age=86400, s-maxage=86400'
	});

	return {
		activeMembers,
	};
};
