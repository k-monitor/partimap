<script setup lang="ts">
// TODO modals?

const { t } = useI18n();
const i18nHead = useLocaleHead({
	addSeoAttributes: {
		canonicalQueries: ['foo'],
	},
});
const {
	public: { baseUrl },
} = useRuntimeConfig();

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
		{ property: 'og:image', content: `${baseUrl}/ogimage.png` },
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
		<client-only>
			<BToastOrchestrator />
		</client-only>
	</div>
</template>

<style lang="scss">
@import '../node_modules/bootstrap/scss/functions';
@import '../node_modules/bootstrap/scss/variables';
@import '../node_modules/bootstrap/scss/mixins';

body {
	// Reverting back to Bootstrap v4's font-family:
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
		'Noto Sans', 'Liberation Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
		'Segoe UI Symbol', 'Noto Color Emoji';
}

html,
body,
#__nuxt,
#app {
	height: 100%;
	min-height: 100%;
}

a,
.btn-link {
	text-decoration: none;
}

fieldset,
.form-group {
	margin-bottom: 1rem;
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

.toast,
.toast-container,
.toast-header {
	transition: none !important;
}

.toast-header {
	border: none;
	background: none;
	color: inherit;
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
