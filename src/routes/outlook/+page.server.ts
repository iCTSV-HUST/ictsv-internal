import { AuthService } from "$lib/auth/authService";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
    const authService = new AuthService();

    // Try silent authentication first
    // const accessToken = await authService.getAccessTokenSilently(cookies);

    // const 

    // if (accessToken) {
    //     throw redirect(302, "/outlook/dashboard"); // Redirect to inbox page if already logged in
    // }
    const state = Math.random().toString(36).substring(2, 15);
    cookies.set('authState', state, { path: '/', httpOnly: true });

    // If not logged in, generate the Microsoft login URL
    const authUrl = await authService.getAuthUrl(state); 

    return { authUrl };
};