import en from '~/locales/en.js';
import hu from '~/locales/hu.js';

export default defineI18nConfig(() => ({
	fallbackLocale: 'en',
	legacy: false,
	messages: {
		en,
		hu,
	},
}));
