import type { LayoutLoad } from './$types';

import { pb } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

enum Rank {
    DEV = -1,
    CTV = 6,
    TV = 5,
    TTMR = 4,
    TT = 3,
    TOPHO = 2,
    TOTRUONG = 1,
}

type Route = {
    name: string;
    route: string;
    iconName?: string;

    permission?: (user: { rank: Rank; dept: string }) => boolean;
};

const navList: Route[] = [
	{ 
		name: "Trang chủ",
		route: "/app",
	}, 
	{
		name: "Điểm danh", 
		route: "/app/attendance-check",
		permission: ({ rank, dept }) => dept === "Tiểu ban" || rank === Rank.TOPHO || rank === Rank.TOTRUONG,
		iconName: "attendance",
	},
	{
		name: "Kiểm duyệt", 
		route: "/app/kd/", 
		permission: ({ dept }) => dept === "Mảng Kiểm duyệt",
		iconName: "kd"
	},
	{ 
		name: "Tài khoản",
		route: "/app/profile", 
		iconName: "profile", 
	},
]

export const load: LayoutLoad = async ({ url, fetch }) => {
	// `pb.authStore.isValid` loosely checks the current status of your AuthStore state (aka. whether it has nonemtpy token with unexpired exp claim). It doesn't perform any server-side calls or validations.
	if (!pb.authStore.isValid) {
		redirect(302, `/login?message=${url.pathname} requires authentation`);
	}

	try {
		// `await pb.collection('users').authRefresh()` refreshes (and validates) the currently stored auth state with the server. It sends a POST /api/collections/users/auth-refresh request.
		await pb.collection(pb.authStore.model?.collectionName).authRefresh({fetch: fetch});	// Custom sveltekit fetch

	} catch (error: any) {
		pb.authStore.clear();
		redirect(302, '/login?message=Error logging in');
	}

	// const currentUser = pb.authStore.model;
	// allowedNavList = navList.filter(route => route.permission(pb))
	console.log(pb.authStore.model);

	return {
		message: url.searchParams.get('message'),
	}
}

export const ssr = false;