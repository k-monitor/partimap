import { env } from './env';

export default defineNuxtConfig({
	components: [{ path: '~/components', pathPrefix: false }],
	css: [
		'@fortawesome/fontawesome-free/css/all.min.css',
		'animate.css/animate.min.css',
		'bootstrap/dist/css/bootstrap.min.css',
	],
	devtools: { enabled: true },
	modules: [
		'@bootstrap-vue-next/nuxt',
		'@nuxtjs/i18n',
		'@vueuse/nuxt',
		'@zadigetvoltaire/nuxt-gtm',
		'nuxt-tiptap-editor',
	],
	runtimeConfig: {
		public: {
			baseUrl: env.NUXT_PUBLIC_BASE_URL,
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
	tiptap: {
		prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
	},
});
