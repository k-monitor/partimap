import crypto from 'node:crypto';
import type { H3Event, SessionConfig } from 'h3';
import { StatusCodes } from 'http-status-codes';
import { env } from '~/env';

export type AuthSession = {
	id: number;
	name: string;
	isAdmin: boolean;
};

const sessionConfig: SessionConfig = {
	maxAge: 60 * 60 * 24 * 7, // 1 week
	name: 'partimap-session',
	password: env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
};

export const useAuthSession = async (event: H3Event) => {
	const session = await useSession<AuthSession>(event, sessionConfig);
	return session;
};

export const ensureLoggedIn = async (event: H3Event) => {
	const session = await useAuthSession(event);
	if (!session.data.id) {
		throw createError({
			message: 'Not Authorized',
			statusCode: StatusCodes.UNAUTHORIZED,
		});
	}
	return session.data;
};

export const ensureAdmin = async (event: H3Event) => {
	const session = await useAuthSession(event);
	if (!session.data.isAdmin) {
		throw createError({
			message: 'Not Authorized',
			statusCode: StatusCodes.UNAUTHORIZED,
		});
	}
	return session.data;
};

export const ensureAdminOr = (event: H3Event, cond: (context: Object) => boolean) => {
	return cond(event.context) ? {} : ensureAdmin(event);
};
