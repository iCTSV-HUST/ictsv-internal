<script lang='ts'>
	import type { Snippet } from 'svelte';
	import '../app.css';

	import { Toaster } from 'svelte-french-toast';


	const { children }: {
		children: Snippet;
	} = $props();
</script>

<Toaster />


<div data-theme="applered" class="overflow-hidden bg-transparent">
  {@render children()}
</div>