import { error, json, type RequestHandler } from '@sveltejs/kit';
import { createMembersBatch, type NewMemberInput } from '$lib/server/db/queries/members';
import { RoleLevel, roleMap } from '$lib/types';
import { z } from 'zod';

const memberInputSchema = z.object({
	name: z.string().trim().min(1, 'Họ tên không được để trống'),
	usercode: z.string().trim().min(1, 'MSSV không được để trống'),
	generation: z.string().trim().regex(/^\d+(\.\d)?$/, 'Gen phải là số (ví dụ: 7.0 hoặc 7)'),
	email: z.string().trim().email('Email không hợp lệ'),
	roleId: z.enum(['dev', 'president', 'topho', 'tt', 'ttmr', 'tv', 'ctv']),
	departments: z.array(z.string()).min(1, 'Cần chọn ít nhất một mảng')
});

const batchInputSchema = z.object({
	members: z.array(memberInputSchema).min(1, 'Danh sách thành viên không được để trống')
});

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.currentUser;
	if (!user) {
		return error(401, 'Unauthorized');
	}

	const userLevel = roleMap[user.roleId]?.level ?? 0;
	const hasPermission =
		user.active &&
		(user.departments?.includes('Tiểu ban') || userLevel >= RoleLevel.ToPho);

	if (!hasPermission) {
		return error(403, 'Bạn không có quyền thực hiện thao tác này');
	}

	try {
		const body = await request.json();
		const parseResult = batchInputSchema.safeParse(body);
		if (!parseResult.success) {
			const firstError = parseResult.error.errors[0]?.message || 'Dữ liệu không hợp lệ';
			return error(400, firstError);
		}

		// Ensure generation has .0 format if entered as integer
		const formattedMembers: NewMemberInput[] = parseResult.data.members.map((m) => ({
			...m,
			generation: m.generation.includes('.') ? m.generation : `${m.generation}.0`
		}));

		const created = await createMembersBatch(formattedMembers);

		return json({
			success: true,
			count: created.length,
			members: created
		});
	} catch (err: any) {
		return error(400, err?.message || 'Có lỗi xảy ra khi tạo thành viên');
	}
};
