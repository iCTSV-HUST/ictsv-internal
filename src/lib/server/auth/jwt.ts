import { SignJWT, jwtVerify } from 'jose';
import { JWT_SECRET as JWT_SECRET_ENV } from '$app/env/private';
import type { PermissionCheckMember, RoleId } from '#lib/types';

// Secret for signing JWTs
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_ENV);

export async function createAccessToken(member: PermissionCheckMember) {
	return await new SignJWT({
		id: member.id,
		roleId: member.roleId,
		departments: member.departments,
		active: member.active
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime('1h') // short-lived so refresh token can be used
		.sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return payload as PermissionCheckMember;
	} catch {
		return null;
	}
}
