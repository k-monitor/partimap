import en from '~/locales/en.js';
import es from '~/locales/es.js';
import hu from '~/locales/hu.js';
import lt from '~/locales/lt.js';

export default defineI18nConfig(() => ({
	fallbackLocale: 'en',
	legacy: false,
	messages: {
		en,
		es,
		hu,
		lt,
	},
}));
