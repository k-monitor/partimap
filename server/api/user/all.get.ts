import * as db from '~/server/data/users';

const PAGE_SIZE = 10;

export default defineEventHandler(async (event) => {
	await ensureLoggedIn(event);
	await ensureAdmin(event);

	const { filter = '', page = '1' } = getQuery(event) as { filter?: string; page?: string };
	const pageNum = Math.max(1, parseInt(page, 10) || 1);

	const [users, total] = await Promise.all([
		db.findFiltered(filter, pageNum, PAGE_SIZE),
		db.countFiltered(filter),
	]);

	return {
		users: hideSecrets(users) as db.User[],
		total,
		pageSize: PAGE_SIZE,
	};
});
