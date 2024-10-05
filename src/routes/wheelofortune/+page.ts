export const ssr = false;

import PocketBase from 'pocketbase';
import type { PageLoad } from './$types';

/** @type {import('./$types').PageLoad} */
export const load: PageLoad = async ({ params }) => {
	const pb = new PocketBase('https://ictsv-new-app.pockethost.io');
    const record = await pb.collection('jsonstorage').getOne('3xuvoj78osndb9k', {
      fields: 'data',
    });

	return record;
}