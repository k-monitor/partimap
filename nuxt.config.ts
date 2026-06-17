import { defineNuxtConfig } from 'nuxt/config'; // Yes, we need explicit import as we use this file outside Nuxt context.
import { env } from './env';

export default defineNuxtConfig({
	compatibilityDate: '2025-06-17',
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
		'@stefanobartoletti/nuxt-social-share',
		'@vueuse/nuxt',
		'@zadigetvoltaire/nuxt-gtm',
		'nuxt-highcharts',
		'nuxt-scheduler',
		'nuxt-tiptap-editor',
		'@nuxt/eslint',
		'@nuxt/scripts',
		'@nuxtjs/turnstile',
	],
	runtimeConfig: {
		public: {
			baseUrl: env.NUXT_PUBLIC_BASE_URL,
			gtm: {
				id: env.NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || [],
				enabled: !!env.NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
				loadScript: true,
			},
		},
		turnstile: {
			secretKey: env.NUXT_TURNSTILE_SECRET_KEY,
		},
	},
	socialShare: {
		baseUrl: env.NUXT_PUBLIC_BASE_URL,
	},
	telemetry: false,

	// module settings
	i18n: {
		baseUrl: env.NUXT_PUBLIC_BASE_URL,
		bundle: {
			optimizeTranslationDirective: false,
		},
		defaultLocale: 'hu',
		compilation: {
			strictMessage: false,
		},
		locales: [
			{ code: 'hu', language: 'hu-HU', name: 'Magyar' },
			{ code: 'en', language: 'en-GB', name: 'English' },
			{ code: 'de', language: 'de-DE', name: 'Deutsch' },
			{ code: 'es', language: 'es-ES', name: 'Español' },
			{ code: 'lt', language: 'lt-LT', name: 'Lietuvių' },
			{ code: 'ro', language: 'ro-RO', name: 'Română' },
		],
		strategy: 'prefix',
		vueI18n: 'i18n.config.ts',
	},
	tiptap: {
		prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
	},
	turnstile: {
		siteKey: env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
	},
	vite: {
		optimizeDeps: {
			include: [
				'@tiptap/extension-text-align',
				'@tiptap/extension-youtube',
				'basiclightbox',
				'bootstrap-vue-next/components/BAlert',
				'bootstrap-vue-next/components/BButton',
				'bootstrap-vue-next/components/BCard',
				'bootstrap-vue-next/components/BCollapse',
				'bootstrap-vue-next/components/BContainer',
				'bootstrap-vue-next/components/BDropdown',
				'bootstrap-vue-next/components/BFormCheckbox',
				'bootstrap-vue-next/components/BFormGroup',
				'bootstrap-vue-next/components/BFormInput',
				'bootstrap-vue-next/components/BFormRadio',
				'bootstrap-vue-next/components/BFormSelect',
				'bootstrap-vue-next/components/BFormTextarea',
				'bootstrap-vue-next/components/BInputGroup',
				'bootstrap-vue-next/components/BListGroup',
				'bootstrap-vue-next/components/BNav',
				'bootstrap-vue-next/components/BNavbar',
				'bootstrap-vue-next/components/BOverlay',
				'bootstrap-vue-next/components/BProgress',
				'bootstrap-vue-next/components/BSpinner',
				'bootstrap-vue-next/composables/useModalController',
				'bootstrap-vue-next/composables/useToastController',
				'copy-to-clipboard',
				'file-saver',
				'html-entities',
				'jsonrepair',
				'markdown-it-attrs',
				'markdown-it',
				'nanoid',
				'ol/extent',
				'ol/format',
				'ol/proj',
				'ol/style',
				'ol/style/Circle',
				'slugify',
				'tinycolor2',
				'word-wrap',
			],
		},
	},
});
