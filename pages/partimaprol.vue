<script setup lang="ts">
defineI18nRoute({
	paths: {
		en: '/about-partimap',
		es: '/sobre-partimap',
		lt: '/apie-partimap',
		de: '/ueber-partimap',
	},
});

const { t } = useI18n();
const localePath = useLocalePath();

useHead({
	title: t('aboutPartimap.title'),
});
</script>

<template>
	<LandingFrame>
		<section class="ap-hero">
			<!-- <div class="ap-blob ap-blob-hero-tr" aria-hidden="true" /> -->
			<!-- <div class="ap-blob ap-blob-hero-bl" aria-hidden="true" /> -->
			<img src="/map.webp" alt="" class="ap-map" aria-hidden="true" />
			<div class="ap-hero-inner">
				<NuxtLink :to="localePath({ path: '/sugo/projekt' })" class="ap-pill ap-pill-1">{{ t('aboutPartimap.q1') }}</NuxtLink>
				<NuxtLink :to="localePath({ path: '/sugo/modszertan' })" class="ap-pill ap-pill-2">{{ t('aboutPartimap.q2') }}</NuxtLink>
				<NuxtLink :to="localePath({ path: '/sugo/kerdoiv' })" class="ap-pill ap-pill-3">{{ t('aboutPartimap.q3') }}</NuxtLink>
			</div>
		</section>

		<section class="ap-section">
			<div class="ap-blob ap-blob-1" aria-hidden="true" />
			<div class="ap-blob ap-blob-2" aria-hidden="true" />
			<div class="ap-blob ap-blob-3" aria-hidden="true" />
			<div class="ap-section-inner">
				<div class="ap-block">
					<div class="ap-block-text ap-block-text-left">
						<h2>{{ t('aboutPartimap.shortTitle') }}</h2>
						<p>{{ t('aboutPartimap.shortDesc') }}</p>
					</div>
					<div class="ap-block-deco">
						<div class="ap-disc" />
						<svg class="why-side-arrow" aria-hidden="true" viewBox="0 0 24 400" xmlns="http://www.w3.org/2000/svg">
							<line x1="12" y1="50" x2="12" y2="384" stroke="currentColor" stroke-width="1.5"/>
							<polyline points="4,374 12,385 20,374" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
						</svg>
					</div>
				</div>

				<div class="ap-gallery">
					<div class="ap-gallery-circle agc-1" aria-hidden="true" />
					<div class="ap-gallery-circle agc-2" aria-hidden="true" />
					<div class="ap-gallery-circle agc-3" aria-hidden="true" />
					<div class="ap-gallery-circle agc-4" aria-hidden="true" />
					<div class="ap-gallery-circle agc-5" aria-hidden="true" />
					<div class="ap-gallery-circle agc-6" aria-hidden="true" />
				</div>

				<div id="details" class="ap-block ap-block-reverse">
					<div class="ap-block-left-stack">
						<div class="ap-circle-outline" />
						<p class="ap-extra-text">{{ t('aboutPartimap.longDescExtra') }}</p>
					</div>
					<div class="ap-block-text">
						<h2>{{ t('aboutPartimap.longTitle') }}</h2>
						<p>{{ t('aboutPartimap.longDesc') }}</p>
					</div>
				</div>

				<div class="ap-cta">
					<div class="ap-circle-outline ap-cta-circle ap-cta-circle-left" />
					<div class="ap-circle-outline ap-cta-circle ap-cta-circle-right" />
					<p class="ap-cta-text">{{ t('aboutPartimap.interested') }}</p>
					<NuxtLink :to="localePath('/register')" class="ap-pill">{{ t('aboutPartimap.registerCta') }}</NuxtLink>
				</div>
			</div>
		</section>
	</LandingFrame>
</template>

<style scoped>
#details {
	margin-top: -4rem;
}

