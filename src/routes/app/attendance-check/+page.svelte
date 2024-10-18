<script lang='ts'>
    import type { AttendancesRecord, MembersRecord } from '$lib/pocketbase-types';
    import type { PageServerData} from './$types';

	import toast from 'svelte-french-toast';

	let { data }: { 
		data: PageServerData;
	} = $props();

	type IdMap = { [key: string]: boolean };
	type AttendanceDay = {
		date: string,
		members: IdMap
	};

	let memberList = $state<MembersRecord[]>([]);
	let attendanceList = $state<AttendancesRecord[]>([]);

	async function getAttendances(data: PageServerData) {
		if (data) {
			const members = await data.promises.members;
			attendanceList = await data.promises.attendances;

			memberList = members.map(({ expand, ...rest }) => {
				return {
					...rest,
					role: expand.role.name,
					rank: expand.role.rank,
					department: expand.department.map(dept => dept.name),
				}
			}).sort((a,b) => {
				return a.department[0].localeCompare(b.department[0])
					|| a.rank - b.rank
					|| a.generation - b.generation
					|| a.name.localeCompare(b.name);
			});

			// 

			// const memberToIndexMap = memberList.reduce<IdToIndexMap>((acc, member, index) => {
			// 	acc[member.id] = index;
			// 	return acc;
			// }, {});
			//console.log(attendances);

			// attendanceList = attendances.map<AttendanceDay>((att) => {
			// 	const day: AttendanceDay = {
			// 		date: att.date,
			// 		members: att.members.reduce<IdMap>((acc, memberid) => {
			// 			acc[memberid] = true;
			// 			return acc;
			// 		}, {})
			// 	}

			// 	return day;
			// });
		}	
	}

	// $inspect(memberList);
	$inspect(attendanceList)

	async function toastLoader(promise: Promise<unknown>) {
		toast.promise( promise, {
			loading: 'Loading...',
			success: 'Loaded!',
			error: (e) => {console.log(e); return e.message; },
		});
	}

	function checkAttendance(index: number, id: string) {
		return attendanceList[index]?.members?.includes(id) ?? false;
	}

	function getRoundedClass(index: number, id: string) {
		if (!checkAttendance(index, id)) return "";
		let str = "";
		if (checkAttendance(index-1, id)) { str += " rounded-l-none"; }
		if (checkAttendance(index+1, id)) { str += " rounded-r-none"; }
		return str;
	}

	import DepartmentDisplay from './DepartmentDisplay.svelte';
</script>






{#await toastLoader(getAttendances(data))}
	<span class="loading loading-ring loading-sm"></span>
{:then}

<table class="table table-sm m-8">
	<thead>
		<tr>
			<th>Tên</th>
			<th>Mảng</th>
			<th>
			{#each attendanceList as day, index (index)}
				{day.date}
			{/each}
			</th>
		</tr>
	</thead>
	<tbody>
		{#each memberList as member (member.id)}
			<tr>
				<td>{member.name}</td>
				<td><DepartmentDisplay depts={member.department} /></td>
				<td>
					{#each attendanceList as day, index (index)}
						<input type="checkbox" 
							checked={checkAttendance(index, member.id)}
							value={member.id}
							bind:group={attendanceList[index].members}
							class={"checkbox checkbox-success rounded-full" + getRoundedClass(index, member.id)} />

					{/each}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

