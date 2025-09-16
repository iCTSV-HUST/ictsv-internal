<script lang="ts">
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';

	import IDIcon from 'lucide-svelte/icons/id-card';
	import KeyIcon from 'lucide-svelte/icons/key-round';
	import InputLabel from './InputLabel.svelte';

	const { data, form } = $props();

	if (form?.failMessage) {
		toast.error(data.message);
	}

	$inspect(data);

	$effect(() => {
		console.log(data.message);
	});

	let loading = $state(false);

	let formData = $state({
		usercode: '',
		password: ''
	});
</script>

<div class="flex flex-col items-center h-full w-full">
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Login to your account
	</h2>
	<form class="flex flex-col items-center space-y-2 w-96 pt-4" method="POST">
		<InputLabel>
			<IDIcon width="1.5rem" />
			<input
				type="text"
				bind:value={formData.usercode}
				name="usercode"
				required
				autocomplete="username"
				placeholder="MSSV"
				class="grow"
				disabled={loading}
			/>
		</InputLabel>

		<InputLabel>
			<!-- error={form?.errors?.password} -->
			<KeyIcon width="1.5rem" />
			<input
				type="password"
				bind:value={formData.password}
				name="password"
				required
				autocomplete="current-password"
				placeholder="Password"
				class="grow"
				disabled={loading}
			/>
		</InputLabel>

		<div class="w-full max-w-lg pt-2">
			<button
				type="submit"
				class="btn btn-primary w-full"
				disabled={loading || formData.usercode === '' || formData.password === ''}
			>
				Login
			</button>
		</div>
	</form>
</div>
