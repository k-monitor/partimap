import * as db from '~/server/data/users';

export default defineEventHandler(async (event) => {
	await ensureLoggedIn(event);
	await ensureAdmin(event);

	const users = await db.findAll();
	const emails = users
		.filter((user) => user.active && user.consent25Aug)
		.map((user) => user.email)
		.join('\n');

	const filename = `partimap-emails-${new Date()
		.toISOString()
		.slice(2, 16)
		.replace(/[-T:]/g, '')
		.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1$2$3-$4$5')}.txt`;

	setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
	setResponseHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`);

	return emails;
});
