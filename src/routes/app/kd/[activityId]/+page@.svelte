<script lang='ts'>
    import toast from "svelte-french-toast";

	import ImgCheckinDownloader from "./ImgCheckinDownloader.svelte";
	import MainTable from "./MainTable.svelte";
	import OpenLayersMap from "./OpenLayersMap.svelte";

	import { tableData, type GetAllResult } from './maintabledata.svelte';

	let { data } = $props();


	async function getRows() {
		const response = await data.getRows;
		const result: GetAllResult = await response.json();
		tableData.rows = result.UserActivityLst;
	}

	toast.promise(getRows(), {
		loading: "Đang tải dữ liệu...",
		success: "Oke!",
		error: e => {
			console.log(e);
			return e.message;
		},
	});


	const focusedRow = $derived(tableData.rows[tableData.rowfocus]);
</script>

<div class="flex m-4 rounded-lg h-[70vh] border-4 border-primary">
	<!-- <div class="col-span-1 md:col-span-2"> -->
	<MainTable />
	<!-- </div> -->
	<div class="flex-1 bg-base-content transition-all duration-700 min-w-28"> 
		<img src={focusedRow?.imageAsset} id="main-image" alt="MC" class="object-contain h-full p-2" />
	</div>


	<div class="flex-1 relative min-w-28">

		<OpenLayersMap markerPoints={focusedRow?.coords}/>
		<div class="whitespace-pre-line absolute bottom-0 px-2 bg-accent/80 text-nowrap truncate w-full">
			{focusedRow?.addresses}
		</div>
	</div>
</div>

<div class="m-4">
	<ImgCheckinDownloader />
</div>