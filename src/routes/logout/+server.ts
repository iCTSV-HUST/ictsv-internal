import { authLogout } from "$lib/server/auth/authService";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

function addMessage(url: string, message: string) {
	return encodeURI(url + "?message=" + message)
}

export const GET: RequestHandler = async ({ cookies, locals }) => {
    await authLogout(cookies);
    locals.currentUser = null;

    redirect(303, addMessage('/login', 'Đã đăng xuất'));
};