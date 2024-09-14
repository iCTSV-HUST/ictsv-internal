import type { Actions } from "./$types";

import { error, fail, redirect  } from "@sveltejs/kit";
import { validateData } from "$lib/utils";
import { loginUserSchema } from "$lib/schemas";
import type { ClientResponseError } from "pocketbase";


export const actions: Actions  = {
	login: async ({ request, locals: { pb } }) => {
		const { formData, errors } = await validateData(
			await request.formData(),
			loginUserSchema,
		);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors,
			});
		}

		console.log(formData);

		try {
			await pb
				.collection("members")
				.authWithPassword(formData.email.toLowerCase(), formData.password);
		} catch (e) {
			const err = e as ClientResponseError;
			console.log("Error: ", err);
			error(err.status, err.message);
		}

		redirect(303, "/");
	},
};
