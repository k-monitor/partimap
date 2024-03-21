import * as db from '~/server/data/maps';

export default defineEventHandler(async (event) => {
	await ensureLoggedIn(event);

	const maps = event.context.user!.isAdmin
		? await db.findAll()
		: await db.findAllByUserId(event.context.user!.id);
	return maps;
});
