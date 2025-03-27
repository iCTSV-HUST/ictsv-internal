import { AuthService } from "$lib/auth/authService";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
    const authService = new AuthService();

    // Try to get access token from cookies
    const accessToken = await authService.getAccessTokenSilently(cookies);
    if (!accessToken) {
        console.log("NO ACCESS TOKEN???")
        console.log("NO ACCESS TOKEN???")
        console.log("NO ACCESS TOKEN???")
        console.log("NO ACCESS TOKEN???")
        console.log("NO ACCESS TOKEN???")
        console.log("NO ACCESS TOKEN???")
        console.log("NO ACCESS TOKEN???")
        console.log("NO ACCESS TOKEN???")
        throw redirect(302, "/outlook"); // Redirect to login if not authenticated
    }

    try {
        // Fetch emails using the Graph API
        const emails = await authService.getMails(accessToken);

        return {
            emails: emails.value ?? [], // Return emails array
        };
    } catch (error) {
        console.error("Error fetching emails:", error);
        throw redirect(302, "/outlook?error=fetch_failed");
    }
};