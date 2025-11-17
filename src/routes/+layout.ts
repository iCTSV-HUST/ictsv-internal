import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	return {
		message: url.searchParams.get('message'),
		failMessage: url.searchParams.get('failmessage')
	};
};
