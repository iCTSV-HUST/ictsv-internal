import dayjs from 'dayjs';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { refreshTokensTable } from '../schema';

export async function createRefreshToken(memberId: number, ipAddress?: string, userAgent?: string) {
	const tokenId = randomUUID();
	const expiresAt = dayjs().add(7, 'day').toDate();

	await db.insert(refreshTokensTable).values({
		tokenId,
		memberId,
		ipAddress,
		userAgent,
		expiresAt
	});

	return tokenId;
}

export async function verifyRefreshToken(tokenId: string) {
	const [record] = await db
		.select({
			memberId: refreshTokensTable.memberId,
			expiresAt: refreshTokensTable.expiresAt
		})
		.from(refreshTokensTable)
		.where(eq(refreshTokensTable.tokenId, tokenId));

	if (!record) return null;
	if (dayjs(record.expiresAt).isBefore(dayjs())) {
		await db.delete(refreshTokensTable).where(eq(refreshTokensTable.tokenId, tokenId));
		return null;
	}

	return record.memberId;
}

export async function revokeRefreshToken(tokenId: string) {
	await db.delete(refreshTokensTable).where(eq(refreshTokensTable.tokenId, tokenId));
}

export async function revokeAllUserTokens(memberId: number) {
	await db.delete(refreshTokensTable).where(eq(refreshTokensTable.memberId, memberId));
}
