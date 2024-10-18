import { appData, type AttendancesInfo } from "$lib/appimportant.svelte";
import { pb } from "$lib/pocketbase";
import toast from "svelte-french-toast";

export function checkAttendance(dayIndex: number, memberId: string) {
	return appData.attendances[dayIndex]?.members?.includes(memberId) ?? false;
}

export function checkStreak(dayIndex: number, memberId: string) {
	if (dayIndex === 0) return "";
	return checkAttendance(dayIndex-1, memberId) && checkAttendance(dayIndex, memberId);
}

let intervalList: { [key: string]: NodeJS.Timeout } = {  };
const timeoutBeforeSave = 5000;	// 5 seconds delay before save

function toastSavePromise<T>(promise: Promise<T>) {
	return toast.promise(promise, {
		loading: "Đang lưu dữ liệu...",
		success: "Đã lưu!",
		error: e => {
			console.log(e);
			return e.message;
		},
	});
}

export function saveAttendance(dayIndex: number) {
	const dayId = appData.attendances[dayIndex].id;

	// Reset timeout
	clearTimeout(intervalList[dayId]); 

	// Do timeout again
	intervalList[dayId] = setTimeout(() => {
		toastSavePromise(
			pb.collection('attendances').update(dayId, { members: appData.attendances[dayIndex].members ?? []})
		)

	}, timeoutBeforeSave);
}

export async function createAttendance() {
	const today = new Date();

	const newAttendance = await toastSavePromise<AttendancesInfo>(
		pb.collection('attendances').create({
			date: today.toISOString(),
			members: []
		})
	)

	appData.attendances.push(newAttendance);
}

export function deleteAttendance(dayIndex: number) {
	if (!appData.attendances[dayIndex]) return;

	toastSavePromise(
		pb.collection('attendances').delete(appData.attendances[dayIndex].id)
	)

	appData.attendances.splice(dayIndex, 1); // Remove 1 element at the found index
}

export function lockAttendance(dayIndex: number, status: boolean) {
	if (!appData.attendances[dayIndex]) return;

	toastSavePromise(
		pb.collection('attendances').update(appData.attendances[dayIndex].id, { locked: status })
	)

	appData.attendances[dayIndex].locked = status; // Remove 1 element at the found index
}
