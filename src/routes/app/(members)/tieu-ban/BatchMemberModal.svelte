<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { Member, RoleId } from '#lib/types';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import ClipboardIcon from '@lucide/svelte/icons/clipboard';

	interface Props {
		departmentOptions: string[];
		roleOptions: { value: string; label: string }[];
		onSuccess: (newMembers: Member[]) => void;
	}

	let { departmentOptions, roleOptions, onSuccess }: Props = $props();

	export type GridRow = {
		name: string;
		usercode: string;
		generation: string;
		department: string;
		roleId: string;
		email: string;
	};

	function createEmptyRow(): GridRow {
		return {
			name: '',
			usercode: '',
			generation: '',
			department: departmentOptions[0] || 'Mảng Sự kiện',
			roleId: 'ctv',
			email: ''
		};
	}

	let dialogEl = $state<HTMLDialogElement>();
	let isSaving = $state(false);

	let rows = $state<GridRow[]>([createEmptyRow(), createEmptyRow(), createEmptyRow()]);

	export function open() {
		dialogEl?.showModal();
	}

	export function close() {
		dialogEl?.close();
	}

	function addRow() {
		rows.push(createEmptyRow());
	}

	function addMultipleRows(count: number) {
		for (let i = 0; i < count; i++) {
			rows.push(createEmptyRow());
		}
	}

	function deleteRow(idx: number) {
		rows.splice(idx, 1);
		if (rows.length === 0) {
			rows.push(createEmptyRow());
		}
	}

	function clearEmptyRows() {
		rows = rows.filter(
			(r) => r.name.trim() || r.usercode.trim() || r.generation.trim() || r.email.trim()
		);
		if (rows.length === 0) {
			rows.push(createEmptyRow());
		}
	}

	function resetForm() {
		rows = [createEmptyRow(), createEmptyRow(), createEmptyRow()];
	}

	function handlePaste(e: ClipboardEvent, startRowIndex: number = 0) {
		const clipboardData = e.clipboardData;
		if (!clipboardData) return;

		const text = clipboardData.getData('text');
		if (!text) return;

		const lines = text.trim().split(/\r?\n/);
		// Check if it's multiple lines or tab-separated data
		if (lines.length > 1 || lines[0].includes('\t')) {
			e.preventDefault();

			const parsedRows: GridRow[] = lines.map((line) => {
				const cols = line.split('\t');
				const name = (cols[0] || '').trim();
				const usercode = (cols[1] || '').trim();
				const generation = (cols[2] || '').trim();
				let deptCandidate = (cols[3] || '').trim();
				let roleCandidate = (cols[4] || '').trim();
				const emailCandidate = (cols[5] || '').trim();

				// Smart email detection: check if cols[5], cols[3] or any column has @
				let email = '';
				const foundEmailCol = cols.find((c) => c.includes('@'));
				if (foundEmailCol) {
					email = foundEmailCol.trim();
				} else if (emailCandidate) {
					email = emailCandidate;
				}

				if (deptCandidate.includes('@')) {
					deptCandidate = '';
				}
				if (roleCandidate.includes('@')) {
					roleCandidate = '';
				}

				const department = departmentOptions.includes(deptCandidate)
					? deptCandidate
					: departmentOptions[0] || 'Mảng Sự kiện';

				const matchedRole = roleOptions.find(
					(r) =>
						r.value.toLowerCase() === roleCandidate.toLowerCase() ||
						r.label.toLowerCase() === roleCandidate.toLowerCase()
				);
				const roleId = matchedRole ? matchedRole.value : 'ctv';

				return {
					name,
					usercode,
					generation,
					department,
					roleId,
					email
				};
			});

			// If current rows are all blank, replace entirely
			const isCurrentAllEmpty = rows.every(
				(r) => !r.name.trim() && !r.usercode.trim() && !r.generation.trim() && !r.email.trim()
			);

			if (isCurrentAllEmpty) {
				rows = parsedRows;
			} else {
				rows.splice(startRowIndex, parsedRows.length, ...parsedRows);
			}

			toast.success(`Đã dán ${parsedRows.length} dòng từ clipboard!`);
		}
	}

	let validCount = $derived(
		rows.filter(
			(r) =>
				r.name.trim() &&
				r.usercode.trim() &&
				r.generation.trim() &&
				/^\d+(\.\d)?$/.test(r.generation.trim()) &&
				r.email.trim()
		).length
	);

	async function handleSave() {
		const filledRows = rows.filter(
			(r) => r.name.trim() || r.usercode.trim() || r.generation.trim() || r.email.trim()
		);

		if (filledRows.length === 0) {
			toast.error('Vui lòng nhập thông tin ít nhất một thành viên');
			return;
		}

		// Validate each filled row
		for (let i = 0; i < filledRows.length; i++) {
			const r = filledRows[i];
			if (!r.name.trim()) {
				toast.error(`Dòng ${i + 1}: Họ và tên không được để trống`);
				return;
			}
			if (!r.usercode.trim()) {
				toast.error(`Dòng ${i + 1}: MSSV không được để trống`);
				return;
			}
			if (!r.generation.trim()) {
				toast.error(`Dòng ${i + 1}: Gen không được để trống (ví dụ: 7.0)`);
				return;
			}
			if (!/^\d+(\.\d)?$/.test(r.generation.trim())) {
				toast.error(`Dòng ${i + 1}: Gen phải là số (ví dụ: 7.0 hoặc 7)`);
				return;
			}
			if (!r.email.trim()) {
				toast.error(`Dòng ${i + 1}: Email không được để trống`);
				return;
			}
		}

		// Check for duplicate usercodes in payload
		const usercodes = filledRows.map((r) => r.usercode.trim());
		const duplicates = usercodes.filter((item, index) => usercodes.indexOf(item) !== index);
		if (duplicates.length > 0) {
			toast.error(`Trùng lặp MSSV trong danh sách nhập: ${duplicates.join(', ')}`);
			return;
		}

		isSaving = true;

		try {
			const payload = {
				members: filledRows.map((r) => ({
					name: r.name.trim(),
					usercode: r.usercode.trim(),
					generation: r.generation.trim().includes('.')
						? r.generation.trim()
						: `${r.generation.trim()}.0`,
					email: r.email.trim(),
					roleId: r.roleId as RoleId,
					departments: [r.department]
				}))
			};

			const res = await fetch('/api/member/batch', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const data = (await res.json()) as { count?: number; message?: string; members?: Member[] };

			if (!res.ok) {
				throw new Error(data.message || 'Lưu thành viên thất bại');
			}

			toast.success(`Đã thêm thành công ${data.count ?? 0} thành viên!`);
			if (data.members) {
				onSuccess(data.members);
			}
			close();
			resetForm();
		} catch (err: any) {
			toast.error(err.message || 'Có lỗi xảy ra khi lưu');
		} finally {
			isSaving = false;
		}
	}
</script>

<dialog bind:this={dialogEl} class="modal">
	<div class="modal-box max-w-5xl w-11/12 p-0 overflow-hidden flex flex-col max-h-[90vh]">
		<!-- Header -->
		<div class="px-6 py-4 border-b border-base-300 bg-base-200 flex justify-between items-center">
			<div class="flex items-center gap-3">
				<div class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
					<UserPlusIcon size={20} />
				</div>
				<div>
					<h3 class="font-bold text-lg flex items-center gap-2">
						Thêm thành viên mới
					</h3>
				</div>
			</div>
			<button class="btn btn-sm btn-ghost btn-circle" onclick={close}>✕</button>
		</div>

		<div class="px-6 py-2.5 border-b border-base-300 bg-base-100 flex flex-wrap justify-between items-center gap-2 text-xs">
			<div class="flex items-center gap-2 flex-wrap">
				<button class="btn btn-xs btn-primary gap-1" onclick={addRow}>
					<PlusIcon size={14} />
					<span>1 dòng</span>
				</button>	
				<button class="btn btn-xs btn-ghost text-error" onclick={clearEmptyRows}>
					Xóa dòng trống	
				</button>
			</div>
		</div>

		<div
			class="overflow-x-auto overflow-y-auto p-4 flex-1 bg-base-100"
			onpaste={(e) => handlePaste(e, 0)}
		>
			<table class="table table-xs table-pin-rows border-separate border-spacing-0 w-full">
				<thead>
					<tr class="bg-base-300 text-xs text-base-content">
						<th class="w-10 text-center border-b border-base-300">STT</th>
						<th class="w-44 border-b border-base-300">Họ và tên <span class="text-error">*</span></th>
						<th class="w-32 border-b border-base-300">MSSV <span class="text-error">*</span></th>
						<th class="w-24 border-b border-base-300">Gen <span class="text-error">*</span></th>
						<th class="w-40 border-b border-base-300">Mảng <span class="text-error">*</span></th>
						<th class="w-36 border-b border-base-300">Chức vụ</th>
						<th class="w-56 border-b border-base-300">Email <span class="text-error">*</span></th>
						<th class="w-12 text-center border-b border-base-300">Xóa</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row, idx}
						<tr class="hover:bg-base-200/50 transition-colors">
							<td class="text-center font-mono text-xs text-base-content/60 bg-base-200/30 border-b border-base-300">
								{idx + 1}
							</td>

							<!-- Họ và tên -->
							<td class="p-1 border-b border-base-300">
								<input
									type="text"
									placeholder="Nguyễn Văn A"
									class="input input-xs input-ghost w-full focus:input-bordered focus:bg-base-100"
									bind:value={row.name}
									onpaste={(e) => handlePaste(e, idx)}
								/>
							</td>

							<!-- MSSV -->
							<td class="p-1 border-b border-base-300">
								<input
									type="text"
									placeholder="2023xxxx"
									class="input input-xs input-ghost font-mono w-full focus:input-bordered focus:bg-base-100"
									bind:value={row.usercode}
									onpaste={(e) => handlePaste(e, idx)}
								/>
							</td>

							<!-- Gen (Để trống tự nhập / dán) -->
							<td class="p-1 border-b border-base-300">
								<input
									type="text"
									placeholder="7.0"
									class="input input-xs input-ghost font-mono text-center w-full focus:input-bordered focus:bg-base-100"
									bind:value={row.generation}
									onpaste={(e) => handlePaste(e, idx)}
								/>
							</td>

							<!-- Mảng -->
							<td class="p-1 border-b border-base-300">
								<select
									class="select select-xs select-ghost w-full focus:select-bordered focus:bg-base-100"
									bind:value={row.department}
								>
									{#each departmentOptions as dept}
										<option value={dept}>{dept}</option>
									{/each}
								</select>
							</td>

							<!-- Chức vụ -->
							<td class="p-1 border-b border-base-300">
								<select
									class="select select-xs select-ghost w-full focus:select-bordered focus:bg-base-100"
									bind:value={row.roleId}
								>
									{#each roleOptions as role}
										<option value={role.value}>{role.label}</option>
									{/each}
								</select>
							</td>

							<!-- Email (Tự nhập / dán) -->
							<td class="p-1 border-b border-base-300">
								<input
									type="text"
									placeholder="@sis.hust.edu.vn"
									class="input input-xs input-ghost w-full focus:input-bordered focus:bg-base-100"
									bind:value={row.email}
									onpaste={(e) => handlePaste(e, idx)}
								/>
							</td>

							<!-- Xóa dòng -->
							<td class="p-1 text-center border-b border-base-300">
								<button
									class="btn btn-xs btn-ghost btn-square text-base-content/40 hover:text-error"
									title="Xóa dòng"
									onclick={() => deleteRow(idx)}
								>
									<Trash2Icon size={14} />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		
		<div class="px-6 py-3 border-t border-base-300 bg-base-200 flex justify-between items-center">
			<div class="flex items-center gap-2">
				<button class="btn btn-sm btn-ghost" onclick={close} disabled={isSaving}>
					Hủy bỏ
				</button>
				<button
					class="btn btn-sm btn-primary gap-2"
					onclick={handleSave}
					disabled={isSaving}
				>
					{#if isSaving}
						<span class="loading loading-spinner loading-xs"></span>
						<span>Đang lưu...</span>
					{:else}
						<span>Lưu {validCount > 0 ? `${validCount} thành viên` : ''} vào hệ thống</span>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button onclick={close}>close</button>
	</form>
</dialog>
