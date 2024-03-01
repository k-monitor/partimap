const fs = require('fs');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const { ensureAdmin } = require('../auth/middlewares');
const db = require('./i18n.db');

async function getValue(lang, key) {
	let value = await db.getValue(lang, key);
	value = (value || '').trim();
	if (!value) {
		const fn = `./locales/${lang}-${key}.default.md`;
		if (fs.existsSync(fn)) {
			value = fs.readFileSync(fn, { encoding: 'utf8' });
		}
	}
	return value;
}

router.get('/i18n/get/:lang/:key', async (req, res) => {
	const { lang, key } = req.params;
	let value = await getValue(lang, key);
	value = (value || '').trim();
	if (!value) {
		value = await getValue('en', key);
	}
	if (!value) return res.sendStatus(StatusCodes.NOT_FOUND);
	res.json({ lang, key, value });
});

router.post('/i18n/set', ensureAdmin, async (req, res, next) => {
	const { lang, key, value } = req.body;
	await db.setValue(lang, key, value);
	res.sendStatus(StatusCodes.OK);
});

module.exports = router;
