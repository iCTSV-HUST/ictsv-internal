import { AID, MYCODE, TOKEN_CODE } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {	
		const jsonStr = JSON.stringify({
			UserCode: params.mssv,
			AId: AID,
			Signature: "sample string 5",
			TokenCode: TOKEN_CODE,
			UserName: MYCODE
		});
		
		const response = await fetch('https://ctsv.hust.edu.vn/api-t/Activity/GetUserCheckInActivity', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: jsonStr
		});

		if (!response.ok) {
			throw error(response.status, 'Failed to get checkin');
		}

		const result = await response.json();

		return json(result);
	} catch (err) {
		console.error('Error fetching image:', err);
		throw error(500, 'Error getting checkin');
	}
}