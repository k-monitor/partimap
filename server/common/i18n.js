const en = require('../../locales/en-server');
const hu = require('../../locales/hu-server');

module.exports = locale => {
	if (locale === 'en') { return en; }
	return hu;
};
