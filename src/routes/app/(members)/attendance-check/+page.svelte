<script lang="ts">
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import DepartmentDisplay from '../../DepartmentDisplay.svelte';

	import { AttendanceManager } from './attendance.svelte';
	import { download } from '$lib/utils';

	import { memberSort } from '$lib/types';

	const { data } = $props();
	const activeMembers = data.activeMembers.sort(memberSort);

	// Initialize as empty
	const myAttendances = new AttendanceManager();

	onMount(async () => {
		await myAttendances.getRealData();
	});

	let endTable = $state<HTMLDivElement>();

	const DELETE_MODE = 1;
	const LOCK_MODE = 2;
	let usingMode = $state(0);

	// let loadOnce = false;

	// $effect(() => {
	// 	if (appData.attendances.length > 0 && !loadOnce) {
	// 		loadOnce = true;
	// 		setTimeout(() => {
	// 			endTable?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
	// 		}, 100);
	// 	}
	// });

	function exportAttendanceCSV() {
		let buffer =
			'STT,Tên,MSSV,' +
			myAttendances.records.map((day) => 'DD ' + dayjs(day.date).format('DD/MM')).join(',') +
			'\n';

		for (const [index, member] of activeMembers.entries()) {
			buffer += `${index + 1},${member.name},${member.usercode},`;
			buffer += myAttendances.records
				.map((day) => (day.memberIds?.includes(member.id) ? 1 : 0))
				.join(',');
			buffer += '\n';
		}

		download('attendances.csv', buffer);
	}

	import DownloadIcon from 'lucide-svelte/icons/download';

	const deleteButtonClass = (locked: boolean) => {
		return locked ? 'bg-base-content/20 cursor-not-allowed' : 'hover:bg-error/50';
	};
</script>

<div class="h-full flex flex-col">
	<div class="flex justify-between ml-4 mr-8">
		<div class="flex gap-2 items-center mb-4">
			<h3 class="text-2xl font-semibold">Điểm danh</h3>
			<button class="btn btn-sm bg-base-100 border-0" onclick={exportAttendanceCSV}>
				<DownloadIcon />
			</button>
		</div>

		<div class="flex gap-2 items-center font-semibold">
			{#if !myAttendances.isSaved}
				<span>Đang lưu</span>
				<span class="loading loading-spinner loading-sm text-success"></span>
			{:else}
				<span>Đã lưu</span>
				<input
					type="checkbox"
					checked
					disabled
					class="checkbox checkbox-sm checkbox-success rounded-full !opacity-100"
				/>
			{/if}
		</div>
	</div>

	<div class="border-2 border-neutral rounded-xl mx-4 overflow-scroll">
		<table class="table table-sm table-pin-rows border-separate border-spacing-0">
			<thead>
				<tr class="text-sm bg-base-300 z-[3]">
					<th class="stt-cell bg-base-300">STT</th>
					<th class="name-cell bg-base-300">
						<div class="flex justify-between">
							<span>Tên</span>
							<span>Mảng</span>
						</div>
					</th>

					{#each myAttendances.records as day, index (day.date)}
						<th class="p-0 text-center relative">
							{#if usingMode === DELETE_MODE}
								<!-- TODO: Make this a checkbox instead, so when clicking the Delete/Xoa button, we can select multiple days to delete at once (this also reduce chance of misclick) -->
								<button
									disabled={day.locked}
									onclick={() => myAttendances.delete(index)}
									class={'absolute top-0 left-0 w-full h-full ' +
										deleteButtonClass(day.locked)}
								>
									{dayjs(day.date).format('DD/MM')}
								</button>
							{:else if usingMode === LOCK_MODE}
								<button
									onclick={() => myAttendances.toggleLock(index)}
									class="absolute top-0 left-0 w-full h-full hover:bg-warning/50"
									class:bg-warning={day.locked}
								>
									{dayjs(day.date).format('DD/MM')}
								</button>
							{:else}
								{dayjs(day.date).format('DD/MM')}
							{/if}
						</th>
					{/each}

					<th class="p-0">
						<button
							onclick={() => myAttendances.create()}
							style="min-width: var(--check-w);"
							class="py-1 h-full w-full hover:bg-primary/50 text-2xl"
						>
							+
						</button>
					</th>

					<th class="p-0 relative">
						<div class="absolute top-0 h-full">
							<button
								onclick={() => (usingMode = usingMode === 0 ? LOCK_MODE : 0)}
								class:bg-warning={usingMode === LOCK_MODE}
								class="p-3 h-full hover:bg-warning/50"
							>
								Khoá chỉnh sửa
							</button>

							<button
								onclick={() => (usingMode = usingMode === 0 ? DELETE_MODE : 0)}
								class:bg-error={usingMode === DELETE_MODE}
								class="p-3 h-full hover:bg-error/50"
							>
								Xoá
							</button>
						</div>
						<div bind:this={endTable} style="width: var(--padded-w);"></div>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each activeMembers as member, stt (member.id)}
					<tr>
						<td class="stt-cell bg-base-100">{stt + 1}</td>
						<td class="name-cell bg-base-100">
							<div style="min-width: var(--name-w);" class="flex justify-between">
								{member.name}
								<span
									><DepartmentDisplay
										depts={member.departments}
										short={true}
									/></span
								>
							</div>
						</td>

						{#each myAttendances.records as day, index (day.date)}
							<td class="p-0">
								<div
									style="min-width: var(--check-w);"
									class="relative flex items-center justify-center"
								>
									<input
										type="checkbox"
										checked={myAttendances.isCheckedIn(index, member.id)}
										value={member.id}
										bind:group={myAttendances.records[index].memberIds}
										class="checkbox checkbox-success rounded-full steps"
										class:show={myAttendances.hasStreak(index, member.id)}
										class:checkbox-locked={day.locked}
										disabled={day.locked}
										onclick={() => {
											if (!day.locked) {
												myAttendances.save(index);
											}
										}}
									/>
								</div>
							</td>
						{/each}

						<td></td>
						<td></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	table {
		--stt-w: 1rem;
		--name-w: 17rem;
		--check-w: 3rem;
		/*	- 4rem to align the cell */
		--padded-w: calc(80vw - var(--stt-w) - var(--name-w) - var(--check-w) * 4 - 4rem);
	}
	table tbody td {
		border-left: 1px solid oklch(var(--b3));
		border-bottom: 1px solid oklch(var(--b3));
	}

	table thead th {
		border-left: 1px solid oklch(var(--nc));
	}

	.name-cell {
		border-right: 2px solid oklch(var(--nc));

		position: sticky;
		left: calc(var(--stt-w) + 1rem + 1px);
		z-index: 2;
	}

	.stt-cell {
		position: sticky;
		left: 0px;
		z-index: 2;

		min-width: var(--stt-w);
		padding-left: 0.25rem;
		padding-right: 0.25rem;
		text-align: center;
	}

	.checkbox-locked:checked {
		opacity: 1;
	}

	.steps {
		z-index: 1;
	}
	.steps.show::after {
		pointer-events: none;
		/* Fade in */
		opacity: 1;
		transition: opacity 0.4s ease;
	}
	.steps::after {
		content: '';
		position: absolute;
		left: calc(-50% + 0.5rem - 1px); /* - checkbox_size + border */
		top: calc(50% - 0.25rem); /* - height/2 */
		width: calc(100% - 1rem + 1px); /* - checkbox_size + border */
		height: 0.5rem;

		background-color: oklch(var(--su));
		z-index: 0;
		pointer-events: none;
		/* Fade out 0 second */
		opacity: 0;
	}
</style>
