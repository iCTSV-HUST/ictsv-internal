<script lang='ts'>
  import { download } from '$lib/utils';

	const StatusMap = ["Bị từ chối", "Chờ phê duyệt", "Được xác nhận"]

	function exportKDCSV() {
		let buffer = 'STT,Tên,MSSV,StatusName,Status,Note\n';

		for (const item of tableData.displayRows) {
			buffer += `${item.index+1},${item.FullName},${item.UserCode},`
			buffer +=`${StatusMap[item.UAStatus]},${item.UAStatus},${item.assignedStatus ?? "OK"}\n`;
		}

		download("exportedData.csv", buffer);
	}

	import DownloadIcon from 'lucide-svelte/icons/download';
  import { tableData } from './maintabledata.svelte';

</script>

<button class="btn btn-neutral" onclick={exportKDCSV}>
	<DownloadIcon size="1.5em"/>
	Export (Xuất dữ liệu)
</button>