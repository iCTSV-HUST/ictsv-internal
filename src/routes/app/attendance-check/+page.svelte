<script lang='ts'>
	import { appData } from "$lib/appimportant.svelte";
    import dayjs from "dayjs";
    import DepartmentDisplay from "../DepartmentDisplay.svelte";

    import { checkAttendance, checkStreak, createAttendance, deleteAttendance, saveAttendance } from "./api-attendance";

	let endTable = $state<HTMLDivElement>();
	let deleteMode = $state(false);
	let loadOnce = false;

	$effect(() => {
		if (appData.attendances.length > 0 && !loadOnce) {
			loadOnce = true;
			setTimeout(() => {
				endTable?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
			}, 100);
		
		}
	});


</script>


<div class="h-full flex flex-col">

<h3 class="ml-4 mb-2 text-2xl font-semibold">Điểm danh</h3>

<div class="border-2 border-neutral rounded-xl mx-8 overflow-scroll" style="width: 80vw;">
<table class="table table-sm table-pin-rows border-separate border-spacing-0" >
	<thead>
		<tr class="text-sm bg-base-300 z-[3]">
			<th class="stt-cell bg-base-300">STT</th>
			<th class="name-cell bg-base-300">
				<div class="flex justify-between">
					<span>Tên</span>
					<span>Mảng</span>				
				</div>
			</th>

			{#each appData.attendances as day, index (day.id)}
				<th class="p-0 text-center relative">
					{#if deleteMode}
						<button onclick={() => deleteAttendance(index)}
							class="absolute top-0 left-0 w-full h-full hover:bg-error/50">
							{dayjs(day.date).format('DD/MM')}
						</button>
					{:else}
						{dayjs(day.date).format('DD/MM')}
					{/if}
				</th>
			{/each}

			<th class="p-0">
				<button onclick={() => createAttendance()}
					style="min-width: var(--check-w);"
					class="py-1 h-full w-full hover:bg-primary/50 text-2xl">
					+
				</button>
			</th>

			<th class="p-0 relative">
				<button onclick={() => deleteMode = !deleteMode} 
					class:bg-error={deleteMode}
					class="absolute p-3 top-0 h-full hover:bg-error/50">
					Xoá
				</button>
				<div bind:this={endTable} style="width: var(--padded-w);"></div>
			</th>
		</tr>
	</thead>
	<tbody>
		
			{#each appData.members as member, stt (member.id)}
			<tr>
				<td class="stt-cell bg-base-100">{stt + 1}</td>
				<td class="name-cell bg-base-100">
					<div style="min-width: var(--name-w);" class="flex justify-between">
						{member.name}
						<span><DepartmentDisplay depts={member.department} short={true}/></span>					
					</div>

				</td>

				{#each appData.attendances as day, index (day.id)}
					<td class="p-0">
						<div style="min-width: var(--check-w);" class="relative flex items-center justify-center">
							<input type="checkbox" 
								checked={checkAttendance(index, member.id)}
								value={member.id}
								bind:group={appData.attendances[index].members}
								class="checkbox checkbox-success rounded-full steps "
								class:steps={checkStreak(index, member.id)}

								onclick={() => { saveAttendance(index) }}
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
		border-left: 1px solid oklch(var(--b2));
		border-bottom: 1px solid oklch(var(--b2));
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

	@keyframes fadeIn {   0% { opacity: 0; }   100% { opacity: 1; } }
	.steps {
		z-index: 1;
	}
	.steps::after {
	    content: '';
	    position: absolute;
	    left: calc(-50% + 0.5rem - 1px);	/* - checkbox_size + border */
	    top: calc(50% - 0.25rem);			/* - height/2 */
	    width: calc(100% - 1rem + 1px);	/* - checkbox_size + border */
	    height: 0.5rem;
	    background-color: oklch(var(--su));
	    z-index: 0;
	    animation: fadeIn 0.5s;
	  }
</style>
