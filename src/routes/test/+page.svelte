<script lang="ts">
	import { onMount } from 'svelte';
	const { form } = $props();

	onMount(() => {
		if (form?.processed) {
			console.log(form.processed)

			const blob = new Blob([form.processed], { type: 'text/csv;charset=utf-8;' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'hashed_output.csv';
			a.click();
			URL.revokeObjectURL(url);
		}
	})

</script>

<h2>CSV Password Hasher</h2>

<form method="POST" enctype="multipart/form-data">
	<input type="file" name="file" accept=".csv" required />

	<button type="submit" class="btn btn-primary w-full">
		Send
	</button>
</form>
