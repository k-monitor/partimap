import { env } from './env';

export default defineNuxtConfig({
	css: ['@fortawesome/fontawesome-free/css/all.min.css', 'bootstrap/dist/css/bootstrap.min.css'],
	devtools: { enabled: true },
	modules: ['@bootstrap-vue-next/nuxt', '@nuxtjs/i18n', '@zadigetvoltaire/nuxt-gtm'],
	runtimeConfig: {
		public: {
			gtm: {
				id: env.NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || [],
				enabled: !!env.NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
				loadScript: true,
			},
			recaptchaSiteKey: env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY,
		},
	},

	// module settings
	i18n: {
		baseUrl: env.NUXT_PUBLIC_BASE_URL,
		defaultLocale: 'hu',
		compilation: {
			strictMessage: false,
		},
		locales: [
			{ code: 'hu', iso: 'hu-HU', name: 'Magyar' },
			{ code: 'en', iso: 'en-GB', name: 'English' },
			{ code: 'es', iso: 'es-ES', name: 'Español' },
			{ code: 'lt', iso: 'lt-LT', name: 'Lietuvių' },
		],
		strategy: 'prefix',
		vueI18n: 'i18n.config.ts',
	},
});
