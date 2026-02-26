import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { RoleLevel, roleMap } from '$lib/types';
import { failMessageURL } from '$lib/utils';

type Route = {
	name: string;
	route: string;

	permission?: (member: {
		level: RoleLevel;
		departments: string[];
		isActive: boolean;
	}) => boolean;
};

const navList: Route[] = [
	{
		name: 'Trang chủ',
		route: '/app'
	},
	{
		name: 'Điểm danh',
		route: '/app/attendance-check',
		permission: ({ level, departments, isActive }) =>
			isActive && (departments.includes('Tiểu ban') || level >= RoleLevel.ToPho)
	},
	{
		name: 'Quản lý thành viên',
		route: '/app/tieu-ban',
		permission: ({ level, departments, isActive }) =>
			isActive && (departments.includes('Tiểu ban') || level >= RoleLevel.ToPho)
	},
	{
		name: 'Kiểm duyệt - Duyệt MC',
		route: '/app/kd/checker',
		permission: ({ departments, isActive }) =>
			isActive && departments.includes('Mảng Kiểm duyệt')
	},
	{
		name: 'Tài khoản',
		route: '/app/profile'
	}
];

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const user = locals.currentUser;

	if (!user) throw redirect(303, failMessageURL('/login', 'Người dùng chưa đăng nhập'));

	const userInfo = {
		level: roleMap[user.roleId].level,
		departments: user.departments,
		isActive: true 		// TODO: use user.active here
	};

	const currentRoute = navList.find((r) => r.route === url.pathname);
	if (currentRoute?.permission && !currentRoute.permission(userInfo)) {
		throw redirect(303, failMessageURL('/app', 'Bạn không có quyền truy cập'));
	}

	return {
		user,
		navList: navList
			.filter((r) => !r.permission || r.permission(userInfo))
			.map((r) => ({
				name: r.name,
				route: r.route
			}))
	};
};
