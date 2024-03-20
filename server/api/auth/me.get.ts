import { PublicUser } from '~/server/data/users';

export default defineEventHandler(async (event) => {
	if (!event.context.user) return {};

	const u: PublicUser = {
		id: event.context.user.id,
		name: event.context.user.name,
		isAdmin: event.context.user.isAdmin,
	};
	return u;
});
