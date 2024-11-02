<script>
	let {
		progressCurrent = 0,
		progressTotal = 100
	} = $props();

	import { slide } from 'svelte/transition';
</script>

{#if progressCurrent >= 0 && progressCurrent < progressTotal}
<div class="flex items-center px-4 gap-2" transition:slide={{ axis: 'x'}}>
	<progress class="progress progress-success lg:w-32 w-16 h-3" value={progressCurrent} max={progressTotal}></progress>
	<span>{(progressCurrent / progressTotal * 100).toFixed(2)}%</span>
</div>
{/if}