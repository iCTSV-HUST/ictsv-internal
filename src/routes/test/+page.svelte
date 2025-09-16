<script lang="ts">
	import { onMount } from 'svelte';
	// import Papa from "papaparse";

	let file: File | null = null;
	let csvData: any[] = [];
	let headers: string[] = [];
	let columnToHash: string = '';
	let saltRounds = 10;

	let outputCsv: string | null = null;

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		file = target.files?.[0] ?? null;

		if (!file) return;

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				csvData = results.data;
				headers = results.meta.fields ?? [];
				if (headers.length > 0) columnToHash = headers[0]; // default
			}
		});
	}

	async function generateHashedCsv() {
		if (!csvData.length || !columnToHash) return;

		const hashedData = await Promise.all(
			csvData.map(async (row) => {
				const value = row[columnToHash] ?? '';
				const hash = await bcrypt.hash(value, saltRounds);
				return { ...row, passwordHash: hash };
			})
		);

		// convert back to CSV
		outputCsv = Papa.unparse(hashedData);
	}

	function downloadCsv() {
		if (!outputCsv) return;
		const blob = new Blob([outputCsv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'hashed_output.csv';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<h2>CSV Password Hasher</h2>

<input type="file" accept=".csv" on:change={handleFileChange} />

{#if headers.length}
	<div>
		<label>Column to hash: </label>
		<select bind:value={columnToHash}>
			{#each headers as h}
				<option value={h}>{h}</option>
			{/each}
		</select>
	</div>

	<button on:click={generateHashedCsv}>Generate CSV with passwordHash</button>
{/if}

{#if outputCsv}
	<div>
		<h3>Download Result:</h3>
		<button on:click={downloadCsv}>Download CSV</button>
	</div>
{/if}

<style>
	input,
	select,
	button {
		margin: 0.5rem 0;
	}
</style>
