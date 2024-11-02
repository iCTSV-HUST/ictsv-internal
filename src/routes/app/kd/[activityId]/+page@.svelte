<script lang='ts'>
	import MainTable from "./MainTable.svelte";
	import { tableData } from './maintabledata.svelte';
	import OpenLayersMap from "./OpenLayersMap.svelte";

	const focusedRow = $derived(tableData.rows[tableData.rowfocus]);
</script>

<div class="flex m-4 rounded-lg h-[70vh] border-4 border-primary">
	<!-- <div class="col-span-1 md:col-span-2"> -->
	<MainTable />
	<!-- </div> -->
	<div class="flex-1 bg-base-content transition-all duration-700 min-w-28"> 
		<img src={focusedRow.imgSrc} id="main-image" alt="MC" class="object-contain h-full p-2" />
	</div>


	<div class="flex-1 relative min-w-28">

		<OpenLayersMap markerPoints={focusedRow.coords}/>
		<div class="whitespace-pre-line absolute bottom-0 px-2 bg-accent/80 text-nowrap truncate w-full">
			{focusedRow.addresses}
		</div>
	</div>
</div>