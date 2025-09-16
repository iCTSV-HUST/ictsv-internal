import { db } from '../db';
import { sessionsTable } from '../schema';
import { eq, lt } from 'drizzle-orm';

export async function createSession(data: {
	id: string;
	memberId: number;
	expiresAt: Date;
	ipAddress?: string;
	userAgent?: string;
}) {
	const [session] = await db.insert(sessionsTable).values(data).returning();
	return session;
}

export async function findSessionById(sessionId: string) {
	const [session] = await db
		.select()
		.from(sessionsTable)
		.where(eq(sessionsTable.id, sessionId))
		.limit(1);
	return session;
}

export async function deleteSession(sessionId: string) {
	await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
}

export async function deleteExpiredSessions() {
	await db.delete(sessionsTable).where(lt(sessionsTable.expiresAt, new Date()));
}

export async function deleteMemberSessions(memberId: number) {
	await db.delete(sessionsTable).where(eq(sessionsTable.memberId, memberId));
}
