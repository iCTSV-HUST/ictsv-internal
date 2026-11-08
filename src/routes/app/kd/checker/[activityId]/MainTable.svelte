<script lang="ts">
	import { VirtualList } from 'svelte-virtuallists';
	import { tableData } from './maintabledata.svelte';
	import { setStatus, Status } from './changeStatus';

	let {
		editable = false
	}: {
		editable?: boolean;
	} = $props();

	let compactTable = $state(false);

	function handleKeyDown(evt: KeyboardEvent) {
		if (
			evt.target instanceof HTMLInputElement ||
			evt.target instanceof HTMLSelectElement ||
			evt.target instanceof HTMLTextAreaElement
		) {
			return;
		}

		// Note number

		// Up, Down
		if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
			evt.preventDefault();

			if (evt.key === 'ArrowUp') {
				tableData.focusUp();
			} else if (evt.key === 'ArrowDown') {
				tableData.focusDown();
			}

			console.log(tableData.currentRow.UserCode);
			const element = document.getElementById(`checkbox-${tableData.currentRow.UserCode}`);
			element?.focus();
			element?.scrollIntoView({
				behavior: 'auto',
				block: 'center',
				inline: 'center'
			});
			return;
		}

		const key = parseInt(evt.key);
		if (!isNaN(key) && key >= 0 && key <= Math.min(9, statusList.length)) {
			// console.log("Keydown", key, tableData.rowfocus);

			if (key === 0) {
				tableData.currentRow.assignedStatus = '';
			} else {
				tableData.currentRow.assignedStatus = statusList[key - 1];
			}
			console.log('TESTING');
			// console.log("CODE PRESSED: ", parseInt(evt.key), rowToDisplay[rowfocus].testStatus);
			return;
		}
	}

	const statusList = [
		'Khẩu trang',
		'Không mặt',
		'Không/sai banner',
		'Sai checkin',
		'Không checkin',
		'Photoshop',
		'Sử dụng AI',
		'Khác'
	];
</script>

<!-- head -->
<svelte:window onkeydown={handleKeyDown} />

<VirtualList items={tableData.displayRows} isTable={true}>
	{#snippet header()}
		<thead class="sticky top-0 z-10 bg-base-300 w-full">
			<tr>
				{#if editable}
					<th class="text-center">Chọn</th>
				{/if}
				<th class="text-center" style="border-top-left-radius: 0.25rem;">STT</th>
				<th>Name</th>
				<th>MSSV</th>
				{#if tableData.rows.at(0)?.Faculty !== undefined && !compactTable}
					<th>Trường/Viện</th>
				{/if}
				<th>Status</th>

				{#if editable}
					<th class="text-center">Xác nhận</th>
					<th>Note</th>
				{/if}
			</tr>
		</thead>
	{/snippet}

	{#snippet vl_slot({ item })}
		<tr
			id={`row-${item.UserCode}`}
			onfocus={() => (tableData.rowfocus = item.index)}
			onmouseover={() => (tableData.rowfocus = item.index)}
			class:active={tableData.rowfocus === item.index}
			class:error-down-img={item.imageAsset === ''}
			class:error-down-checkin={item.coords?.length == 0}
		>
			{#if editable}
				<td class="text-center">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						aria-label={`Chọn ${item.FullName}`}
						checked={tableData.isSelected(item.UserCode)}
						onclick={(e) => tableData.selectRow(item.UserCode, e)}
					/>
				</td>
			{/if}
			<td class="text-center">{item.index + 1}</td>
			<td class="long-ass-col" title={item.FullName}><div>{item.FullName}</div></td>
			<td>{item.UserCode}</td>

			{#if item.Faculty !== undefined && !compactTable}
				<td class="long-ass-col" title={item.Faculty}><div>{item.Faculty}</div></td>
			{/if}

			<td class="min-w-32">
				{#if item.UAStatus === Status.APPROVED}
					<div
						class="badge whitespace-nowrap badge-outline brightness-[0.8] badge-success"
					>
						Xác nhận
					</div>
				{:else if item.UAStatus === Status.PENDING}
					<div
						class="badge whitespace-nowrap badge-outline brightness-[0.8] badge-warning"
					>
						Chờ phê duyệt
					</div>
				{:else}
					<div class="badge whitespace-nowrap badge-outline brightness-[0.8] badge-error">
						Bị từ chối
					</div>
				{/if}
			</td>

			{#if editable}
				<td class="text-center">
					<input
						id={`checkbox-${item.UserCode}`}
						type="checkbox"
						class="checkbox checkbox-success"
						checked={item.UAStatus === Status.APPROVED}
						onchange={(e) => {
							const toChange = e.currentTarget.checked
								? Status.APPROVED
								: Status.PENDING;
							tableData.rows[item.index].UAStatus = toChange;
							if (editable) {
								setStatus(item.UserCode, toChange);
							}
						}}
					/>
				</td>

				<td class="text-center">
					<div class="flex w-36 max-w-full flex-col items-stretch gap-1">
						<select
							class="select select-xs w-full min-w-0 select-arrow"
							onchange={(e) => {
								const note = e.currentTarget.value;
								tableData.rows[item.index].assignedStatus = note;
								if (note && note !== 'Khác') {
									tableData.rows[item.index].UAStatus = Status.DENIED;
									setStatus(item.UserCode, Status.DENIED, note);
								}
							}}
							value={item.assignedStatus ?? ''}
						>
							<option value="" selected></option>
							{#each statusList as value}
								<option {value}>{value}</option>
							{/each}
						</select>
						{#if item.assignedStatus === 'Khác'}
							<input
								class="input input-xs w-full min-w-0"
								type="text"
								placeholder="Lý do"
								aria-label={`Lý do từ chối cho ${item.UserCode}`}
								value={item.assignedNote ?? ''}
								onchange={(e) => {
									const reason = e.currentTarget.value.trim();
									tableData.rows[item.index].assignedNote = reason;
									if (reason) {
										tableData.rows[item.index].UAStatus = Status.DENIED;
										setStatus(item.UserCode, Status.DENIED, reason);
									}
								}}
							/>
						{/if}
					</div>
				</td>
			{/if}
		</tr>
	{/snippet}
</VirtualList>

<style>
	@reference '../../../../../app.css';

	:global(table) {
		@apply w-full table table-xs;
	}

	.long-ass-col {
		max-width: 8vw;
	}

	.long-ass-col div {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
</style>
