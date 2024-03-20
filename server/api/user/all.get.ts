import * as db from '~/server/data/users';

export default defineEventHandler(async (event) => {
	await ensureLoggedIn(event);
	await ensureAdmin(event);

	const users = await db.findAll();
	return hideSecrets(users);
});
