import type { ZodError, ZodType } from "zod";

export const validateData = async (body: unknown, schema: ZodType ) => {
	try {
		const data = schema.parse(body);
		return {
			formData: data,
			errors: null
		};
	} catch (err) {
		console.log('Error: ', err);
		const errors = (err as ZodError).flatten();

		return {
			formData: body,
			errors
		};
	}
};