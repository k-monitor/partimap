<script setup lang="ts">
import { env } from '~/env';

// TODO modals?
// TODO toasts?

const i18nHead = useLocaleHead({
	addSeoAttributes: {
		canonicalQueries: ['foo'],
	},
});
const { t } = useI18n();

useHead({
	htmlAttrs: {
		lang: i18nHead.value.htmlAttrs!.lang,
	},
	link: [
		{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
		...(i18nHead.value.link || []),
	],
	meta: [
		{ name: 'description', content: t('meta.description') },
		{ property: 'og:image', content: `${env.NUXT_PUBLIC_BASE_URL}/ogimage.png` },
		...(i18nHead.value.meta || []),
	],
	title: 'PARTIMAP',
	titleTemplate: '%s | PARTIMAP',
});
</script>

<template>
	<div
		id="app"
		class="bg-light d-flex flex-column"
	>
		<NuxtPage />
	</div>
</template>

<style lang="scss">
@import '../node_modules/bootstrap/scss/functions';
@import '../node_modules/bootstrap/scss/variables';
@import '../node_modules/bootstrap/scss/mixins';

html,
body,
#__nuxt,
#app {
	height: 100%;
	min-height: 100%;
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
}

.vue-star-rating-star:not(:first-child) {
	margin-left: 0.5rem;
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
