<script lang='ts'>
    import { goto } from "$app/navigation";
</script>

<div class="container mx-auto mt-4">
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

	<button class="mt-4 btn btn-secondary" onclick={() => goto('/login')}>Đăng nhập</button>	
</div>


