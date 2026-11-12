import { updateMember } from '#lib/server/db/queries/members';
import type { RoleId } from '#lib/types';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { memberId, roleId, active, departments } = await request.json<{
		memberId: number;
		roleId: RoleId;
		active: boolean;
		departments?: string[];
	}>();

	if (!memberId || !roleId) {
		return error(400, 'Missing memberId or roleId');
	}

	const record = await updateMember(memberId, roleId, active, departments);
	return json(record);
};
