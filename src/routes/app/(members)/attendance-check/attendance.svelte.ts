import dayjs from 'dayjs';
import toast from 'svelte-french-toast';

interface AttendanceRecord {
	date: string;
	memberIds: number[];
	locked: boolean;
}

export class AttendanceManager {
	records = $state<AttendanceRecord[]>([]);
	isSaved = $state(true);
	private saveTimeouts: Record<string, NodeJS.Timeout> = {};

	constructor(initialRecords?: AttendanceRecord[]) {
		this.records = initialRecords ?? [];
	}

	async getRealData() {
		const threeWeeksAgo = dayjs().subtract(3, 'week').format('YYYY-MM-DD');

		this.records = await toast.promise(
			(async () => {
				const res = await fetch(`/api/attendance?since=${threeWeeksAgo}`);

				if (!res.ok) {
					throw new Error(`Failed to fetch attendance: ${res.statusText}`);
				}

				return await res.json(); // ✅ Yes, await is required
			})(),
			{
				loading: 'Đang lấy dữ liệu...',
				success: 'Đã lấy dữ liệu!',
				error: (e) => e.message
			}
		);
	}

	private toastRequest(url: string, method: string, body?: any, successMsg?: string) {
		const options: RequestInit = { method };

		if (body && (method === 'POST' || method === 'PATCH')) {
			options.headers = { 'Content-Type': 'application/json' };
			options.body = JSON.stringify(body);
		}

		return toast.promise(
			fetch(url, options).then((res) => {
				if (!res.ok) throw new Error(`Lỗi: ${res.statusText}`);
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
		this.isSaved = false;
		const chosenDate = this.records[dayIndex].date;
		clearTimeout(this.saveTimeouts[chosenDate]);

		this.saveTimeouts[chosenDate] = setTimeout(() => {
			// Saving UI is determined by this.isSaved
			(async () => {
				const memberIds = this.records[dayIndex].memberIds;

				const res = await fetch(`/api/attendance/${chosenDate}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ memberIds })
				});
				
				if (!res.ok) {
					toast.error(`Lỗi: ${res.statusText}`);
				}
			})();

			this.isSaved = true;
		}, 4000);
	}

	async create() {
		const date = new Date().toISOString().split('T')[0];

		const exists = this.records.find((r) => r.date === date);
		if (exists) {
			toast.error("Đã điểm danh hôm nay")
			return
		}

		const newRecord = (await this.toastRequest('/api/attendance', 'POST', {
			date,
			memberIds: []
		})) as AttendanceRecord;

		this.records.push(newRecord);
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
