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
		return {
			titleTemplate: '%s | Partimap',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content:
						'PARTIcipation MAPping, azaz részvételi térképezés - közösség erejének bevonása az infrastrukturális fejlesztési irányokba.',
				},
				{
					hid: 'og:image',
					property: 'og:image',
					content: `${this.$config.baseURL}/ogimage.png`,
				},
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
	padding-top: 5rem;
}
.help h4 {
	font-size: 1.25rem;
}
</style>
