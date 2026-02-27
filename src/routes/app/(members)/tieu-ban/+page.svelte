<script lang="ts">
	import { memberSort, roleMap } from '$lib/types';
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

	async function saveMember(memberId: number, departments: string[], roleId: string, active: boolean) {
		const res = await fetch('/api/member', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ memberId, departments, roleId, active })
		});

		if (!res.ok) {
			toast.error('Cập nhật thành viên thất bại');
			console.error('Failed to update member');
		}
		else {
			toast.success('Cập nhật thành viên thành công')
		}
	}

	// import UploadCSV from './UploadCSV.svelte';
</script>

<div class="flex flex-col h-full">
	<div class="flex gap-2">
		<h3 class="text-bold text-2xl mb-4">Danh sách thành viên Tổ HTTK Hệ thống iCTSV</h3>
		<!-- <UploadCSV /> -->
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
									onchange={() => saveMember(member.id, member.departments, member.roleId, member.active)}
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
									class="w-full px-2 py-2.5 bg-base-100 border border-base-content/30 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral focus:border-transparent"
									bind:value={member.roleId}
									onchange={() => saveMember(member.id, member.departments, member.roleId, member.active)}
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
								bind:checked={member.active}
								onchange={() => 
									saveMember(member.id, member.departments, member.roleId, member.active)
								}	
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
</div>
