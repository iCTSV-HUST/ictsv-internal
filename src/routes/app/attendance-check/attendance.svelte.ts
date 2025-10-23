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