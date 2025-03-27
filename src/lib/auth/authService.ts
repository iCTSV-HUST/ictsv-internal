import { ConfidentialClientApplication, type AuthorizationUrlRequest, type AuthorizationCodeRequest, type SilentFlowRequest, LogLevel, type AuthenticationResult, type AccountInfo } from "@azure/msal-node";
import type { Cookies } from "@sveltejs/kit";

export class AuthService {
    private msalClient: ConfidentialClientApplication;

    constructor() {
        this.msalClient = new ConfidentialClientApplication({
            auth: {
                clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
                authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
                clientSecret: import.meta.env.VITE_AZURE_CLIENT_SECRET,
            },
            system: {
                loggerOptions: {
                    loggerCallback(logLevel: LogLevel, message: string) {
                        console.log(message);
                    },
                    piiLoggingEnabled: false,
                    logLevel: LogLevel.Info,
                }
            }
        });
    }

    /** Generate Microsoft login URL */
    async getAuthUrl(state: string): Promise<string> {
        const authCodeUrlParameters: AuthorizationUrlRequest = {
            state,
            scopes: ["User.Read"],
            redirectUri: "http://localhost:5173/outlook/redirect",
        };

        console.log("GETTING URLLLLLLL!!!!!!!!!!")
        return this.msalClient.getAuthCodeUrl(authCodeUrlParameters);
    }

    /** Exchange auth code for access token and store account details */
    async handleCallback(code: string, cookies: Cookies): Promise<AuthenticationResult> {
        const tokenRequest: AuthorizationCodeRequest = {
            code,
            scopes: ["User.Read"],
            redirectUri: "http://localhost:5173/outlook/redirect",
        };

        console.log("GETTING CALLBACK!!!!!!!!!!")
        const tokenResponse: AuthenticationResult = await this.msalClient.acquireTokenByCode(tokenRequest);

        if (!tokenResponse.accessToken || !tokenResponse.account) {
            throw new Error("Failed to acquire access token or account info");
        }

        // Store access token in HTTP-only cookie (temporary storage)
        cookies.set("access_token", tokenResponse.accessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: tokenResponse.expiresOn ? Math.floor((tokenResponse.expiresOn.getTime() - Date.now()) / 1000) : 3600,
        });

        // Store full account info in cookies for silent authentication
        const accountInfo = JSON.stringify({
            homeAccountId: tokenResponse.account.homeAccountId,
            environment: tokenResponse.account.environment,
            tenantId: tokenResponse.account.tenantId,
            username: tokenResponse.account.username,
            localAccountId: tokenResponse.account.localAccountId
        });

        cookies.set("account_info", accountInfo, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return tokenResponse;
    }

    /** Try to silently acquire a new access token */
    async getAccessTokenSilently(cookies: Cookies): Promise<string | null> {
        const accountCookie = cookies.get("account_info");
        if (!accountCookie) return null;

        try {
            const account: AccountInfo = JSON.parse(accountCookie);
            const silentRequest: SilentFlowRequest = {
                account,
                scopes: ["User.Read", "Mail.Read"],
            };

            const tokenResponse = await this.msalClient.acquireTokenSilent(silentRequest);
            return tokenResponse.accessToken;
        } catch (error) {
            console.error("Silent token refresh failed:", error);
            return null;
        }
    }

    /** Get user info from Microsoft Graph API */
    async getUserInfo(accessToken: string): Promise<any> {
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            throw new Error(`Error fetching user info: ${response.status}`);
        }

        return response.json();
    }

    /** Get user's emails from Outlook */
    async getMails(accessToken: string): Promise<any> {
        const response = await fetch("https://graph.microsoft.com/v1.0/me/mailfolders/inbox/messages", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            throw new Error(`Error fetching mail info: ${response.status}`);
        }

        return response.json();
    }
}
