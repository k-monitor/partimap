export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'Partimap',
		htmlAttrs: {
			lang: 'hu'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
			{
				rel: 'stylesheet',
				href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
			},
			{
				rel: 'stylesheet',
				href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/fontawesome.min.css'
			}
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		{
			src: '~/plugins/highcharts.js',
			ssr: false
		},
		{
			src: '~/plugins/rating.js',
			ssr: false
		},
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		'@nuxtjs/eslint-module'
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/auth-next',
		'@nuxtjs/gtm',
		'@nuxtjs/recaptcha',
		'bootstrap-vue/nuxt',
		'vue-social-sharing/nuxt',
	],

	axios: {
		credentials: true
	},

	auth: {
		redirect: {
			home: '/admin'
		},
		strategies: {
			cookie: {}
		}
	},

	recaptcha: {
		hideBadge: true,
		siteKey: process.env.RECAPTCHA_SITE_KEY,
		version: 3,
	},

	publicRuntimeConfig: {
		axios: {
			browserBaseURL: '/'
		},
		baseURL: process.env.BASE_URL,
		gtm: {
			id: process.env.GOOGLE_TAG_MANAGER_ID
		}
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		babel: {
			presets: [
				['@nuxt/babel-preset-app', {
					useBuiltIns: 'entry',
				}]
			],
		},
		transpile: [
			'ol',
			({ isServer }) => 'vue-typeahead-bootstrap'
		],
	},

	serverMiddleware: {
		'/api': '~/server/api.js',
		'/uploads': '~/server/uploads.js',
	}
};
