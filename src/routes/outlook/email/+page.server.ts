import { AuthService } from "$lib/auth/authService";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const authService = new AuthService();

    // Try to get access token silently
    let accessToken = await authService.getAccessTokenSilently(cookies);

    // If silent auth fails, require user login
    if (!accessToken) {
        return { requiresLogin: true };
    }

    // Fetch user emails
    const emails = await authService.getMails(accessToken);
    
    return { emails };
};