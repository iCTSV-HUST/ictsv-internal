<script lang="ts">
	import { appData, type MemberInfo } from '$lib/appimportant.svelte';
	import DepartmentDisplay from './DepartmentDisplay.svelte';

	let memberList = $state<MemberInfo[]>([]);

	$effect(() => {
		memberList = [...appData.members];
	});

	function sortFunction() {
		memberList.sort((a, b) => {
			return (
				a.department[0].localeCompare(b.department[0]) ||
				a.rank - b.rank ||
				a.generation - b.generation ||
				a.name.localeCompare(b.name)
			);
		});
	}

	// $inspect(memberList);
</script>

<div class="flex flex-col h-full">
	<h3 class="text-bold text-2xl mb-4">Danh sách thành viên Tổ HTTK Hệ thống iCTSV</h3>

	<!-- <button class="btn" onclick={sortFunction}>Sort</button> -->

	<div class="w-[80%] border-base-content border-2 rounded-xl mx-4 overflow-x-hidden h-full">
		<table class="table table-sm table-pin-rows">
			<thead>
				<tr class="bg-base-300">
					<th>STT</th>
					<th>Tên</th>
					<th>Mảng</th>
					<th>Chức vụ</th>
					<th>Gen</th>
				</tr>
			</thead>
			<tbody class="overflow-y-scroll">
				{#each memberList as member, index (member.id)}
					<tr>
						<td>{index + 1}</td>
						<td>{member.name}</td>
						<td><DepartmentDisplay depts={member.department} /></td>
						<td>{member.role}</td>
						<td>{member.generation}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
