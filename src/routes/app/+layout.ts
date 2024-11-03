import type { LayoutLoad } from './$types';

import { pb } from '$lib/pocketbase';
import { error, redirect } from '@sveltejs/kit';
import { currentUser } from '$lib/user.svelte';
import dayjs from 'dayjs';

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

    permission?: (user: { rank: Rank; depts: string[] }) => boolean;
};

const navList: Route[] = [
	{ 
		name: "Trang chủ",
		route: "/app",
	}, 
	{
		name: "Điểm danh", 
		route: "/app/attendance-check",
		permission: ({ rank, depts }) => depts.includes("Tiểu ban") || rank === Rank.TOPHO || rank === Rank.TOTRUONG,
		iconName: "attendance",
	},
	{
		name: "Kiểm duyệt", 
		route: "/app/kd", 
		permission: ({ depts }) => depts.includes("Mảng Kiểm duyệt"),
		iconName: "kd"
	},
	{ 
		name: "Tài khoản",
		route: "/app/profile", 
		iconName: "profile", 
	},
];

const isRouteAllowed = (route: Route) => {
	if (route.permission) {
		return route.permission({
			rank: currentUser.info.rank,
			depts: currentUser.info.department
		});
	}

	return true;
}

async function tryRefreshToken(fetch: { (input: RequestInfo | URL, init?: RequestInit): Promise<Response>; (input: RequestInfo, init?: RequestInit<RequestInitCfProperties>): Promise<Response>; (input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>; }) {
	const now = dayjs();
	if (now.diff(currentUser.lastLogin, 'minute') < 30) return;

	console.log("Refreshing token...");
	try {
		// `await pb.collection('users').authRefresh()` refreshes (and validates) the currently stored auth state with the server. It sends a POST /api/collections/users/auth-refresh request.
		await pb.collection(pb.authStore.model?.collectionName).authRefresh({fetch: fetch});	// Custom sveltekit fetch

		// Refresh user as well
		if (currentUser.tryRefresh() === false) {
			currentUser.setInfoFromRecord(await pb.collection("members").getOne(pb.authStore.model?.id, {
				expand: 'department,role',
				fields: 'id,name,usercode,expand.department.name,expand.role.name,expand.role.rank,generation',
				fetch: fetch
			}) );
		}

		currentUser.lastLogin = now.toDate();
	} catch (error: any) {
		pb.authStore.clear();
		console.error(error);
		redirect(302, '/login?message=Error logging in');
	}
}

export const load: LayoutLoad = async ({ url, fetch }) => {
	// `pb.authStore.isValid` loosely checks the current status of your AuthStore state (aka. whether it has nonemtpy token with unexpired exp claim). It doesn't perform any server-side calls or validations.
	if (!pb.authStore.isValid) {
		redirect(302, `/login?message=${url.pathname} requires authentation`);
	}

	await tryRefreshToken(fetch);

	// Check auth on current route
	const currentRoute = navList.find(r => r.route === url.pathname);
	if (currentRoute && !isRouteAllowed(currentRoute)) {
		redirect(302, `/app?message=You don't have access to ${url.pathname}`);
	}

	const allowedNavList = navList.filter(isRouteAllowed);
	// console.log(allowedNavList);
	
	return {
		navList: allowedNavList,
		message: url.searchParams.get('message'),
	}
}

export const ssr = false;