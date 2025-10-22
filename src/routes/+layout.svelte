<script lang="ts">
	import '../app.css';

	import toast, { Toaster } from 'svelte-french-toast';

	const { data, children } = $props();

	if (data.message) {
		toast.success(data.message);
	}

	if (data.failMessage) {
		toast.error(data.failMessage);
	}
</script>

<Toaster />

<div data-theme="applered" class="overflow-hidden bg-transparent">
	{@render children()}
</div>
