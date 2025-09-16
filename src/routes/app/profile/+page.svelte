<script lang="ts">
	import { currentUser } from '$lib/user.svelte';

	const myUser = currentUser.info;
</script>

<div>
	{#if myUser}
		<div>Tên: {myUser.name}</div>
		<div>MSSV: {myUser.usercode}</div>
		{#if myUser.email}
			<div>Email: {myUser.email}</div>
		{/if}
		<div>Mảng: {myUser.department.join(', ')}</div>
		<div>Chức vụ: {myUser.role}</div>
		<div>Gen: {myUser.generation}</div>
	{:else}
		<span>Something wrong happened</span>
	{/if}
</div>
