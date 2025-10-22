import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { lockAttendance } from '$lib/server/db/queries/attendances';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { locked } = await request.json<{ locked: boolean }>();

	if (!params.date) {
		return error(400, 'Missing date');
	}

	const record = await lockAttendance(params.date, locked);
	return json(record);
};
