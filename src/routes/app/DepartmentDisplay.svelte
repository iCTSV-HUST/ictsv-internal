<script lang='ts'>
	const { depts }: {
		depts: string[];
	} = $props();

	type StringMap = { [key: string]: string };

	const classMatcher: StringMap = {
		"Mảng Kiểm duyệt": "badge-success",
		"Mảng Truyền thông": "badge-secondary",
		"Mảng Sự kiện": "badge-accent",
		"Mảng Hậu cần": "badge-primary",
		"Tiểu ban": "badge-info"
	}

	function getClass(dept: string) {
		return classMatcher[dept] || "";
	}
</script>


<span class={"badge " + getClass(depts[0])}>{depts[0]}</span>
{#if depts[1]}
	<span class={"badge " + getClass(depts[1])}>{depts[1]}</span>
{/if}
