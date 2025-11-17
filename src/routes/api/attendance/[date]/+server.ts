import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getAttendance,
	deleteAttendance,
	updateAttendance
} from '$lib/server/db/queries/attendances';

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

	const currentAttendance = await getAttendance(params.date);
	if (currentAttendance.locked) {
		return error(400, 'Cannot delete locked attendance');
	}

	await deleteAttendance(params.date);
	return json({ success: true });
};
