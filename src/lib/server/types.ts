export const roleMap: Record<string, { name: string; level: number }> = {
	dev: { name: 'Developer', level: -1 },
	president: { name: 'Tổ trưởng', level: 1 },
	topho: { name: 'Tổ phó', level: 2 },
	tt: { name: 'Tổ viên Thường trực', level: 3 },
	ttmr: { name: 'Tổ viên Thường trực mở rộng', level: 4 },
	tv: { name: 'Tổ viên', level: 5 },
	ctv: { name: 'Cộng tác viên', level: 6 }
};
