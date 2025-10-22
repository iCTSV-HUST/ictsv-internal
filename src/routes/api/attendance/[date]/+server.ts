import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteAttendance, updateAttendance } from '$lib/server/db/queries/attendances';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { memberIds } = await request.json<{ memberIds: number[] }>();

	if (!params.date) {
		return error(400, 'Missing date');
	}

	const record = await updateAttendance(params.date, memberIds);
	return json(record);
};

export const DELETE: RequestHandler = async ({ params }) => {
	if (!params.date) {
		return error(400, 'Missing date');
	}

	await deleteAttendance(params.date);
	return json({ success: true });
};
