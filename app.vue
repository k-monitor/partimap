<script setup lang="ts">
const { t } = useI18n();
const i18nHead = useLocaleHead();
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
		class="d-flex flex-column"
	>
		<NuxtPage />
		<BModalOrchestrator />
		<BToastOrchestrator />
	</div>
</template>

<style lang="scss">
@import '~/node_modules/bootstrap/scss/functions';
@import '~/node_modules/bootstrap/scss/variables';
@import '~/node_modules/bootstrap/scss/mixins';

body {
	background-color: $light;

	// Reverting back to Bootstrap v4's font-family:
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
		'Liberation Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
		'Noto Color Emoji';
}

html,
body,
#__nuxt,
#app {
	height: 100%;
	min-height: 100%;
}

.alert p:last-child,
.popover p:last-child {
	margin-bottom: 0;
}

.alert-dark {
	background-color: $gray-200 !important;
	border-color: $gray-400 !important;
	color: $gray-800 !important;
}

a:not(.btn),
.btn-link {
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
}

.btn-blue {
	@include button-variant($primary, $primary);
}

.custom-file-label::after {
	display: none !important;
}

.form-check-input {
	border-color: $gray-600;
}

.form-control[type='password'][readonly] {
	background: $input-disabled-bg;
}

fieldset,
.form-group {
	margin-bottom: 1rem;
}

.form-input-file {
	flex-grow: 1;
	width: auto;

	label.input-group-text {
		display: none;
	}
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

.modal-body {
	scrollbar-gutter: stable;
}

.ol-attribution {
	bottom: 0;
	right: 0;
}

.ol-attribution.ol-uncollapsible {
	display: none;
}

.ol-attribution button {
	$size: 2rem;
	align-items: center;
	background: $gray-900 !important;
	border: 1px solid $gray-700 !important;
	border-bottom-width: 0 !important;
	border-right-width: 0 !important;
	border-top-left-radius: 0.5rem;
	color: white !important;
	display: flex;
	font-size: 1.25rem;
	height: $size;
	justify-content: center;
	outline: none !important;
	width: $size;

	&:hover {
		background: $gray-800 !important;
		border-color: $gray-700 !important;
	}

	.ol-attribution-collapse {
		font-size: 1.5rem;
		margin-top: -3px;
	}
}

.ol-attribution ul {
	@include media-breakpoint-down(sm) {
		font-size: 10px;
	}
}

.ol-zoom {
	display: none;
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
	display: block;
	padding: 0.75rem;
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

.branded {
	.bg-primary,
	.text-bg-primary {
		background-color: var(--brand) !important;
	}

	.btn-link {
		color: var(--brand) !important;
	}

	.btn-outline-primary {
		border-color: var(--brand) !important;
		color: var(--brand) !important;

		&:active,
		&.active,
		&:focus,
		&.focus,
		&:hover {
			background-color: var(--brand) !important;
			border-color: var(--brand) !important;
			box-shadow: none !important;
			color: white !important;
		}
	}

	.btn-primary,
	.sidebar-button,
	.sidebar-button-inside {
		position: relative;

		&,
		&:active,
		&.active,
		&:disabled,
		&.disabled,
		&:focus,
		&.focus,
		&:hover {
			background-color: var(--brand) !important;
			border-color: var(--brand) !important;
			box-shadow: none !important;
			color: white !important;
		}

		&:disabled,
		&.disabled {
			opacity: 0.65;
		}

		&:hover::after {
			background: black;
			content: '';
			display: block;
			height: 100%;
			left: 0;
			opacity: 0.1;
			pointer-events: none;
			position: absolute;
			top: 0;
			width: 100%;
		}

		&:active::after,
		&.active::after,
		&:focus::after,
		&.focus::after {
			background: black;
			content: '';
			display: block;
			height: 100%;
			left: 0;
			opacity: 0.2;
			pointer-events: none;
			position: absolute;
			top: 0;
			width: 100%;
		}
	}

	.custom-control-input:focus ~ .custom-control-label::before {
		box-shadow: none !important;
		border-color: var(--brand);
	}

	.custom-control-input:focus:not(:checked) ~ .custom-control-label::before {
		border-color: var(--brand);
	}

	.custom-control-input:checked ~ .custom-control-label::before {
		background-color: var(--brand);
		border-color: var(--brand);
	}

	.custom-checkbox .custom-control-input:disabled:checked ~ .custom-control-label::before {
		background-color: var(--brand);
		border-color: var(--brand);
		opacity: 0.5;
	}

	input,
	select {
		box-shadow: none !important;

		&:active,
		&.active,
		&:focus,
		&.focus &:hover {
			border-color: unset;
		}
	}

	input[type='range']::-moz-range-thumb {
		background-color: var(--brand);
	}

	input[type='range']::-webkit-slider-thumb {
		background-color: var(--brand);
	}

	.logo img:first-of-type {
		display: none !important;
	}

	.logo img:nth-of-type(2) {
		display: block !important;
	}

	.alert-primary a,
	.rich a,
	.text-primary {
		color: var(--brand) !important;
	}
}

$basicLightbox__background: rgba(0, 0, 0, 0.8); // Background color
$basicLightbox__zIndex: 9999; // Stack order
$basicLightbox__duration: 0.4s; // Transition duration
$basicLightbox__timing: ease; // Transition timing
@import '~/node_modules/basiclightbox/src/styles/main.scss';
</style>
