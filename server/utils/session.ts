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

export const updateSessionExpiration = (event: H3Event) => {
	const cookie = getCookie(event, sessionConfig.name!);
	if (!cookie) return;
	setCookie(event, sessionConfig.name!, cookie, {
		expires: new Date(Date.now() + 1000 * sessionConfig.maxAge!),
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: !process.dev,
	});
};

export const ensureLoggedIn = async (event: H3Event) => {
	if (getCookie(event, sessionConfig.name!)) {
		const session = await useAuthSession(event);
		if (session.data.id) return session.data;
	}
	throw createError({ statusCode: StatusCodes.UNAUTHORIZED });
};

export const ensureAdmin = async (event: H3Event) => {
	const data = await ensureLoggedIn(event);
	if (data.isAdmin) return data;
	throw createError({ statusCode: StatusCodes.FORBIDDEN });
};

export const ensureAdminOr = async (event: H3Event, cond: (context: Object) => boolean) => {
	const data = await ensureLoggedIn(event);
	if (data.isAdmin || cond(event.context)) return data;
	throw createError({ statusCode: StatusCodes.FORBIDDEN });
};
