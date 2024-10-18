<script lang='ts'>
	import type { ClientResponseError } from "pocketbase";
	import { appData, refreshAppData } from "$lib/appimportant.svelte";
    import { logout } from "$lib/pocketbase";
	import toast from "svelte-french-toast";

	// Get data once
	if (appData.members.length === 0) {
		toast.promise(
			refreshAppData(), {
			loading: "Loading...",
			success: "Loaded!",
			error: e => { 
				const err = e as ClientResponseError;
				console.log(err);
				return err.message;
			},
		});
	}

	import { page } from '$app/stores';

	const { data, children } = $props();
	toast.success(data.message);


	import CheckIcon from 'lucide-svelte/icons/circle-check-big';
	import UserIcon from 'lucide-svelte/icons/user';

	const navList = [
		{ name: "Trang chủ", icon: null, route: "/app"}, 
		{ name: "Điểm danh", icon: CheckIcon, route: "/app/attendance-check"},
		{ name: "Tài khoản", icon: UserIcon, route: "/app/profile"},
	]
</script>


<div class="flex min-h-screen">
	<!-- Sidebar -->
	<aside class="w-64 bg-base-200 text-base-content">
		<div class="p-4 text-xl font-semibold">
			Sidebar
		</div>
		<nav class="navigation-sidebar p-4">
			<ul class="flex flex-col gap-2">
				{#each navList as nav}
					<li><a class:bg-primary={$page.url.pathname === nav.route} href={nav.route}>
						<div class="flex gap-2 items-center">
							{#if nav.icon != null}
								<nav.icon size="1.25em"/>
							{/if}
							{nav.name}
						</div>
					</a></li>
						
				{/each}

				<li><button class="hover:bg-error w-full"
					onclick={logout}>
					Logout
				</button></li>
			</ul>
		</nav>
	</aside>

	<!-- Main content -->
	<div class="flex-1 h-screen bg-base-100 p-4">
		{@render children()}
	</div>
</div>



<style>
	.navigation-sidebar li a,button {
		display: block;
		border-radius: 0.75rem;
		padding: 0.5rem 1rem;        /* Padding inside menu items */
		color: #333;               /* Text color */
/*    text-decoration: none;     /* Remove underline */
		transition: background-color 0.3s ease; /* Smooth hover transition */
	}

	.navigation-sidebar li a:hover {
		background-color: oklch(var(--p));
	}
</style>