<script lang='ts'>
    import toast from "svelte-french-toast";

	import ImgCheckinDownloader from "./ImgCheckinDownloader.svelte";
	import ExportCSV from './ExportCSV.svelte';
	import MainTable from "./MainTable.svelte";
	import OpenLayersMap from "./OpenLayersMap.svelte";

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
		loading: "Đang tải dữ liệu...",
		success: "Oke!",
		error: e => {
			console.log(e);
			return e.message;
		},
	});

</script>

<div class="flex m-4 rounded-lg h-[70vh] border-4 border-primary">
	<!-- <div class="col-span-1 md:col-span-2"> -->
	<MainTable />
	<!-- </div> -->
	<div class="flex-1 bg-base-content transition-all duration-700 min-w-28"> 
		<img src={tableData.currentRow.imageAsset} id="main-image" alt="MC" class="object-contain h-full p-2" />
	</div>


	<div class="flex-1 relative min-w-28">

		<OpenLayersMap markerPoints={tableData.currentRow.coords}/>
		<div class="whitespace-pre-line absolute bottom-0 px-2 bg-accent/80 text-nowrap truncate w-full">
			{tableData.currentRow.addresses}
		</div>
	</div>
</div>

<div class="mx-8 my-4">
	<div class="flex items-center gap-4">
		<ImgCheckinDownloader />

		<ExportCSV />
	</div>

	<div>Min: </div>
	<input type="number" class="input input-sm input-bordered" 
		value={tableData.filter.min+1}
		onchange={(e) => { tableData.filter.min = Math.max(parseInt(e.currentTarget.value) - 1, 0); }}/>

	<div>Max: </div>
	<input type="number" class="input input-sm input-bordered"
		value={tableData.filter.max}
		onchange={(e) => { tableData.filter.max = parseInt(e.currentTarget.value); }}/>
</div>