import { env } from '~/env';
import { type PublicUser, findById } from '~/server/data/users';

declare module 'h3' {
	interface H3EventContext {
		user?: PublicUser;
	}
}

export default defineEventHandler(async (event) => {
	if (!getCookie(event, env.SESSION_NAME)) return;

	const { data } = await useAuthSession(event);
	if (!data.userId) return;

	const user = await findById(data.userId);
	if (!user || !user.active) return;

	event.context.user = {
		id: user.id,
		name: user.name,
		isAdmin: user.isAdmin,
	};
});
