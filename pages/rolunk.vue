<script setup lang="ts">
defineI18nRoute({
	paths: {
		en: '/about-us',
		es: '/sobre-nosotros',
		lt: '/apie-mus',
		de: '/ueber-uns',
	},
});

const { t } = useI18n();

useHead({
	title: t('aboutUs.title'),
});
</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<LandingFrame>
		<section class="about-section">
			<div class="about-inner">
				<!-- Intro -->
				<div class="about-intro">
					<div class="about-intro-text">
						<h1>{{ t('aboutUs.beliefTitle') }}</h1>
						<p v-html="t('aboutUs.beliefP1')" />
						<p>{{ t('aboutUs.beliefP2') }}</p>
						<p class="about-contact" v-html="t('aboutUs.contactNote')" />
						<div class="intro-arrow" aria-hidden="true">↓</div>
					</div>
					<div class="about-intro-photo">
						<div class="team-photo" />
					</div>
				</div>

				<!-- Scattered circles: blue highlights + photos intermixed -->
				<div class="scatter">
					<div class="hl-circle hl-circle-stat sc sc-stat">
						<span>{{ t('aboutUs.stat1') }}</span>
					</div>
					<div class="hl-circle hl-circle-sm sc sc-sm">
						<span>{{ t('aboutUs.hl1Title') }}</span>
					</div>
					<div class="hl-circle hl-circle-lg sc sc-lg">
						<span>{{ t('aboutUs.hl2Title') }}</span>
					</div>
					<div class="gallery-circle sc gc-1" aria-hidden="true" />
					<div class="gallery-circle sc gc-2" aria-hidden="true" />
					<div class="gallery-circle sc gc-3" aria-hidden="true" />
					<div class="gallery-circle sc gc-4" aria-hidden="true" />
					<div class="gallery-circle sc gc-5" aria-hidden="true" />
					<div class="gallery-circle sc gc-6" aria-hidden="true" />
				</div>

				<!-- Mission block -->
				<div class="mission">
					<div class="mission-circle" aria-hidden="true">
						<div class="circle" />
						<div class="circle-glow" />
					</div>
					<div class="mission-text">
						<span class="mission-eyebrow">{{ t('aboutUs.supportEyebrow') }}</span>
						<h2>{{ t('aboutUs.missionTitle') }}</h2>
						<p class="mission-note" v-html="t('aboutUs.supportNote')" />
						<p>{{ t('aboutUs.missionDesc') }}</p>
						<a href="https://tamogatas.k-monitor.hu/" target="_blank" rel="noopener" class="mission-btn">{{ t('aboutUs.supportBtn') }}</a>
					</div>
				</div>

				<!-- Decorative empty circles -->
				<div class="deco-outline deco-outline-1" aria-hidden="true" />
			</div>
		</section>
	</LandingFrame>
</template>

<style scoped>
.about-section {
	position: relative;
	padding: 4rem 2rem 6rem;
	font-family: 'Apex New', 'Segoe UI', sans-serif;
}
.about-inner {
	max-width: 1000px;
	margin: 0 auto;
	position: relative;
}

/* Links come from the translations via v-html, so they need :deep() */
.about-intro p :deep(a),
.mission-text p :deep(a) {
	color: #0055FF;
	text-decoration: underline;
	text-underline-offset: 0.15em;
}
.about-intro p :deep(a:hover),
.mission-text p :deep(a:hover) {
	text-decoration: none;
}