.ap-hero {
	position: relative;
	min-height: 380px;
	overflow: hidden;
	font-family: 'Apex New', 'Segoe UI', sans-serif;
}
.ap-map {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0.45;
}
.ap-hero-inner {
	position: relative;
	max-width: 1000px;
	min-height: 400px;
	margin: 0 auto;
	padding: 4rem 2rem;
}
.ap-pill {
	background: #0055FF;
	color: #fff;
	font-size: 1.4rem;
	font-weight: 500;
	border-radius: 999px;
	/* +0.125em top / -0.125em bottom optically centres the caps: Apex New's
	   ascent equals its cap height, so the descent space all sits below. */
	padding: calc(1.2rem + 0.125em) 2.5rem calc(1.2rem - 0.125em);
	display: inline-flex;
	align-items: center;
	width: fit-content;
	text-decoration: none;
	transition: background 0.15s ease;
}
.ap-pill:hover {
	background: #0044CC;
	color: #fff;
}
.ap-pill-1 { position: absolute; left: 10%; top: 40%; }
.ap-pill-2 { position: absolute; left: 34%; top: 70%; }
.ap-pill-3 { position: absolute; left: 56%; top: 10%; }

.ap-section {
	font-family: 'Apex New', 'Segoe UI', sans-serif;
	padding: 4rem 2rem 6rem;
	position: relative;
	overflow: hidden;
}
.ap-section-inner {
	position: relative;
	z-index: 1;
	max-width: 1000px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 5rem;
}

