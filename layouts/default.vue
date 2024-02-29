<template>
	<div class="bg-light d-flex flex-column">
		<Nuxt />
	</div>
</template>

<script>
import Vue from 'vue';
import modals from '~/mixins/modals';
import toasts from '~/mixins/toasts';

Vue.mixin(modals);
Vue.mixin(toasts);

export default {
	head() {
		const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
		return {
			titleTemplate: '%s | PARTIMAP',
			htmlAttrs: {
				...i18nHead.htmlAttrs,
			},
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: this.$t('meta.description'),
				},
				{
					hid: 'og:image',
					property: 'og:image',
					content: `${this.$config.baseURL}/ogimage.png`,
				},
				...i18nHead.meta,
			],
			link: [...i18nHead.link],
		};
	},
};
</script>

<style lang="scss">
@import '../node_modules/bootstrap/scss/functions';
@import '../node_modules/bootstrap/scss/variables';
@import '../node_modules/bootstrap/scss/mixins';

div#__nuxt,
#__layout,
#__layout > div,
#app {
	min-height: 100vh;
}

.rich img {
	margin-bottom: 1rem;
	max-width: 100%;
}

.rich p:last-child {
	margin-bottom: 0;
}

@include media-breakpoint-up(lg) {
	.feature-list-element .rich img {
		display: block;
		margin-left: auto;
		margin-right: auto;
		max-width: 50%;
	}
}

.help h2,
.help h3,
.help h4 {
	/* fix for anchors */
	margin-top: -5rem;
	padding-top: 6rem;
}
.help h4 {
	font-size: 1.25rem;
}

.vue-star-rating-star {
	margin-top: -2px;
	margin-left: 2px;
}

[data-youtube-video] {
	position: relative;
	width: 100%;
}

[data-youtube-video]::before {
	content: '';
	display: block;
	padding-top: 56.25%;
}

[data-youtube-video] iframe {
	border: none;
	height: 100%;
	left: 0;
	position: absolute;
	top: 0;
	width: 100%;
}
</style>
