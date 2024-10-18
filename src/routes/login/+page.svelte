<script lang='ts'>
	import type { ClientResponseError } from 'pocketbase';

	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';

	import { validateData } from "$lib/utils";
	import { loginUserSchema } from "$lib/schemas";
	import { pb } from '$lib/pocketbase';

	import EmailIcon from 'lucide-svelte/icons/mail';
	import KeyIcon from 'lucide-svelte/icons/key-round';
	import InputLabel from './InputLabel.svelte';

	let loading = $state(false);

	let form = $state({
		email: "",
		password: "",
	});

	async function handleSubmit(event: { preventDefault: () => void; target: any; }) {
		event.preventDefault(); // Prevents the default form submission behavior
		loading = true;

		const { formData, errors } = await validateData(
			{
				email: form.email,
				password: form.password
			},
			loginUserSchema,
		);

		if (errors) {
			toast.error(errors.fieldErrors.toString());
			loading = false;
			return;
		}

		try {
			await pb
				.collection("members")
				.authWithPassword(formData.email.toLowerCase(), formData.password);

			goto('/app?message="logged in successfully"');
		} catch (e) {
			const err = e as ClientResponseError;
			console.log("Error: ", err);
			toast.error(err.message);
		}

		form.password = "";
		loading = false;
	}
</script>

<div class="flex flex-col items-center h-full w-full">
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Login to your account
	</h2>
	<form class="flex flex-col items-center space-y-2 w-96 pt-4"
		onsubmit={handleSubmit} 
	>
		<InputLabel >
			<EmailIcon width="1.5rem"/>
			<input type="email"		bind:value={form.email}
				name="email" required autocomplete="email"
				placeholder="Email" class="grow" disabled={loading}/>
		</InputLabel>

		<InputLabel > <!-- error={form?.errors?.password} -->
			<KeyIcon width="1.5rem"/>
			<input type="password"	bind:value={form.password}
				name="password" required autocomplete="current-password" 
				placeholder="Password" class="grow" disabled={loading}/>
		</InputLabel>

		<div class="w-full max-w-lg pt-2">
			<button type="submit" class="btn btn-primary w-full" disabled={loading}>Login</button>
		</div>
	</form>
</div>
