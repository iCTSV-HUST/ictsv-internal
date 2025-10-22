import { findMemberById, getActiveMembers } from '$lib/server/db/queries/members';
import dayjs from 'dayjs';
import type { PageServerLoad } from './$types';
import { getAttendancesSince } from '$lib/server/db/queries/attendances';

export const load: PageServerLoad = async ({ setHeaders }) => {
    const threeWeeksAgo = dayjs().subtract(3, 'week').toDate();
    
	const activeMembers = await getActiveMembers();
    const threeWeekAttendances = await getAttendancesSince(threeWeeksAgo);
    
    // Cache the page for 1 day (86400 seconds)
	setHeaders({
		'cache-control': 'max-age=86400, s-maxage=86400'
	});

	return {
		activeMembers,
        attendances: threeWeekAttendances
	};
};
