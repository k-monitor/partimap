import type { PublicUser } from '~/server/data/users';

export default defineEventHandler(async (event) => {
	if (!event.context.user) return {};

	const u: PublicUser = {
		id: event.context.user.id,
		email: event.context.user.email,
		name: event.context.user.name,
		isAdmin: event.context.user.isAdmin,
	};
	return u;
});
