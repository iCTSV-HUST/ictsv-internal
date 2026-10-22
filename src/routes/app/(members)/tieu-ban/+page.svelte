<script lang="ts">
	import { memberSort, roleMap } from '#lib/types';
	import toast from 'svelte-french-toast';
	import DepartmentDisplay from '../../DepartmentDisplay.svelte';

	const { data } = $props();

	let memberList = $state(data.allMembers.sort(memberSort));

	import MultiSelect from 'svelte-multiselect';

	let editingMemberIndex = $state(0);

	const departmentOptions = [
		'Mảng Kiểm duyệt',
		'Mảng Truyền thông',
		'Mảng Sự kiện',
		'Mảng Hậu cần',
		'Tiểu ban'
	];

	const roleOptions = [
		{ value: 'president', label: 'Tổ trưởng' },
		{ value: 'topho', label: 'Tổ phó' },
		{ value: 'tt', label: 'Tổ viên Thường trực' },
		{ value: 'ttmr', label: 'Tổ viên Thường trực mở rộng' },
		{ value: 'tv', label: 'Tổ viên' },
		{ value: 'ctv', label: 'Cộng tác viên' }
	];

	async function saveMember(memberId: number, roleId: string, active: boolean) {
		const res = await fetch('/api/member', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ memberId, roleId, active })
		});

		if (!res.ok) {
			toast.error('Cập nhật thành viên thất bại');
			console.error('Failed to update member');
			throw new Error('Failed to update member');
		} else {
			toast.success('Cập nhật thành viên thành công');
		}
	}

	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import BatchMemberModal from './BatchMemberModal.svelte';
	import type { Member } from '#lib/types';

	let batchModal = $state<BatchMemberModal>();

	function handleMembersAdded(newMembers: Member[]) {
		memberList = [...memberList, ...newMembers].sort(memberSort);
	}

	// import UploadCSV from './UploadCSV.svelte';
</script>

<div class="flex flex-col h-full">
	<div class="flex justify-between items-center lg:w-[85%] mx-4 mb-4">
		<h3 class="text-bold text-2xl">Danh sách thành viên Tổ HTTK Hệ thống iCTSV</h3>
		<button class="btn btn-primary btn-sm gap-2" onclick={() => batchModal?.open()}>
			<UserPlusIcon class="w-4 h-4" />
			Thêm thành viên
		</button>
	</div>

	<div class="lg:w-[85%] border-base-content border-2 rounded-xl mx-4 overflow-x-hidden">
		<table class="table table-sm table-pin-rows">
			<thead>
				<tr class="bg-base-300 text-sm">
					<th class="text-center">STT</th>
					<th>Tên</th>
					<th>Mảng</th>
					<th>Chức vụ</th>
					<th>Gen</th>
					<th>Trạng thái hoạt động</th>
				</tr>
			</thead>
			<tbody class="overflow-y-scroll">
				{#each memberList as member, index (member.id)}
					<tr class="!text-base">
						<td class="text-center">{index + 1}</td>
						<td onclick={() => (editingMemberIndex = -1)}>{member.name}</td>
						<td
							onclick={() => (editingMemberIndex = index)}
							class={'pr-4 !w-[28rem] ' +
								(editingMemberIndex === index ? 'py-1' : 'py-[0.9rem]')}
						>
							{#if editingMemberIndex === index}
								<MultiSelect
									bind:selected={member.departments}
									options={departmentOptions}
									onchange={() =>
										saveMember(member.id, member.roleId, member.active)}
									minSelect={1}
									outerDivClass="!py-1 !px-0 flex-1"
									liSelectedClass="!rounded-md !py-1"
								/>
							{:else}
								<DepartmentDisplay depts={member.departments} />
							{/if}
						</td>
						<td onclick={() => (editingMemberIndex = index)} class="py-1">
							{#if editingMemberIndex === index}
								<select
									class="w-full px-2 py-2.5 bg-base-100 border border-base-content/30 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral focus:border-transparent"
									bind:value={member.roleId}
									onchange={() =>
										saveMember(member.id, member.roleId, member.active)}
								>
									{#each roleOptions as role}
										<option value={role.value} class="border-0">
											{role.label}
										</option>
									{/each}
								</select>
							{:else}
								{roleMap[member.roleId].name}
							{/if}
						</td>

						<td class="relative">
							{member.generation}
						</td>
						<td>
							<input
								type="checkbox"
								class="checkbox checkbox-sm checkbox-primary px-4"
								checked={member.active}
								onchange={async (e) => {
									const newStatus = e.currentTarget.checked;
									member.active = newStatus;
									try {
										await saveMember(member.id, member.roleId, newStatus);
									} catch {
										member.active = !newStatus;
									}
								}}
							/>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- {#if editingMemberIndex > -1}
		<button class="btn btn-error">Xoá</button>
	{/if} -->

	<BatchMemberModal
		bind:this={batchModal}
		{departmentOptions}
		{roleOptions}
		onSuccess={handleMembersAdded}
	/>
</div>