/* ── Background Gradient Blobs ────────────────────────── */
.ap-blob {
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
	filter: blur(80px);
	z-index: 0;
}
.ap-blob-hero-tr { width: 500px; height: 500px; top: -100px; right: -100px; background: rgba(0, 85, 255, 0.4); }
.ap-blob-hero-bl { width: 400px; height: 400px; bottom: -50px; left: -50px; background: rgba(0, 85, 255, 0.3); }
.ap-blob-1 { width: 500px; height: 400px; top: 100px; right: 20%; background: rgba(0, 85, 255, 0.3); }
.ap-blob-2 { width: 450px; height: 450px; top: 40%; left: 120px; background: rgba(0, 85, 255, 0.3); }
.ap-blob-3 { width: 300px; height: 300px; bottom: 200px; right: 280px; background: rgba(0, 85, 255, 0.4); }
.ap-block {
	display: grid;
	grid-template-columns: 1.2fr 1fr;
	gap: 3rem;
	align-items: center;
}
.ap-block-reverse {
	grid-template-columns: 1fr 1.2fr;
	align-items: start;
}
.ap-block h2 {
	color: #0055FF;
	font-size: clamp(2rem, 4vw, 2.6rem);
	font-weight: 500;
	margin-bottom: 1.2rem;
}
.ap-block p {
	font-size: 1.1rem;
	line-height: 1.75;
	color: #333;
	opacity: 0.9;
}
.ap-block-text-left h2 { color: #0055FF; }

.ap-block-deco {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 320px;
}
.ap-disc {
	position: relative;
	width: 300px;
	height: 300px;
	background-color: #0055FF;
	background-image: url('/whatis/ogimage.png');
	background-size: cover;
	background-position: center;
	border-radius: 50%;
	overflow: hidden;
	box-shadow: 0 8px 32px rgba(0, 85, 255, 0.25);
}
.ap-disc::after {
	content: '';
	position: absolute;
	inset: 0;
	background: #0055FF40;
	pointer-events: none;
}
.ap-arrow {
	position: absolute;
	top: 232px;
	left: calc(50% - 9px);
	color: #0055FF;
	font-size: 1.4rem;
}
.ap-circle-outline {
	width: 390px;
	height: 390px;
	border: 1.5px solid #0055FF;
	border-radius: 50%;
	opacity: 0.7;
}
.ap-block-left-stack {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: start;
	position: relative;
	padding-top: 4.5rem;
}
.ap-block-left-stack > .ap-circle-outline {
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(-50%, -90%);
}
.ap-extra-text {
	font-size: 0.9rem;
	line-height: 1.75;
	color: #333;
	opacity: 0.9;
	max-width: 360px;
}

/* ── Photo gallery circles ─────────────────────── */
.ap-gallery {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 1.5rem;
}
.ap-gallery-circle {
	position: relative;
	border-radius: 50%;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	overflow: hidden;
	box-shadow: 0 8px 32px rgba(0, 85, 255, 0.18);
	transition: transform 0.4s ease;
	will-change: transform;
	backface-visibility: hidden;
}
.ap-gallery-circle::after {
	content: '';
	position: absolute;
	inset: 0;
	background: #0055FF40;
	transition: opacity 0.3s ease;
	pointer-events: none;
}
.ap-gallery-circle:hover {
	transform: scale(1.04);
}
.ap-gallery-circle:hover::after {
	opacity: 0;
}
.agc-1 { width: 280px; height: 280px; background-image: url('/whatis/geojango-maps-Z8UgB80_46w-unsplash.jpg'); }
.agc-2 { width: 176px; height: 176px; background-image: url('/whatis/fak.jpg'); }
.agc-6 { width: 126px; height: 126px; background-image: url('/whatis/markus-spiske-3IEOdMrSfU8-unsplash.jpg'); }
.agc-3 { width: 240px; height: 240px; background-image: url('/whatis/nhi-d-hfhra5dsnXg-unsplash.jpg'); }
.agc-4 { width: 184px; height: 184px; background-image: url('/whatis/patrick-perkins-ETRPjvb0KM0-unsplash.jpg'); }
.agc-5 { width: 300px; height: 300px; background-image: url('/whatis/30f6fc00-bf37-40e2-8b20-4c2c74e027dd.png'); }

/* Desktop: scatter the photo circles like the rólunk page */
@media (min-width: 1500px) {
	.ap-gallery {
		display: block;
		position: relative;
		height: 620px;
		margin: 1rem 0 -2rem;
	}
	.ap-gallery-circle {
		position: absolute;
	}
	.agc-1 { left: -10%; top: -85px; }
	.agc-3 { left: 46%; top: -100px; }
	.agc-5 { left: 60%; top: 150px; }
	.agc-2 { left: 25%; top: 100px; }
	.agc-6 { left: 25%; top: -80px; }
	.agc-4 { left: 36%; top: 305px; }
}

.ap-cta {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0rem;
	margin-top: -2rem;
}
.ap-cta-circle {
	position: absolute;
	top: 50%;
	opacity: 0.5;
}
.ap-cta-circle-left {
	left: -2%;
	width: 180px;
	height: 180px;
	transform: translateY(-35%);
}
.ap-cta-circle-right {
	right: -20%;
	transform: translateY(-60%);
}
.ap-cta-text {
	color: #0055FF;
	font-size: clamp(2rem, 4vw, 2.6rem);
	font-weight: 500;
	margin-bottom: 6px;
}

@media (max-width: 1500px) {
	.ap-block-left-stack {
		padding-top: 0;
		gap: 2rem;
	}
	.ap-block-left-stack > .ap-circle-outline {
		position: static;
		transform: none;
	}
	.ap-circle-outline {
		display: none;
	}
}
.why-side-arrow {
	position: absolute;
	right: 1rem;
	top: 135%;
	transform: translateY(-50%);
	width: 24px;
	height: 400px;
	scale: 1;
	color: var(--l-blue);
	pointer-events: none;
}

@media (max-width: 1500px) {
	.ap-block,
	.ap-block-reverse {
		grid-template-columns: 1fr;
		text-align: center;
	}
	.ap-pill { font-size: 1.1rem; padding: calc(1rem + 0.125em) 2rem calc(1rem - 0.125em); }
	.why-side-arrow { display: none; }

	.ap-hero-inner {
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.ap-pill-1,
	.ap-pill-2,
	.ap-pill-3 {
		position: static;
		left: auto;
		top: auto;
		align-self: center;
	}
}
</style>
