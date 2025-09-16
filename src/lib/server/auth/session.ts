import { randomBytes } from 'crypto';

export function generateSessionId(): string {
	return randomBytes(32).toString('hex');
}

export function getSessionExpiry(days: number = 7): Date {
	return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export function isSessionExpired(expiresAt: Date): boolean {
	return new Date() > expiresAt;
}
