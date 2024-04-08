export default {
	css: [
		'~/assets/animate.min.css',
		'~/assets/branding.scss',
		'~/assets/lightbox.scss',
	],
	plugins: [
		{
			src: '~/plugins/highcharts.js',
			ssr: false,
		},
		{
			src: '~/plugins/rating.js',
			ssr: false,
		},
	],
	modules: [
		//'vue-social-sharing/nuxt',
	],
};
