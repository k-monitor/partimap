import * as db from '~/server/data/projects';

export default defineEventHandler(async (event) => {
	const user = await ensureLoggedIn(event);
	const projects = user.isAdmin ? await db.findAll() : await db.findAllByUserId(user!.id);
	return projects.map(hideSecrets);
});
