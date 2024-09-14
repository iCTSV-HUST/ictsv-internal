import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = ({ locals }) => {
	locals.pb.authStore.clear();
	locals.user = null;

	throw redirect(303, '/login');
};