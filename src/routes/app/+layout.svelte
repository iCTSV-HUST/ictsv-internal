<script lang="ts">
	import { page } from '$app/state';

	const { data, children } = $props();

	import CheckIcon from 'lucide-svelte/icons/circle-check-big';
	import BookUserIcon from 'lucide-svelte/icons/book-user';
	import ListCheckIcon from 'lucide-svelte/icons/list-checks';
	import UserIcon from 'lucide-svelte/icons/user';

	const navIcons: {
		[key: string]: any;
	} = {
		'attendance-check': CheckIcon,
		'tieu-ban': BookUserIcon,
		'kd/checker': ListCheckIcon,
		profile: UserIcon
	};

	const navList = data.navList.map((r) => ({
		...r,
		icon: navIcons[r.route.replace('/app/', '')]
	}));
</script>

<div class="flex min-h-screen">
	<!-- Sidebar -->
	<aside class="w-64 lg:w-72 bg-base-200 text-base-content flex flex-col justify-between p-4">
		<nav class="navigation-sidebar">
			<h3 class="pt-0 p-4 text-xl font-semibold">Sidebar</h3>

			<ul class="flex flex-col gap-2">
				{#each navList as nav}
					<li>
						<a class:bg-primary={page.url.pathname === nav.route} href={nav.route}>
							<div class="flex gap-2 items-center">
								{#if nav.icon != null}
									<nav.icon size="1.25em" />
								{/if}
								{nav.name}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<a
			href="/logout"
			class="logout-btn text-center border-error border-2 border-opacity-50 hover:bg-error w-full"
		>
			Đăng xuất
		</a>
	</aside>

	<!-- Main content -->
	<div class="flex-1 h-screen bg-base-100 p-4">
		{@render children()}
	</div>
</div>

<style>
	.navigation-sidebar li a,
	.logout-btn {
		display: block;
		border-radius: 0.75rem;
		padding: 0.5rem 1rem; /* Padding inside menu items */
		color: #333; /* Text color */
		/*    text-decoration: none;     /* Remove underline */
		transition: background-color 0.3s ease; /* Smooth hover transition */
	}

	.navigation-sidebar li a:hover {
		background-color: oklch(var(--p));
	}
</style>
