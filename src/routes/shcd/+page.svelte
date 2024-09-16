<script lang="ts">
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import dayjs from 'dayjs';

	let storage: { [key: string]: { 
		imgSrc: string;
		coords: number[][];
		addresses: string;
	}} = {};

	let fetchedImageSrc: string | null = $state(null);
	let mssv = $state("");

	let marker_coords = $state<number[][]>([]);
	let addresses = $state('');

	let isLoading: boolean = $state(false);

	async function fetchImage() {
		if (!mssv) {
			return;
		}

		fetchedImageSrc = null;
		marker_coords = [];
		addresses = "";

		// Caching data
		if (mssv in storage) {
			fetchedImageSrc = storage.mssv.imgSrc;
			marker_coords = storage.mssv.coords;
			addresses = storage.mssv.addresses;

			return;
		}

		isLoading = true;


		try {
			const [response, checkinResponse] = await Promise.all([
				await fetch(`/shcd/${mssv}`),
				await fetch(`/shcd/${mssv}/checkin`, {
					method: 'GET',
				}),
			]);

			if (response.ok) {
				const blob = await response.blob();
				fetchedImageSrc = URL.createObjectURL(blob);				
			} else {
				toast.error("Không có ảnh!");
			}

			type CheckinType = { 
				Longitude: number; 
				Latitude: number; 
				CheckInTime: string; 
				CheckInAddress: string; 
			};

			if (checkinResponse.ok) {
				const checkinResult: { UserCheckInActivityLst: CheckinType[] } = await checkinResponse.json();

				checkinResult.UserCheckInActivityLst.forEach((checkin) => {
					// const newObj: CheckinType = {
					// 	time: checkin.CheckInTime,
					// 	coords: [checkin.Longitude, checkin.Latitude]
					// };

					marker_coords.push([checkin.Longitude, checkin.Latitude]);
					addresses += dayjs(checkin.CheckInTime, "YYYY-MM-DD HH:mm:ss").format("DD/MM HH:mm") + " - " + checkin.CheckInAddress + "\n";
				});
			} else {
				toast.error("Không có checkin!");
			}


			// Saving data
			storage.mssv = {
				imgSrc: fetchedImageSrc ?? "",
				coords: marker_coords,
				addresses: addresses,
			}
			
		} catch (e) {
			console.error('Error:', e);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		return () => {
			// Clean up object URL on component unmount
			if (fetchedImageSrc) {
				URL.revokeObjectURL(fetchedImageSrc);
			}
		};
	});

	let clipboardEnabled = $state(false);
	function pasteFromClipboard() {
		if (clipboardEnabled) {
			navigator.clipboard.readText().then(clipText => mssv = clipText );
		}
	}

	import Map from './map/Map.svelte';
</script>


<div class="w-screen h-screen flex flex-col justify-center items-center gap-2 cursor-default" 
	onclick={pasteFromClipboard} onkeydown={pasteFromClipboard} role="button" tabindex="0">

<!-- 	<div class="flex items-center gap-2">
		Enable paste on click
		<input type="checkbox" bind:checked={clipboardEnabled} class="toggle toggle-primary border-2" />
	</div> -->

	<div class="join rounded-xl">
		<span class="join-item btn btn-primary">MSSV</span>
		<input class="join-item input input-bordered input-primary border-2" 
			type="text" placeholder="2024....."
			bind:value={mssv}  onchange={fetchImage} disabled={isLoading} />
	</div>

	<div class="grid grid-cols-2 h-[70vh] w-full lg:w-[80%] bg-base-content rounded-xl">
		<div class="col-span-1 p-2 h-[70vh]">
			{#if isLoading}
				<span class="loading loading-spinner loading-lg text-primary"></span>
			{:else if fetchedImageSrc}
				<img class="object-contain h-full" src={fetchedImageSrc} alt="Fetched" />
			{/if}
		</div>

		<div class="col-span-1 p-1 relative h-[70vh] w-full">
			<Map markerPoints={marker_coords}/>
			<div class="whitespace-pre-line absolute bottom-0 px-2 bg-accent/80 text-nowrap truncate w-full">
				{addresses}
			</div>
		</div>
	</div>
</div>
