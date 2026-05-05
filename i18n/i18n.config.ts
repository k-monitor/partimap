import de from '~/locales/de.js';
import en from '~/locales/en.js';
import es from '~/locales/es.js';
import hu from '~/locales/hu.js';
import lt from '~/locales/lt.js';
import ro from '~/locales/ro.js';

export default defineI18nConfig(() => ({
	fallbackLocale: 'en',
	legacy: false,
	messages: {
		de,
		en,
		es,
		hu,
		lt,
		ro,
	},
	warnHtmlMessage: false,
}));
