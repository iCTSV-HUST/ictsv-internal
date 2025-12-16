import { hashPassword } from '$lib/server/auth/password';
import Papa from 'papaparse';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		// TODO log the user in
		const data = await request.formData();
		const file = data.get('file') as File | null;

		if (!file) {
			return fail(400, { message: 'No file' });
		}

		const csvText = await file.text();

		const parsed = Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true
		});

		const hashedData = await Promise.all(
			(parsed.data as any[]).map(async (row) => {
				const value = row['email'] ?? 'iCTSV';
				return {
					...row,
					passwordHash: await hashPassword(value)
				};
			})
		);

		return { processed: Papa.unparse(hashedData) };
	}
} satisfies Actions;
