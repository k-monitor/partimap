import crypto from 'node:crypto';
import type { H3Event, SessionConfig } from 'h3';
import { StatusCodes } from 'http-status-codes';
import { env } from '~/env';

export type AuthSession = {
	userId: number;
};

const sessionConfig: SessionConfig = {
	maxAge: 60 * 60 * 24 * 7, // 1 week
	name: env.SESSION_NAME,
	password: env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
};

export const useAuthSession = async (event: H3Event) => {
	const session = await useSession<AuthSession>(event, sessionConfig);
	return session;
};

export const updateSessionExpiration = (event: H3Event) => {
	const cookie = getCookie(event, sessionConfig.name!);
	if (!cookie) return;
	setCookie(event, sessionConfig.name!, cookie, {
		expires: new Date(Date.now() + 1000 * sessionConfig.maxAge!),
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: !import.meta.dev,
	});
};

export const ensureLoggedIn = async (event: H3Event) => {
	if (!event.context.user?.id) {
		throw createError({ statusCode: StatusCodes.UNAUTHORIZED });
	}
	return event.context.user;
};

export const ensureAdmin = async (event: H3Event) => {
	if (!event.context.user?.isAdmin) {
		throw createError({ statusCode: StatusCodes.FORBIDDEN });
	}
	return event.context.user;
};

export const ensureAdminOr = async (event: H3Event, userId: number) => {
	if (!event.context.user?.isAdmin && event.context.user?.id !== userId) {
		throw createError({ statusCode: StatusCodes.FORBIDDEN });
	}
	return event.context.user;
};