/* ── Intro ─────────────────────────────────────── */
.about-intro {
	display: grid;
	grid-template-columns: 1.2fr 1fr;
	gap: 3rem;
	align-items: start;
	margin-bottom: 1.5rem;
}
.about-intro h1 {
	color: #0055FF;
	font-size: clamp(2rem, 4.5vw, 3rem);
	font-weight: 500;
	margin-bottom: 1.5rem;
}
.about-intro p {
	font-size: 1.1rem;
	line-height: 1.7;
	color: #333;
	opacity: 0.9;
	margin-bottom: 1rem;
}
.about-contact {
	font-weight: 500;
}
.intro-arrow {
	color: #0055FF;
	font-size: 1.5rem;
	margin-top: 2rem;
}
.about-intro-photo {
	display: flex;
	justify-content: center;
}
.team-photo {
	position: relative;
	width: 440px;
	height: 440px;
	border-radius: 50%;
	background-image: url('/rolunk.jpg');
	background-size: cover;
	background-position: 20% center;
	overflow: hidden;
	transition: transform 0.4s ease;
}
.team-photo::after {
	content: '';
	position: absolute;
	inset: 0;
	/* Same blue cover as the gallery photos and partimaprol/Büszkeségeink discs */
	background: #0055FF40;
	transition: opacity 0.3s ease;
	pointer-events: none;
}
.team-photo:hover {
	transform: scale(1.04);
}
.team-photo:hover::after {
	opacity: 0;
}

/* ── Scattered circles (blue highlights + photos) ── */
.scatter {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 1.5rem;
	margin: 1.5rem 0 4rem;
}
.scatter .sc {
	position: relative;
	flex: 0 0 auto;
}
.hl-circle {
	background: #0055FF;
	color: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 1.5rem;
	font-weight: 500;
	box-shadow: 0 8px 32px rgba(0, 85, 255, 0.18);
}
/* Keep the text within the square that fits inside the circle so the
   lines wrap into a rounded block instead of a wide rectangle. */
.hl-circle span {
	max-width: 75%;
}
.hl-circle-stat {
	width: 275px;
	height: 275px;
	font-size: 0.95rem;
	line-height: 1.3;
}
.hl-circle-sm {
	width: 185px;
	height: 185px;
	padding: 1.1rem;
	font-size: 0.8rem;
	line-height: 1.4;
}
.hl-circle-lg {
	width: 360px;
	height: 360px;
	font-size: 1.05rem;
	line-height: 1.35;
	font-weight: 500;
}

/* ── Photo gallery circles ─────────────────────── */
.gallery-circle {
	position: relative;
	border-radius: 50%;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	overflow: hidden;
	box-shadow: 0 8px 32px rgba(0, 85, 255, 0.18);
	transition: transform 0.4s ease;
}
.gallery-circle::after {
	content: '';
	position: absolute;
	inset: 0;
	/* Blue cover like the BÜSZKESÉGEINK busses (#0055FF80) but with less opacity */
	background: #0055FF40;
	transition: opacity 0.3s ease;
	pointer-events: none;
}
.gallery-circle:hover {
	transform: scale(1.04);
}
.gallery-circle:hover::after {
	opacity: 0;
}
.gc-1 { width: 230px; height: 230px; background-image: url('/rolunk/pisti.jpg'); }
.gc-2 { width: 200px; height: 200px; background-image: url('/rolunk/1A0A6861-red.jpg'); }
.gc-3 { width: 290px; height: 290px; background-image: url('/rolunk/1A0A9461.jpg'); }
.gc-4 { width: 300px; height: 300px; background-image: url('/rolunk/dorka.jpg'); }
.gc-5 { width: 270px; height: 270px; background-image: url('/rolunk/ELTE_T%C3%A1TK_hackathon_20230512_038.JPG'); }
.gc-6 { width: 230px; height: 230px; background-image: url('/rolunk/P1067637.jpg'); }

/* ── Mission block ─────────────────────────────── */
.mission {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 6rem;
	align-items: center;
	margin-top: 4rem;
}
.mission-text {
	width: 400px;
}
.mission-eyebrow {
	display: block;
	color: #0055FF;
	font-size: 0.9rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	opacity: 0.7;
	margin-bottom: 0.5rem;
}
.mission-text h2 {
	color: #0055FF;
	font-size: clamp(2rem, 4.5vw, 3rem);
	font-weight: 500;
	margin-bottom: 1rem;
}
.mission-text p {
	font-size: 1.05rem;
	line-height: 1.7;
	color: #333;
	opacity: 0.9;
	margin-bottom: 1rem;
}
.mission-note {
	font-weight: 500;
}
.mission-btn {
	display: inline-block;
	margin-top: 0.5rem;
	background: #0055FF;
	color: #fff;
	font-size: 1.05rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	/* +0.125em top / -0.125em bottom optically centres the caps: Apex New's
	   ascent equals its cap height, so the descent space all sits below. */
	padding: calc(0.8rem + 0.125em) 2.2rem calc(0.8rem - 0.125em);
	border-radius: 2rem;
	text-decoration: none;
	border: 1.5px solid #0055FF;
	transition: background 0.2s, color 0.2s;
}
.mission-btn:hover {
	background: transparent;
	color: #0055FF;
}

