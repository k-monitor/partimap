export default {
	css: [
		'~/assets/branding.scss',
		'~/assets/lightbox.scss',
	],
	plugins: [
		{
			src: '~/plugins/highcharts.js',
			ssr: false,
		},
	],
	modules: [
		//'vue-social-sharing/nuxt',
	],
};
