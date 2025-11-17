import { type Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { verifyAccessToken } from '$lib/server/auth/jwt';
import { refreshAccessToken } from '$lib/server/auth/authService';
import { failMessageURL } from '$lib/utils';

export const handle: Handle = async ({ event, resolve }) => {
	// Try access token first
	const accessToken = event.cookies.get('access_token');

	if (accessToken) {
		const member = await verifyAccessToken(accessToken);
		if (member) {
			event.locals.currentUser = member;
			return await resolve(event);
		}
	}

	// Access token invalid, try refresh token
	const refreshedMember = await refreshAccessToken(event.cookies);
	if (refreshedMember) {
		event.locals.currentUser = refreshedMember;
		return await resolve(event);
	}

	// If not at public path and no user, block access
	const { pathname } = event.url;
	const publicPaths = ['/login', '/register', '/logout', '/'];

	if (!publicPaths.includes(pathname)) {
		if (pathname.startsWith('/api/')) {
			return new Response('Unauthorized', { status: 401 });
		}

		return Response.redirect(
			new URL(failMessageURL('/login', 'Bạn chưa đăng nhập'), event.url).href,
			303
		);
	}

	return await resolve(event);
};
