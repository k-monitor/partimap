import { defineNuxtConfig } from 'nuxt/config'; // Yes, we need explicit import as we use this file outside Nuxt context.

const BUILD_TIME_BASE_URL = process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
			baseUrl: BUILD_TIME_BASE_URL,
			gdprBlockFrom: new Date(
				process.env.NUXT_PUBLIC_GDPR_BLOCK_FROM || '2027-01-01T00:00:00Z',
			).toISOString(),
			gtm: {
				id: process.env.NUXT_PUBLIC_GTM_ID || 'GTM-UNDEFINED',
			},
		},
	},
	telemetry: false,
	// module settings
	socialShare: {
		baseUrl: BUILD_TIME_BASE_URL,
	},
	i18n: {
		baseUrl: BUILD_TIME_BASE_URL,
		defaultLocale: 'hu',
		detectBrowserLanguage: {
			redirectOn: 'no prefix',
		},
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
				'ol/Feature',
				'ol/format',
				'ol/geom/Point',
				'ol/layer/Vector',
				'ol/proj',
				'ol/source/Vector',
				'ol/style',
				'ol/style/Circle',
				'slugify',
				'tinycolor2',
				'word-wrap',
			],
		},
	},
});
