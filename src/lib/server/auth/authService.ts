import { findMemberByUsercode, updateLastLogin } from '../db/queries/members';
import { createSession, deleteSession, findSessionById } from '../db/queries/sessions';
import { memberPublicize } from '../types';
import { verifyPassword } from './password';
import { generateSessionId, getSessionExpiry, isSessionExpired } from './session';

export async function login(credentials: {
	usercode: string;
	password: string;
	ipAddress?: string;
	userAgent?: string;
}) {
	const member = await findMemberByUsercode(credentials.usercode);

	if (!member) {
		throw new Error('Invalid credentials');
	}

	if (!member.active && member.roleId != 'dev') {
		throw new Error('Account is deactivated');
	}

	const isValidPassword = await verifyPassword(credentials.password, member.passwordHash);

	if (!isValidPassword) {
		throw new Error('Invalid crendentials');
	}

	// Valid user, create session
	const session = await createSession({
		id: generateSessionId(),
		memberId: member.id,
		expiresAt: getSessionExpiry(7), // Expire in 7 days
		ipAddress: credentials.ipAddress,
		userAgent: credentials.userAgent
	});

	await updateLastLogin(member.id);

	return { session, member: memberPublicize(member) };
}

export async function validateSession(sessionId: string) {
	const session = await findSessionById(sessionId);

	if (!session) {
		return null;
	}

	if (isSessionExpired(session.expiresAt)) {
		await deleteSession(sessionId);
		return null;
	}

	return session;
}

export async function logout(sessionId: string) {
	await deleteSession(sessionId);
}
