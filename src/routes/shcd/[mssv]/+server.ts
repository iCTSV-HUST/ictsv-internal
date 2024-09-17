import { MYCODE, AID, TOKEN_CODE } from '$env/static/private';

const imageURL = `https://ctsv.hust.edu.vn/api-t/UploadFile/CTSV/Download?UserName=${MYCODE}&AId=${AID}&TokenCode=${TOKEN_CODE}&UserCode=`;


import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const response = await fetch(imageURL + params.mssv);
		
		if (!response.ok) {
			throw error(response.status, 'Failed to fetch image');
		}

		const arrayBuffer = await response.arrayBuffer();

		return new Response(arrayBuffer, {
			headers: {
				'Content-Type': 'image/jpg',
				'Cache-Control': 'max-age=0'
			}
		});
	} catch (err) {
		console.error('Error fetching image:', err);
		throw error(500, 'Internal server error');
	}
}