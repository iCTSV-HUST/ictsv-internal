import { type Handle } from '@sveltejs/kit';
import { verifyAccessToken } from "$lib/server/auth/jwt";
import { refreshAccessToken } from '$lib/server/auth/authService';

export const handle: Handle = async ({ event, resolve }) => {
	// Try access token first
	const accessToken = event.cookies.get('access_token');

	if (accessToken) {
		const member = await verifyAccessToken(accessToken);
		if (member) {
			event.locals.currentUser = member;
			return resolve(event);
		}
	}

	// Access token invalid, try refresh token
    const refreshedMember = await refreshAccessToken(event.cookies);
    if (refreshedMember) {
        event.locals.currentUser = refreshedMember;
    }
	return resolve(event);
};