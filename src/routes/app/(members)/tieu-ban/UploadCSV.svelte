<script lang="ts">
	import UploadIcon from 'lucide-svelte/icons/upload';
	import DownloadIcon from 'lucide-svelte/icons/download';
	import Papa from 'papaparse';

	interface Props {
		onSave: (data: Member[]) => void;
	}

	export type Member = {
		id: number;
		name: string;
		roleName: string;
		usercode: string;
		generation: string;
		active: boolean;
		email: string;
		departments: string[];
	};

	interface ParsedRow {
		ten: string;
		mssv: string;
		mang: string;
		chucVu: string;
		gen: string;
		email: string;
		hasError: boolean;
		rowNumber: number;
	}

	let { onSave }: Props = $props();

	let my_modal: HTMLDialogElement | undefined = $state();
	let fileInput: HTMLInputElement | undefined = $state();
	let uploadedData: ParsedRow[] = $state([]);
	let errors: string[] = $state([]);
	let isValid = $state(false);

	const validMangs = [
		'Mảng Kiểm duyệt',
		'Mảng Truyền thông',
		'Mảng Sự kiện',
		'Mảng Hậu cần',
		'Tiểu ban'
	];

	const validChucVus = [
		'Tổ trưởng',
		'Tổ phó',
		'Tổ viên Thường trực',
		'Tổ viên Thường trực mở rộng',
		'Tổ viên',
		'Cộng tác viên'
	];

	function downloadTemplate() {
		const csvContent = 'Tên,MSSV,Mảng,Chức vụ,Gen,Email\n';
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', 'template.csv');
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				parseResults(results.data);
			},
			error: (error) => {
				errors = [`Lỗi đọc file: ${error.message}`];
				uploadedData = [];
				isValid = false;
			}
		});
	}

	function parseResults(data: any[]) {
		errors = [];
		uploadedData = [];

		data.forEach((row, index) => {
			const rowNumber = index + 2; // +2 because index starts at 0 and header is row 1
			const ten = row['Tên']?.trim() || '';
			const mssv = row['MSSV']?.trim() || '';
			const mang = row['Mảng']?.trim() || '';
			const chucVu = row['Chức vụ']?.trim() || '';
			const genStr = row['Gen']?.trim() || '';
			const email = row['Email']?.trim() || '';

			const rowErrors: string[] = [];

			// Validate required fields
			if (!ten) {
				rowErrors.push(`Dòng ${rowNumber}: Tên không được để trống`);
			}
			if (!mssv) {
				rowErrors.push(`Dòng ${rowNumber}: MSSV không được để trống`);
			}
			if (!email) {
				rowErrors.push(`Dòng ${rowNumber}: Email không được để trống`);
			}

			// Validate Mảng
			if (!validMangs.includes(mang)) {
				rowErrors.push(`Dòng ${rowNumber}: Mảng không hợp lệ "${mang}"`);
			}

			// Validate Chức vụ
			if (!validChucVus.includes(chucVu)) {
				rowErrors.push(`Dòng ${rowNumber}: Chức vụ không hợp lệ "${chucVu}"`);
			}

			// Validate Gen
			const gen = parseFloat(genStr);
			if (isNaN(gen) || !/^\d+\.\d$/.test(genStr)) {
				rowErrors.push(`Dòng ${rowNumber}: Gen phải là số thực với 1 chữ số thập phân`);
			}

			errors.push(...rowErrors);

			uploadedData.push({
				ten,
				mssv,
				mang,
				chucVu,
				gen: genStr,
				email,
				hasError: rowErrors.length > 0,
				rowNumber
			});
		});

		isValid = errors.length === 0 && uploadedData.length > 0;
	}

	function handleSave() {
		if (isValid) {
			// Map CSV data to Member type
			const members: Member[] = uploadedData.map((row, index) => ({
				id: index + 1, // Temporary ID, you may want to generate this differently
				name: row.ten,
				roleName: row.chucVu,
				usercode: row.mssv,
				generation: row.gen,
				active: true, // Default to true for new uploads
				email: row.email,
				departments: [row.mang] // Convert single department to array
			}));

			onSave(members);
			my_modal?.close();
			resetForm();
		}
	}

	function resetForm() {
		uploadedData = [];
		errors = [];
		isValid = false;
		if (fileInput) fileInput.value = '';
	}

	function closeModal() {
		resetForm();
		my_modal?.close();
	}
</script>

<button class="btn btn-sm bg-base-100 border-0" onclick={() => my_modal?.showModal()}>
	<UploadIcon />
</button>

<dialog bind:this={my_modal} class="modal">
	<div class="modal-box max-w-6xl">
		<div class="flex justify-between items-center mb-4">
			<h3 class="text-lg font-bold">Tải lên CSV</h3>
			<button class="btn btn-sm btn-outline" onclick={downloadTemplate}>
				<DownloadIcon size={16} />
				CSV Format
			</button>
		</div>

		<div class="form-control w-full mb-4">
			<input
				bind:this={fileInput}
				type="file"
				accept=".csv"
				class="file-input file-input-bordered w-full"
				onchange={handleFileUpload}
			/>
		</div>

		{#if errors.length > 0}
			<div class="alert alert-error mb-4">
				<div class="flex flex-col gap-1 text-sm">
					{#each errors as error}
						<div>{error}</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if uploadedData.length > 0}
			<div class="overflow-x-auto max-h-96 mb-4">
				<table class="table table-zebra table-pin-rows table-xs">
					<thead>
						<tr>
							<th>Tên</th>
							<th>MSSV</th>
							<th>Mảng</th>
							<th>Chức vụ</th>
							<th>Gen</th>
							<th>Email</th>
						</tr>
					</thead>
					<tbody>
						{#each uploadedData as row}
							<tr class:text-error={row.hasError}>
								<td>{row.ten}</td>
								<td>{row.mssv}</td>
								<td>{row.mang}</td>
								<td>{row.chucVu}</td>
								<td>{row.gen}</td>
								<td>{row.email}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<div class="modal-action">
			{#if isValid}
				<button class="btn btn-primary" onclick={handleSave}>Lưu</button>
			{/if}
			<button class="btn" onclick={closeModal}>Đóng</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={resetForm}>close</button>
	</form>
</dialog>
