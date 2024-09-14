<script lang='ts'>
    import type { ActionData, SubmitFunction } from './$types';

	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';

	import EmailIcon from 'lucide-svelte/icons/mail';
	import KeyIcon from 'lucide-svelte/icons/key-round';
	import InputLabel from './InputLabel.svelte';

	let { form }: { 
		form: ActionData;
	} = $props();

	let loading = $state(false);

	const submitLogin: SubmitFunction = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					await update();
					break;
				case 'error':
					toast.error(result.error.message);
					break;
				default:
					await update();
			}
			loading = false;
		};
	};
</script>

<div class="flex flex-col items-center h-full w-full">
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Login to your account
	</h2>
	<form
		action="?/login"
		method="POST"
		class="flex flex-col items-center space-y-2 w-96 pt-4"
		use:enhance={submitLogin}
	>
		<InputLabel error={form?.errors?.email}>
			<EmailIcon width="1.5rem"/>
			<input type="email" name="email" required autocomplete="email" value={form?.data?.email ?? ''} 
				placeholder="Email" class="grow" disabled={loading}/>
		</InputLabel>

		<InputLabel error={form?.errors?.password}>
			<KeyIcon width="1.5rem"/>
			<input type="password" name="password" required autocomplete="current-password"
				placeholder="Password" class="grow" disabled={loading}/>
		</InputLabel>

		<div class="w-full max-w-lg pt-2">
			<button type="submit" class="btn btn-primary w-full" disabled={loading}>Login</button>
		</div>
	</form>
</div>
