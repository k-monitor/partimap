import { z } from 'zod';

const paramsSchema = z.object({
	lang: z.string().length(2),
	key: z.string().min(1),
});

const bodySchema = z.object({
	value: z.string(),
});

export default defineEventHandler(async (event) => {
	await ensureLoggedIn(event);
	await ensureAdmin(event);

	const { lang, key } = await getValidatedRouterParams(event, paramsSchema.parse);
	const { value } = await readValidatedBody(event, bodySchema.parse);

	await query('REPLACE i18n (lang, `key`, value) VALUES (?, ?, ?)', [lang, key, value]);
});
