<script lang='ts'>
    import { userData } from "$lib/appimportant.svelte";

	const myUser = userData.info;
</script>


<div>
	{#if myUser}
		<div>Tên: {myUser.name}</div>
		<div>MSSV: {myUser.usercode}</div>
		{#if myUser.email}
			<div>Email: {myUser.email}</div>
		{/if}
		<div>Mảng: {myUser.department.join(", ")}</div>
		<div>Chức vụ: {myUser.role}</div>
		<div>Gen: {myUser.generation}</div>
	{:else}
		<span>Something wrong happened</span>
	{/if}
</div>