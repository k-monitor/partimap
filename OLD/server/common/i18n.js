const en = require('../../locales/en-server');
const es = require('../../locales/es-server');
const hu = require('../../locales/hu-server');
const lt = require('../../locales/lt-server');

module.exports = locale => {
	if (locale === 'es') return es;
	if (locale === 'hu') return hu;
	if (locale === 'lt') return lt;
	return en;
};
