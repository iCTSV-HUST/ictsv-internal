<script lang='ts'>
	const { depts, short = false }: {
		depts: string[];
		short?: boolean;
	} = $props();

	type StringMap = { [key: string]: { class: string; short: string } };

	const deptMatcher: StringMap = {
		"Mảng Kiểm duyệt":   { class: "badge-success",   short: "KD" },
		"Mảng Truyền thông": { class: "badge-secondary", short: "TT" },
		"Mảng Sự kiện":      { class: "badge-accent",    short: "SK" },
		"Mảng Hậu cần":      { class: "badge-primary",   short: "HC" },
		"Tiểu ban":          { class: "badge-info",      short: "TB" },
	}

	function getClass(dept: string) {
		return deptMatcher[dept].class || "";
	}

	function getName(dept: string) {
		if (!short) return dept;
		return deptMatcher[dept].short || "";
	}
</script>


<span class={"badge " + getClass(depts[0])}>{getName(depts[0])}</span>
{#if depts[1]}
	<span class={"badge " + getClass(depts[1])}>{getName(depts[1])}</span>
{/if}
