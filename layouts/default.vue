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
	head: {
		titleTemplate: '%s | Partimap',
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
</style>
