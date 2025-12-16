import { findMemberById } from '$lib/server/db/queries/members';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const currentMember = locals.currentUser ? await findMemberById(locals.currentUser.id) : null;
	return {
		currentUserCode: currentMember?.usercode
	};
};
