import * as db from '~/server/data/maps';

export default defineEventHandler(async (event) => {
	const user = await ensureLoggedIn(event);
	return user.isAdmin ? await db.findAll() : await db.findAllByUserId(user.id);
});
