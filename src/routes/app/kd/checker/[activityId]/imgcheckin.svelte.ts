import toast from 'svelte-french-toast';
import dayjs from 'dayjs';
import pAll from 'p-all';

import { kdData, type KDCTSVDataRequired } from '../kddata.svelte';
import { tableData } from './maintabledata.svelte';

const unchangedData: KDCTSVDataRequired = {
	AId: '',
	TokenCode: '',
	UserName: ''
};

function setupInfo() {
	unchangedData.AId = kdData.AId;
	unchangedData.TokenCode = kdData.TokenCode;
	unchangedData.UserName = kdData.UserName;

	return unchangedData.AId != '' && unchangedData.TokenCode != '' && unchangedData.UserName != '';
}

async function getImage(mssv: string) {
	try {
		const response = await fetch(
			`https://ctsv.hust.edu.vn/api-t/UploadFile/CTSV/Download?UserName=${unchangedData.UserName}&AId=${unchangedData.AId}&TokenCode=${unchangedData.TokenCode}&UserCode=${mssv}`
		);

		if (!response.ok) {
			toast.error(`Không có ảnh ${mssv}!`);
			return null;
		}

		return await response.blob();
	} catch (err) {
		const e = err as Error;
		console.error(e);
		toast.error(e.message);
		return null;
	}
}

async function getCheckin(mssv: string) {
	type CheckinType = {
		Longitude: number;
		Latitude: number;
		CheckInTime: string;
		CheckInAddress: string;
	};

	const jsonStr = JSON.stringify({
		UserCode: mssv,
		AId: unchangedData.AId,
		Signature: 'sample string 5',
		TokenCode: unchangedData.TokenCode,
		UserName: unchangedData.UserName
	});

	try {
		const response = await fetch(
			'https://ctsv.hust.edu.vn/api-t/Activity/GetUserCheckInActivity',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: jsonStr
			}
		);

		if (!response.ok) {
			toast.error('Không lấy được checkin!');
			return {
				coords: [],
				addresses: ''
			};
		}

		const checkinResult: { UserCheckInActivityLst: CheckinType[] } = await response.json();

		if (checkinResult.UserCheckInActivityLst.length === 0) {
			// toast.error("Không có checkin!");
			return {
				coords: [],
				addresses: 'Không có checkin.'
			};
		}

		let coords: number[][] = [];
		let addresses = '';

		checkinResult.UserCheckInActivityLst.forEach((checkin) => {
			// const newObj: CheckinType = {
			// 	time: checkin.CheckInTime,
			// 	coords: [checkin.Longitude, checkin.Latitude]
			// };

			coords.push([checkin.Longitude, checkin.Latitude]);
			addresses +=
				dayjs(checkin.CheckInTime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM HH:mm') +
				' - ' +
				checkin.CheckInAddress +
				'\n';
		});

		return {
			coords,
			addresses
		};
	} catch (err) {
		const e = err as Error;
		console.error(e);
		toast.error(e.message);

		return {
			coords: [],
			addresses: ''
		};
	}
}

function setupRows() {
	const total = tableData.displayRows.length;
	for (let i = 0; i < total; i++) {
		const row = tableData.rows[tableData.displayRows[i].index];

		if (!row.hasOwnProperty('imageAsset')) {
			row.imageAsset = '';
		}

		if (!row.hasOwnProperty('coords')) {
			row.coords = [];
		}
		// document.getElementById(`row-${index}`)?.classList.add("error-down-img", "error-down-checkin");
	}
}

type BlobImage = {
	mssv: string;
	image: Blob;
};

export class Downloader {
	progress = $state(-1);
	total = 0;
	#blobStorage: BlobImage[] = [];

	async downloadAllImgsAndCheckins() {
		setupRows();
		if (!setupInfo()) {
			toast.error('Setup not correct! Please go back and try again.');
			return;
		}

		this.progress = 0;
		this.#blobStorage = [];

		// Get MSSV list to download
		const toDownloadList = [];
		const total = tableData.displayRows.length;

		for (let i = 0; i < total; i++) {
			const row = tableData.rows[tableData.displayRows[i].index];
			if (!row.hasOwnProperty('imageAsset') || row.imageAsset === '') {
				toDownloadList.push(async () => {
					const downloadedBlob = await getImage(row.UserCode);

					if (downloadedBlob != null) {
						this.#blobStorage.push({
							mssv: row.UserCode,
							image: downloadedBlob
						});

						row.imageAsset = URL.createObjectURL(downloadedBlob);
					}

					this.progress += 1;
					// if (row.imageAsset != "") {
					// 	document.getElementById(`row-${mssvRowMap[row.UserCode]}`)?.classList.remove("error-down-img");
					// }
				});
			}

			if (!row.hasOwnProperty('coords') || row.coords?.length === 0) {
				toDownloadList.push(async () => {
					const { coords, addresses } = await getCheckin(row.UserCode);
					row.coords = coords;
					row.addresses = addresses;
					this.progress += 1;

					// TODO: Should not use hard coded values here
					if (row.coords.length == 0 && row.addresses == 'Không có checkin.') {
						row.assignedStatus = '5. Không checkin';
					}
				});
			}
		}

		this.total = toDownloadList.length;
		pAll(toDownloadList, { concurrency: 10 });
	}

	async zipAllImgs() {}
}
