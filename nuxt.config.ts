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
	devtools: { enabled: true },
	modules: ['@zadigetvoltaire/nuxt-gtm'],
	runtimeConfig: {
		public: {
			gtm: {
				id: env.NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || [],
				enabled: !!env.NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
				loadScript: true,
			},
		},
	},
});
