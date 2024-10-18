<script lang='ts'>
	import { appData, type MembersInfo } from "$lib/appimportant.svelte";
    import DepartmentDisplay from "./DepartmentDisplay.svelte";

	let memberList = $state<MembersInfo[]>([]);

	$effect(() => {
		memberList = [...appData.members];
	})

	function sortFunction() {
		memberList.sort((a,b) => {
			return a.department[0].localeCompare(b.department[0])
				|| a.rank - b.rank
				|| a.generation - b.generation
				|| a.name.localeCompare(b.name);
		});
	}

	$inspect(memberList);
</script>

<h3 class="text-bold text-2xl">Danh sách thành viên Tổ HTTK Hệ thống iCTSV</h3>

<button class="btn" onclick={sortFunction}>Sort</button>

<table class="table table-sm m-8">
	<thead>
		<tr>
			<th>Tên</th>
			<th>Mảng</th>
			<th>Chức vụ</th>
			<th>Gen</th>
		</tr>
	</thead>
	<tbody>
		{#each memberList as member (member.id)}
			<tr>
				<td>{member.name}</td>
				<td><DepartmentDisplay depts={member.department} /></td>
				<td>{member.role}</td>
				<td>{member.generation}</td>
			</tr>
		{/each}
	</tbody>
</table>


Test