/* ── Mission circle decoration ────────────────── */
.mission-circle {
	position: relative;
	width: 300px;
	height: 300px;
	margin: 0 auto;
	overflow: visible;
}
.mission-circle .circle {
	position: absolute;
	inset: 0;
	border-radius: 50%;
	background-color: #0066FF;
	background-image: url('/rolunk/DSC_7250.jpg');
	background-size: cover;
	background-position: center;
	overflow: hidden;
	z-index: 2;
}
.mission-circle .circle::after {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: 50%;
	/* Same blue cover as the gallery photos, less opacity than the busses */
	background: #0055FF40;
	pointer-events: none;
}
.mission-circle .circle-glow {
	position: absolute;
	top: -50px;
	right: -50px;
	width: 200px;
	height: 200px;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(0, 102, 255, 0.55) 0%, rgba(0, 102, 255, 0) 70%);
	filter: blur(24px);
	pointer-events: none;
	z-index: 3;
}
/* ── Decorative outline ────────────────────────── */
.deco-outline {
	position: absolute;
	border: 1.5px solid #0055FF;
	border-radius: 50%;
	pointer-events: none;
	opacity: 0.6;
}
.deco-outline-1 {
	width: 280px;
	height: 280px;
	bottom: -160px;
	right: -220px;
}

/* ── Desktop scatter: blue + photo circles intermixed ── */
@media (min-width: 1220px) {
	.scatter {
		display: block;
		position: relative;
		height: 760px;
		margin: 1.5rem 0 4rem;
	}
	.scatter .sc {
		position: absolute;
	}
	.sc-stat { left: -15%; top: 30px; }
	.gc-1 { left: 39%; top: -70px; }
	.sc-lg { left: 68%; top: 70px; }
	.gc-3 { left: 14%; top: 170px; }
	.sc-sm { left: 48%; top: 325px; }
	.gc-2 { left: -11%; top: 355px; }
	.gc-5 { left: 7%; top: 500px; }
	.gc-4 { left: 41%; top: 550px; }
	.gc-6 { left: 73%; top: 450px; }
	/* Extra gap so the mission heading clears the overflowing circles above */
	.mission { margin-top: 9rem; }
}

@media (max-width: 1220px) {
	/* minmax(0, …) rather than a bare 1fr: an fr track's automatic minimum is
	   min-content, so an item wider than the container (the 440px team photo, the
	   400px mission text) stretches the track instead of being constrained by it.
	   The grid box stays centered but the track then overflows to the right only,
	   so everything centered inside it sits right of the viewport centre. */
	.about-intro { grid-template-columns: minmax(0, 1fr); text-align: center; }
	.intro-arrow { display: none; }
	.mission {
		grid-template-columns: minmax(0, 1fr);
		/* 6rem is a column gap on desktop; stacked it would be a huge row gap. */
		gap: 2.5rem;
		text-align: center;
	}
	.mission-text { max-width: 100%; margin: 0 auto; }
	/* The circles are sized in px for the desktop scatter, where the 1000px
	   column always has room for them. Cap them at the column width here and let
	   aspect-ratio keep them round as they shrink. */
	.team-photo,
	.mission-circle,
	.scatter .sc {
		max-width: 100%;
		height: auto;
		aspect-ratio: 1;
	}
}

@media (max-width: 575px) {
	/* Narrower gutters so the circles keep as much width as possible. Matches
	   the landing page's sections. */
	.about-section { padding: 3rem 1rem 4rem; }
	/* Positioned off the right edge of .about-inner, so on a phone it only ever
	   sits outside the viewport and gets clipped. */
	.deco-outline-1 { display: none; }
}
</style>
