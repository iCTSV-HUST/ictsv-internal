import PocketBase from 'pocketbase';
import { PB_URL } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const authentication: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PB_URL);

	// load the store data from the request cookie string
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)

		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection(event.locals.pb.authStore.model?.collectionName).authRefresh();
			event.locals.user = structuredClone(event.locals.pb.authStore.model);
		}
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

	return response;
}

const unprotectedPrefix = ['/login', '/home', '/shcd', '/wheelofortune' ];
export const authorization: Handle = async ({ event, resolve }) => {

	// Protect any routes that need authentication
	// Exception: login, register, homepage
	if (!unprotectedPrefix.some((path) => event.url.pathname.startsWith(path))) { // && event.url.pathname !== '/'
		const loggedIn = await event.locals.pb.authStore.model;

		if (!loggedIn) {
			console.log("NOT LOGGED IN!");
			redirect(303, '/login');
		}
	}

	// If the request is still here, just proceed as normally
	const response = await resolve(event);
	return response;
};

export const handle = sequence(authentication, authorization);