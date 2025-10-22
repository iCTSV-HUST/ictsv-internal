import toast from 'svelte-french-toast';

interface AttendanceRecord {
	date: string;
	memberIds: number[];
	locked: boolean;
}

export class AttendanceManager {
	records = $state<AttendanceRecord[]>([]);
	private saveTimeouts: Record<string, NodeJS.Timeout> = {};

	constructor(initialRecords: AttendanceRecord[]) {
		this.records = initialRecords;
	}

	private toastRequest(url: string, method: string, body?: any, successMsg?: string) {
		const options: RequestInit = { method };

		if (body && (method === 'POST' || method === 'PATCH')) {
			options.headers = { 'Content-Type': 'application/json' };
			options.body = JSON.stringify(body);
		}

		return toast.promise(
			fetch(url, options).then((res) => {
				if (!res.ok) throw new Error('Request failed');
				return res.json();
			}),
			{
				loading: 'Đang xử lý...',
				success: successMsg ?? 'Thành công!',
				error: (e) => e.message
			}
		);
	}

	isCheckedIn(dayIndex: number, memberId: number) {
		return this.records[dayIndex]?.memberIds?.includes(memberId) ?? false;
	}

	hasStreak(dayIndex: number, memberId: number) {
		if (dayIndex === 0) return false;
		return this.isCheckedIn(dayIndex - 1, memberId) && this.isCheckedIn(dayIndex, memberId);
	}

	save(dayIndex: number) {
		const chosenDate = this.records[dayIndex].date;
		const memberIds = this.records[dayIndex].memberIds;
		clearTimeout(this.saveTimeouts[chosenDate]);

		this.saveTimeouts[chosenDate] = setTimeout(() => {
			this.toastRequest(`/api/attendance/${chosenDate}`, 'PATCH', { memberIds }, 'Đã lưu!');
		}, 5000);
	}

	async create() {
		const date = new Date().toISOString().split('T')[0];

		const newRecord = (await this.toastRequest('/api/attendance', 'POST', {
			date,
			memberIds: []
		})) as AttendanceRecord;

		const exists = this.records.find((r) => r.date === date);
		if (!exists) {
			this.records.push(newRecord);
		}
	}

	async delete(dayIndex: number) {
		const record = this.records[dayIndex];
		if (!record) return;

		await this.toastRequest(`/api/attendance/${record.date}`, 'DELETE');
		this.records.splice(dayIndex, 1);
	}

	async toggleLock(dayIndex: number) {
		const record = this.records[dayIndex];
		if (!record) return;

		const locked = !record.locked;
		await this.toastRequest(`/api/attendance/${record.date}/lock`, 'PATCH', { locked });
		record.locked = locked;
	}
}

// export function checkAttendance(dayIndex: number, memberId: string) {
// 	return appData.attendances[dayIndex]?.members?.includes(memberId) ?? false;
// }

// export function checkStreak(dayIndex: number, memberId: string) {
// 	if (dayIndex === 0) return '';
// 	return checkAttendance(dayIndex - 1, memberId) && checkAttendance(dayIndex, memberId);
// }

// let intervalList: { [key: string]: NodeJS.Timeout } = {};
// const timeoutBeforeSave = 5000; // 5 seconds delay before save

// function toastSavePromise<T>(promise: Promise<T>) {
// 	return toast.promise(promise, {
// 		loading: 'Đang lưu dữ liệu...',
// 		success: 'Đã lưu!',
// 		error: (e) => {
// 			console.log(e);
// 			return e.message;
// 		}
// 	});
// }

// export function saveAttendance(dayIndex: number) {
// 	const dayId = appData.attendances[dayIndex].id;

// 	// Reset timeout
// 	clearTimeout(intervalList[dayId]);

// 	// Do timeout again
// 	intervalList[dayId] = setTimeout(() => {
// 		toastSavePromise(
// 			pb
// 				.collection('attendances')
// 				.update(dayId, { members: appData.attendances[dayIndex].members ?? [] })
// 		);
// 	}, timeoutBeforeSave);
// }

// export async function createAttendance() {
// 	const today = new Date();

// 	const newAttendance = await toastSavePromise<AttendancesInfo>(
// 		pb.collection('attendances').create({
// 			date: today.toISOString(),
// 			members: []
// 		})
// 	);

// 	appData.attendances.push(newAttendance);
// }

// export function deleteAttendance(dayIndex: number) {
// 	if (!appData.attendances[dayIndex]) return;

// 	toastSavePromise(pb.collection('attendances').delete(appData.attendances[dayIndex].id));

// 	appData.attendances.splice(dayIndex, 1); // Remove 1 element at the found index
// }

// export function lockAttendance(dayIndex: number, status: boolean) {
// 	if (!appData.attendances[dayIndex]) return;

// 	toastSavePromise(
// 		pb.collection('attendances').update(appData.attendances[dayIndex].id, { locked: status })
// 	);

// 	appData.attendances[dayIndex].locked = status; // Remove 1 element at the found index
// }
