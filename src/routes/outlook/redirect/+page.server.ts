import { AuthService } from "$lib/auth/authService";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ url, cookies }) => {
    const authService = new AuthService();

    const code = url.searchParams.get("code");
    if (!code) {
        throw redirect(302, "/outlook?error=missing_code");
    }

    await authService.handleCallback(code, cookies);
    console.log("GOOD ENOUGH NO ERROR!")
    redirect(302, "/outlook/dashboard");
};
