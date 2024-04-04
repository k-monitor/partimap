import * as db from '~/server/data/projects';

export default defineEventHandler(async (event) => {
	await ensureLoggedIn(event);

	const projects = event.context.user!.isAdmin
		? await db.findAll()
		: await db.findAllByUserId(event.context.user!.id);
	return projects.map(hideSecrets);
});
