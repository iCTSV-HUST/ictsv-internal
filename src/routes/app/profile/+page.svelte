<script lang="ts">
	const { data } = $props();

	const me = data.currentMember;
</script>

<div>
	{#if me}
		<div>Tên: {me.name}</div>
		<div>MSSV: {me.usercode}</div>
		{#if me.email}
			<div>Email: {me.email}</div>
		{/if}
		<div>Mảng: {me.departments.join(', ')}</div>
		<div>Chức vụ: {me.role.name}</div>
		<div>Gen: {me.generation}</div>
	{:else}
		<span>Something wrong happened</span>
	{/if}
</div>
