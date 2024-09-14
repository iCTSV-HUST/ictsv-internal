<script lang='ts'>
    import type { Snippet } from "svelte";

	let { error, children }: {
		error?: any;
		children: Snippet;
	} = $props();
</script>

<label class="w-full input input-bordered flex items-center gap-2">
	{@render children()}
</label>
{#if error}
	<span class="label-text-alt text-error">
		{error}
	</span>
{/if}