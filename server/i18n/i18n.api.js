const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const { ensureAdmin } = require('../auth/middlewares');
const db = require('./i18n.db');

router.get('/i18n/get/:lang/:key', async (req, res) => {
	const { lang, key } = req.params;
	const value = await db.getValue(lang, key);
	if (!value) return res.sendStatus(StatusCodes.NOT_FOUND);
	res.json({ lang, key, value });
});

router.post('/i18n/set', ensureAdmin, async (req, res, next) => {
	const { lang, key, value } = req.body;
	await db.setValue(lang, key, value);
	res.sendStatus(StatusCodes.OK);
});

module.exports = router;
