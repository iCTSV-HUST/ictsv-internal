import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { login } from '$lib/server/auth/authService';

export const actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		const data = await request.formData();
		const usercode = data.get('usercode') as string;
		const password = data.get('password') as string;

		try {
			const { member } = await login(
				{
					usercode,
					password,
					ipAddress: getClientAddress(),
					userAgent: request.headers.get('user-agent') ?? undefined
				},
				cookies
			);
		} catch (e) {
			console.log(e);
			return fail(400, { failMessage: (e as Error).message });
		}

		redirect(303, '/app?message=Logged in successfully');
	}
} satisfies Actions;
