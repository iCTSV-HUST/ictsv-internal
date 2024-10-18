import type { LayoutLoad } from './$types';

import { pb } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ url, fetch }) => {
	// `pb.authStore.isValid` loosely checks the current status of your AuthStore state (aka. whether it has nonemtpy token with unexpired exp claim). It doesn't perform any server-side calls or validations.
	if (!pb.authStore.isValid) {
		redirect(302, `/login?message=${url.pathname} requires authentation`);
	}

	try {
		// `await pb.collection('users').authRefresh()` refreshes (and validates) the currently stored auth state with the server. It sends a POST /api/collections/users/auth-refresh request.
		await pb.collection(pb.authStore.model?.collectionName).authRefresh({fetch: fetch});	// Custom sveltekit fetch

	} catch (error: any) {
		pb.authStore.clear();
		redirect(302, '/login?message=Error logging in');
	}
}

export const ssr = false;