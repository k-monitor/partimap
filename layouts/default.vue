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
			titleTemplate: '%s | Partimap',
			htmlAttrs: {
				...i18nHead.htmlAttrs
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
			link: [
				...i18nHead.link
			],
		};
	},
};
</script>

<style>
div#__nuxt,
#__layout,
#__layout > div,
#app {
	min-height: 100vh;
}

.rich img {
	max-width: 100%;
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
}
</style>
