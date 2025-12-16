<script lang="ts">
	import toast from 'svelte-french-toast';

	import ImgCheckinDownloader from './ImgCheckinDownloader.svelte';
	import ExportCSV from './ExportCSV.svelte';
	import MainTable from './MainTable.svelte';
	import OpenLayersMap from './OpenLayersMap.svelte';

	import BackIcon from 'lucide-svelte/icons/corner-up-left';

	import { tableData, type GetAllResult } from './maintabledata.svelte';

	let { data } = $props();

	async function getRows() {
		const response = await data.getRows;
		const result: GetAllResult = await response.json();

		if (result.RespCode != 0) {
			throw Error(result.RespText);
		}

		tableData.initialize(result.UserActivityLst);
	}

	toast.promise(getRows(), {
		loading: 'Đang tải dữ liệu...',
		success: 'Oke!',
		error: (e) => {
			console.log(e);
			return e.message;
		}
	});

	function parseLines(inputString: string) {
		return inputString
			.split('\n') // Split by newline
			.map((line) => line.trim()) // Trim whitespace from each line
			.filter((line) => line); // Remove any empty lines
	}

	let KDEditMode = $state(false);
</script>

<div class="flex m-4 rounded-lg h-[70vh] border-4 border-primary">
	<!-- <div class="col-span-1 md:col-span-2"> -->
	<MainTable editable={KDEditMode} />
	<!-- </div> -->
	<div class="flex-1 bg-base-content transition-all duration-700 min-w-28">
		<img
			src={tableData.currentRow.imageAsset}
			id="main-image"
			alt="MC"
			class="object-contain h-full p-2"
		/>
	</div>

	<div class="flex-1 relative min-w-28">
		<OpenLayersMap markerPoints={tableData.currentRow.coords ?? []} />
		<div
			class="whitespace-pre-line absolute bottom-0 px-2 bg-accent/80 text-nowrap truncate w-full"
		>
			{tableData.currentRow.addresses}
		</div>
	</div>
</div>

<div class="mx-8 my-4 flex items-start gap-4">
	<ImgCheckinDownloader />

	<div class="flex gap-3 items-start">
		<div class="grid grid-cols-[auto_auto] gap-x-3 gap-y-2">
			<label for="from" class="contents cursor-pointer">
				<span class="self-center">From:</span>
				<input
					id="from"
					type="number"
					class="input input-sm input-bordered w-24 text-base"
					value={tableData.filter.min + 1}
					onchange={(e) => {
						tableData.filter.min = Math.max(parseInt(e.currentTarget.value) - 1, 0);
					}}
				/>
			</label>
	
			<label for="to" class="contents cursor-pointer">
				<span class="self-center">To:</span>
				<input
					id="to"
					type="number"
					class="input input-sm input-bordered w-24 text-base"
					value={tableData.filter.max}
					onchange={(e) => {
						tableData.filter.max = parseInt(e.currentTarget.value);
					}}
				/>
			</label>
		</div>

		<label class="form-control">
			<span class="label pt-0 pb-2">Lọc MSSV:</span>
			<textarea
				class="textarea textarea-sm textarea-bordered leading-tight text-base"
				rows="5"
				onchange={(e) => {
					tableData.filter.list = parseLines(e.currentTarget.value);
				}}
				placeholder="2020..."
			></textarea>
		</label>
	</div>

	{#if KDEditMode}
		<ExportCSV />
	{/if}
</div>

<!-- Toggle flag for KD editing -->
<div class="flex justify-between absolute bottom-0 left-0 right-0 mx-4 mb-2">
	<a href="/app/kd/checker" class="btn btn-ghost btn-sm pl-2 text-base-content/50 hover:text-base-content">
		<BackIcon size="1.25em"/>
		Quay lại
	</a>

	<label class="form-control flex flex-row gap-2 items-center">
		<span class="label">Danger: </span>
		<input type="checkbox" class="toggle toggle-error border-2" bind:checked={KDEditMode} />
	</label>
</div>

