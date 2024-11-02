import toast from 'svelte-french-toast';
import dayjs from 'dayjs';

import { kdData, type KDiCTSVDataType } from '../kddata.svelte';
import { pb } from '$lib/pocketbase';
import { tableData } from './maintabledata.svelte';

const unchangedData: KDiCTSVDataType & { UserName: string } = {
    AId: '',
    TokenCode: '',
    UserName: ''
}

function setupInfo() {
	unchangedData.AId = kdData.AId;
	unchangedData.TokenCode = kdData.TokenCode;
	unchangedData.UserName = pb.authStore.model?.usercode;
	console.log(unchangedData);

	return unchangedData.AId != '' && unchangedData.TokenCode != '' && unchangedData.UserName != '';
}

async function getImage(mssv: string) {
	try {
		const response = await fetch(`https://ctsv.hust.edu.vn/api-t/UploadFile/CTSV/Download?UserName=${unchangedData.UserName}&AId=${unchangedData.AId}&TokenCode=${unchangedData.TokenCode}&UserCode=${mssv}`);

		if (!response.ok) {
			toast.error("Không có ảnh!");
			return "";
		}

		const blob = await response.blob();
		return URL.createObjectURL(blob);

	} catch (err) {
		const e = err as Error;
		console.log(e);
		toast.error(e.message);
		return "";
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
		Signature: "sample string 5",
		TokenCode: unchangedData.TokenCode,
		UserName: unchangedData.UserName
	});
	
	try {
		const response = await fetch('https://ctsv.hust.edu.vn/api-t/Activity/GetUserCheckInActivity', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: jsonStr
		});

		if (!response.ok) {
			toast.error("Không lấy được checkin!");
			return {
				coords: [],
				addresses: ""
			}
		}
		
		const checkinResult: { UserCheckInActivityLst: CheckinType[] } = await response.json();

		if (checkinResult.UserCheckInActivityLst.length === 0) {
			toast.error("Không có checkin!");
			return {
				coords: [],
				addresses: "Không có checkin."
			}
		}

		let coords: number[][] = [];
		let addresses = "";

		checkinResult.UserCheckInActivityLst.forEach((checkin) => {
			// const newObj: CheckinType = {
			// 	time: checkin.CheckInTime,
			// 	coords: [checkin.Longitude, checkin.Latitude]
			// };

			coords.push([checkin.Longitude, checkin.Latitude]);
			addresses += dayjs(checkin.CheckInTime, "YYYY-MM-DD HH:mm:ss").format("DD/MM HH:mm") + " - " + checkin.CheckInAddress + "\n";
		});

		return { 
			coords, 
			addresses
		};

	} catch (err) {
		const e = err as Error;
		console.log(e);
		toast.error(e.message);

		return {
			coords: [],
			addresses: ""
		}
	}
}

const mssvRowMap: { [key: string]: number } = {};

function setupRows() {
	tableData.rows.forEach((row, index) => {
		mssvRowMap[row.UserCode] = index;
		document.getElementById(`row-${index}`)?.classList.add("error-down");
	});
}

export class Downloader {
	progress = $state(-1);
	total = 0;

	async downloadAllImgsAndCheckins() {
		setupRows();
		if (!setupInfo()) {
			toast.error("Setup not correct! Please go back and try again.");
			return;
		}


		this.progress = 0;

		// Get MSSV list to download
		const toDownloadList: Promise<unknown>[] = [];
		const total = tableData.rows.length;

		for (let i = 0; i < total; i++) {
			const row = tableData.rows[i];
			if (!row.hasOwnProperty("imageAsset") || row.imageAsset === "") {
				toDownloadList.push(new Promise(async () => {
					row.imageAsset = await getImage(row.UserCode);
					this.progress += 1;
				}));
			}

			if (!row.hasOwnProperty("coords") || row.coords?.length === 0) {
				toDownloadList.push(new Promise(async () => {
					const { coords, addresses } = await getCheckin(row.UserCode);
					row.coords = coords;
					row.addresses = addresses;
					this.progress += 1;
				}));
			}
		}

		this.total = toDownloadList.length;
		Promise.all(toDownloadList);
	}
}

