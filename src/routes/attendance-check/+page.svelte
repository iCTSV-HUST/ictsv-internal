<script lang='ts'>
    import type { PageServerData} from './$types';

	import toast from 'svelte-french-toast';

	let { data }: { 
		data: PageServerData;
	} = $props();

	let loading = $state(false);
	let memberList = $state([]);

	let attendanceList = $derived.by(async () => {
		if (data) {
			memberList = await data.promises.members;
			const attendances 
		} else {
			return [];
		}
		


	});
</script>

<div class="flex ">
</div>
