<script lang="ts">
	import toast from 'svelte-french-toast';

	import { kdData } from './kddata.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props();

	let TestURL = $state('');
	let urlProblematic = $state(true);

	function parseTestURL() {
		try {
			let addr = new URL(TestURL);
			let params = new URLSearchParams(addr.search);

			const AId = params.get('AId') ?? '';
			kdData.TokenCode = params.get('TokenCode') ?? '';
			kdData.AId = AId;
			kdData.UserName = params.get('UserName') ?? '';

			if (kdData.UserName !== data.currentUserCode) {
				console.error(kdData.UserName, data.currentUserCode);
				throw Error('UserName and current UserCode are not the same');
			}

			urlProblematic = false;
		} catch (err) {
			toast.error('Invalid URL', { position: 'top-center' });
			console.error(err);
			urlProblematic = true;
		}
	}

	function goToChecker() {
		goto(`/app/kd/checker/${kdData.AId}`);
	}
</script>

<div class="join w-full">
	<!--   <input class="input input-bordered join-item" placeholder="Email" />
	<button class="btn join-item rounded-r-full">Subscribe</button> -->

	<span class="join-item bg-base-300 px-4 flex items-center whitespace-nowrap">URL ảnh</span>
	<!-- bg-base-300 px-4 flex items-center  -->

	<input
		class="join-item input input-bordered w-80"
		type="text"
		bind:value={TestURL}
		onchange={parseTestURL}
		placeholder="https://ctsv.hust.edu.vn/api-t/UploadFile/CTSV/Download?User. . ."
	/>

	<button
		class="join-item btn btn-primary"
		disabled={!TestURL || urlProblematic}
		onclick={goToChecker}
	>
		Bắt đầu duyệt
	</button>
</div>
