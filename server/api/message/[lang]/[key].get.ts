import fs from 'fs';
import StatusCodes from 'http-status-codes';
import { z } from 'zod';

const paramsSchema = z.object({
	lang: z.string().length(2),
	key: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { lang, key } = await getValidatedRouterParams(event, paramsSchema.parse);

	let value = await getValue(lang, key);
	if (!value) {
		value = await getValue('en', key);
	}
	if (!value) {
		setResponseStatus(event, StatusCodes.NOT_FOUND);
	}
	return { lang, key, value };
});

async function getValue(lang: string, key: string) {
	const rows = (await query('SELECT value FROM i18n WHERE lang = ? AND `key` = ?', [
		lang,
		key,
	])) as { value: string }[];
	let value = clean(rows[0]?.value);
	if (!value) {
		const fn = `./locales/${lang}-${key}.default.md`;
		if (fs.existsSync(fn)) {
			value = fs.readFileSync(fn, { encoding: 'utf8' });
			value = clean(value);
		}
	}
	return value;
}

function clean(s: string | undefined) {
	return (s || '').trim();
}
