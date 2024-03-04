import { env } from './env';

export default defineNuxtConfig({
	app: {
		head: {
			title: 'PARTIMAP',
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
				{
					rel: 'stylesheet',
					href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
				},
				{
					rel: 'stylesheet',
					href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/fontawesome.min.css',
				},
			],
		},
	},
	css: ['bootstrap/dist/css/bootstrap.min.css'],
	devtools: { enabled: true },
	modules: ['@bootstrap-vue-next/nuxt', '@nuxtjs/i18n', '@zadigetvoltaire/nuxt-gtm'],
	runtimeConfig: {
		public: {
			gtm: {
				id: env.NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || [],
				enabled: !!env.NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
				loadScript: true,
			},
		},
	},

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
