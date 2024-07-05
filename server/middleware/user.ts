import { env } from '~/env';
import { type User, findById } from '~/server/data/users';

declare module 'h3' {
	interface H3EventContext {
		user?: User;
	}
}

export default defineEventHandler(async (event) => {
	if (!getCookie(event, env.SESSION_NAME)) return;

	const { data } = await useAuthSession(event);
	if (!data.userId) return;

	const user = await findById(data.userId);
	if (!user || !user.active) return;

	event.context.user = user;
});
