import toast from 'svelte-french-toast';
import { kdData, type KDCTSVResponseType } from '../kddata.svelte';

export enum Status {
	APPROVED = 2,
	PENDING = 1,
	DENIED = 0
}

export async function setStatus(mssv: string, userStatus: Status) {
	const jsonStr = JSON.stringify({
		UserCode: mssv,
		UAStatus: userStatus,

		AId: kdData.AId,
		TokenCode: kdData.TokenCode,
		UserName: kdData.UserName,
		UserRole: 2
	});

	console.log(JSON.parse(jsonStr));

	try {
		const response = await fetch(
			'https://ctsv.hust.edu.vn/api-t/Activity/ApproveUserActivity',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: jsonStr
			}
		);

		if (response.ok) {
			const result: KDCTSVResponseType = await response.json();

			if (result.RespCode == 0) {
				toast.success('Ok!', { position: 'bottom-left' });
			} else {
				toast.error(result.RespText);
			}
		} else {
			toast.error(`Lỗi ${mssv}!`);
		}
	} catch (err) {
		const e = err as Error;
		console.log(e);
		toast.error(e.message);
	}
}
