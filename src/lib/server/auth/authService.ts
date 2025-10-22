import type { Cookies } from '@sveltejs/kit';
import { findMemberById, findMemberByUsercode, updateLastLogin } from '../db/queries/members';
import { createRefreshToken, revokeRefreshToken, verifyRefreshToken } from '../db/queries/refreshTokens';
import type { Member } from '../../types';
import { createAccessToken } from './jwt';
import { verifyPassword } from './password';

// Cookies related stuffs
export const AUTH_CONFIG = {
	accessToken: {
		maxAge: 60 * 60		// 1h
	},
	refreshToken: {
		maxAge: 7 * 24 * 60 * 60	// 7 days
	}
} as const;

const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: 'lax',
	path: '/'
} as const;

export function clearAuthCookies(cookies: Cookies) {
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });
}


export async function login(
	credentials: {
		usercode: string;
		password: string;
		ipAddress?: string;
		userAgent?: string;
	},
	cookies: Cookies
): Promise<{ member: Member; }> {
	const fullMember = await findMemberByUsercode(credentials.usercode);

	if (!fullMember) {
		throw new Error('Invalid credentials');
	}

	if (!fullMember.active && fullMember.roleId != 'dev') {
		throw new Error('Account is deactivated');
	}

	const { passwordHash, ...member } = fullMember

	const isValidPassword = await verifyPassword(credentials.password, passwordHash);

	if (!isValidPassword) {
		throw new Error('Invalid crendentials');
	}

	// JWT part
	const accessToken = await createAccessToken(member);
	const refreshToken = await createRefreshToken(
		member.id,
		credentials.ipAddress,
		credentials.userAgent
	);

	// Set cookies
	cookies.set('access_token', accessToken, {
		...COOKIE_OPTIONS,
		maxAge: AUTH_CONFIG.accessToken.maxAge
	});

	cookies.set('refresh_token', refreshToken, {
		...COOKIE_OPTIONS,
		maxAge: AUTH_CONFIG.refreshToken.maxAge
	});
	console.log("Cookie set")
	// End of JWT related part

	await updateLastLogin(member.id);

	return { member };
}

export async function refreshAccessToken(cookies: Cookies) {
	const refreshToken = cookies.get('refresh_token');

	if (refreshToken) {
		const memberId = await verifyRefreshToken(refreshToken);
		
		if (memberId) {
			const member = await findMemberById(memberId);
			
			if (member && (member.active || member.roleId === 'dev')) {
				const accessToken = await createAccessToken(member);

				cookies.set('access_token', accessToken, {
					...COOKIE_OPTIONS,
					maxAge: AUTH_CONFIG.accessToken.maxAge
				});

				return member;
			}
		}

		clearAuthCookies(cookies);
	}

	return null;
}

export async function authLogout(cookies: Cookies) {
	const refreshTokenId = cookies.get('refresh_token');
	
	if (refreshTokenId) {
		await revokeRefreshToken(refreshTokenId);
	}

	clearAuthCookies(cookies);
}
