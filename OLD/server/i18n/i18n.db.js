const db = require('../db');

async function getValue(lang, key) {
	const rows = await db.query(
		'SELECT value FROM i18n WHERE lang = ? AND `key` = ?',
		[lang, key]
	);
	return rows.length ? rows[0].value : null;
}

function setValue(lang, key, value) {
	return db.query('REPLACE i18n (lang, `key`, value) VALUES (?, ?, ?)', [
		lang,
		key,
		value,
	]);
}

module.exports = {
	getValue,
	setValue,
};
