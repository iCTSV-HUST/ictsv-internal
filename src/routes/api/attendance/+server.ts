import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAttendance, getAttendancesSince } from '$lib/server/db/queries/attendances';

export const GET: RequestHandler = async ({ url }) => {
	const since = url.searchParams.get('since');

	if (!since) {
		return error(400, 'Missing since parameter');
	}

	const records = await getAttendancesSince(new Date(since));
	return json(records);
};

export const POST: RequestHandler = async ({ request }) => {
	const { date } = await request.json<{ date: string }>();

	if (!date) {
		return error(400, 'Missing date');
	}

	const record = await createAttendance(date);
	return json(record);
};
