import type { ZodError, ZodType } from 'zod';

export const validateData = async (body: unknown, schema: ZodType) => {
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

export function download(filename: string, text: string | number | boolean) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
