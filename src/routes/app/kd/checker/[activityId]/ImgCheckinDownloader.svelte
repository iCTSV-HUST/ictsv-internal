<script lang="ts">
	let { disabled = false } = $props();

	import { Downloader } from './imgcheckin.svelte';
	import ProgressBar from './ProgressBar.svelte';

	const myDownloader = new Downloader();
</script>

<button
	class="join-item btn btn-success border-2"
	onclick={() => myDownloader.downloadAllImgsAndCheckins()}
	{disabled}
>
	Tải ảnh & checkin
</button>

<ProgressBar progressCurrent={myDownloader.progress} progressTotal={myDownloader.total} />
<!-- Multiplied by 2 because we have both checkin and download event -->
