import type { PublicUser } from '~/server/data/users';

export default defineEventHandler(async (event) => {
	if (!event.context.user) return {};

	const u: PublicUser = {
		id: event.context.user.id,
		email: event.context.user.email,
		isAdmin: event.context.user.isAdmin,
		fullName: decryptField(event.context.user.eFullName) || event.context.user.name,
	};
	return u;
});
