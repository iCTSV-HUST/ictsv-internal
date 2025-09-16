import { goto } from '$app/navigation';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { login } from '$lib/server/auth/authService';

export const actions = {
	default: async ({ request }) => {
		// TODO log the user in
		const data = await request.formData();
		const usercode = data.get('usercode') as string;
		const password = data.get('password') as string;

		try {
			const result = await login({
				usercode,
				password
			});

			console.log(result);
		} catch (e) {
			console.log(e);
			return fail(400, { failMessage: (e as Error).message });
		}

		goto('/app?message=Logged in successfully');
	}
} satisfies Actions;
