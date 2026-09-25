<script setup lang="ts">
defineI18nRoute({
	paths: {
		en: '/pricing',
		es: '/precios',
		lt: '/kainos',
		de: '/preise',
	},
});

const localePath = useLocalePath();
const { t, tm, rt } = useI18n();

useHead({
	title: t('pricing.title'),
});

const expanded = reactive<Record<string, boolean>>({});
function toggle(plan: string) {
	expanded[plan] = !expanded[plan];
}
</script>

<template>
	<LandingFrame>
		<section class="pricing-section">
			<div class="pricing-blob pricing-blob-1" aria-hidden="true" />
			<div class="pricing-blob pricing-blob-2" aria-hidden="true" />
			<div class="pricing-blob pricing-blob-3" aria-hidden="true" />
			<div class="pricing-outline pricing-outline-1" aria-hidden="true" />
			<div class="pricing-outline pricing-outline-2" aria-hidden="true" />
			<div class="pricing-inner">
				<h1 class="sec-title text-center">{{ t('pricing.heading') }}</h1>

				<div class="pricing-grid">
					<!-- Left: intro text -->
					<div class="pricing-intro">
						<h2>{{ t('pricing.introTitle') }}</h2>
						<p>{{ t('pricing.introP1') }}</p>
						<p v-if="t('pricing.introP2')">{{ t('pricing.introP2') }}</p>
						<NuxtLink
							:to="localePath({ name: 'register' })"
							class="btn-landing-outline pricing-intro-cta"
						>
							{{ t('pricing.introCta') }}
						</NuxtLink>
						<div class="pricing-arrow" aria-hidden="true">↓</div>
					</div>

					<!-- Plan cards -->
					<div
						v-for="plan in ['free', 'extra']"
						:key="plan"
						class="plan-card"
					>
						<div class="plan-head">
							<h3>{{ t(`pricing.${plan}.name`) }}</h3>
							<p>{{ t(`pricing.${plan}.tagline`) }}</p>
							<NuxtLink
								:to="localePath({ name: 'register' })"
								class="btn-landing-outline btn-sm"
							>
								{{ t(`pricing.${plan}.cta`) }}
							</NuxtLink>
						</div>
						<div class="plan-banner">
							<template v-if="plan === 'extra'">
								<a class="plan-banner-link" href="mailto:hello@partimap.eu">
									{{ t(`pricing.${plan}.bannerTitle`) }}
								</a>
							</template>
							<template v-else>
								{{ t(`pricing.${plan}.bannerTitle`) }}
							</template>
						</div>
						<div class="plan-body">
							<h4>{{ t(`pricing.${plan}.includesTitle`) }}</h4>
							<ul>
								<li
									v-for="(feat, i) in (tm(`pricing.${plan}.features`) as any[])"
									:key="i"
								>
									<i class="fas fa-check" />
									<span>{{ rt(feat) }}</span>
								</li>
							</ul>
							<div class="plan-divider" />
							<button
								type="button"
								class="plan-more"
								:aria-expanded="!!expanded[plan]"
								@click="toggle(plan)"
							>
								<span>{{ t('pricing.more') }}</span>
								<i
									class="fas fa-chevron-down plan-more-icon"
									:class="{ open: expanded[plan] }"
								/>
							</button>
							<div class="plan-extra" :class="{ open: expanded[plan] }">
								<div class="plan-extra-inner">
									<p v-if="t(`pricing.${plan}.details`)">
										{{ t(`pricing.${plan}.details`) }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</LandingFrame>
</template>

<style scoped>
.pricing-section {
	position: relative;
	padding: 4rem 2rem 6rem;
	/* Let decorative circles spill past the section (e.g. onto the footer).
	   Horizontal bleed is still clipped by `.landing`'s overflow-x: hidden. */
	overflow: visible;
}
.pricing-inner {
	position: relative;
	z-index: 1;
	max-width: 1100px;
	margin: 0 auto;
}

/* ── Background Gradient Blobs ────────────────────────── */
.pricing-blob {
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
	filter: blur(80px);
	z-index: 0;
}
.pricing-blob-1 { width: 500px; height: 400px; top: -80px; right: -120px; background: rgba(0, 85, 255, 0.3); }
.pricing-blob-2 { width: 450px; height: 450px; top: 45%; left: -180px; background: rgba(0, 85, 255, 0.3); }
.pricing-blob-3 { width: 300px; height: 300px; bottom: 200px; right: 6%; background: rgba(0, 85, 255, 0.4); }

/* ── Decorative circle outlines ───────────────────────── */
.pricing-outline {
	position: absolute;
	border: 1.5px solid #0055FF;
	border-radius: 50%;
	pointer-events: none;
	opacity: 0.6;
	z-index: 0;
}
.pricing-outline-1 { width: 340px; height: 340px; top: 680px; left: -30px; }
.pricing-outline-2 { width: 180px; height: 180px; bottom: 220px; right: 70px; }
@media (max-width: 1450px) {
	.pricing-outline {
		display: none;
	}
}
.sec-title {
	color: #0055FF;
	font-family: 'Apex New', 'Segoe UI', sans-serif;
	font-size: clamp(2rem, 4.5vw, 3rem);
	font-weight: 500;
	margin-bottom: 3.5rem;
	line-height: 1.15;
}

.pricing-grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 2rem;
	align-items: start;
}

.pricing-intro {
	font-family: 'Apex New', 'Segoe UI', sans-serif;
	color: #333;
	position: relative;
}
.pricing-intro h2 {
	color: #0055FF;
	font-size: 1.7rem;
	font-weight: 500;
	margin-bottom: 1.2rem;
}
.pricing-intro p {
	font-size: 1.05rem;
	line-height: 1.7;
	opacity: 0.85;
	margin-bottom: 1rem;
}
.pricing-intro-cta {
	margin-top: 1rem;
}
.pricing-arrow {
	color: #0055FF;
	font-size: 1.5rem;
	margin-top: 3rem;
}

.plan-card {
	border: 1.5px solid #0055FF;
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.55);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	min-height: 520px;
}
.plan-head {
	text-align: center;
	padding: 2rem 1.5rem 1.5rem;
}
.plan-head h3 {
	color: #0055FF;
	font-family: 'Apex New', 'Segoe UI', sans-serif;
	font-size: 1.4rem;
	font-weight: 700;
	margin-bottom: 1rem;
}
.plan-head p {
	font-family: 'Apex New', 'Segoe UI', sans-serif;
	font-size: 0.95rem;
	line-height: 1.6;
	color: #444;
	margin-bottom: 1.5rem;
}
.plan-banner {
	background: #0055FF;
	color: #fff;
	text-align: center;
	padding: 0.7rem 1rem;
	font-family: 'Apex New', 'Segoe UI', sans-serif;
	font-size: 0.95rem;
	font-weight: 500;
	letter-spacing: 0.05em;
}
.plan-banner-link {
	display: block;
	color: #fff;
	font-weight: 700;
	text-decoration: none;
}
.plan-banner-link:hover {
	color: #fff;
	text-decoration: underline;
}
.plan-body {
	padding: 1.5rem 1.8rem 1.8rem;
	font-family: 'Apex New', 'Segoe UI', sans-serif;
	display: flex;
	flex-direction: column;
	flex: 1;
}
.plan-body h4 {
	color: #333;
	font-size: 1.1rem;
	font-weight: 700;
	margin-bottom: 1rem;
}
.plan-body ul {
	list-style: none;
	padding: 0;
	margin: 0 0 1.5rem 0;
}
.plan-body li {
	display: flex;
	align-items: center;
	gap: 0.7rem;
	font-size: 0.95rem;
	color: #333;
	margin-bottom: 0.6rem;
}
.plan-body li i {
	color: #0055FF;
	font-size: 0.8rem;
}
.plan-divider {
	border-top: 1px solid #0055FF;
	margin: auto 0 1rem 0;
}
.plan-more {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	color: #333;
	font-family: inherit;
	font-size: 0.95rem;
	font-weight: 500;
	text-decoration: none;
	align-self: flex-start;
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
}
.plan-more:hover { color: #0055FF; }
.plan-more-icon {
	font-size: 0.7rem;
	transition: transform 0.3s ease;
}
.plan-more-icon.open { transform: rotate(180deg); }

.plan-extra {
	display: grid;
	grid-template-rows: 0fr;
	transition: grid-template-rows 0.3s ease;
}
.plan-extra.open { grid-template-rows: 1fr; }
.plan-extra-inner { overflow: hidden; }
.plan-extra p {
	font-size: 0.95rem;
	line-height: 1.7;
	color: #333;
	opacity: 0.85;
	margin: 0.9rem 0 0;
}

.btn-landing-outline {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: 1.5px solid #0055FF;
	color: #0055FF;
	font-family: 'Apex New', 'Segoe UI', sans-serif;
	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0.1em;
	text-indent: 0.1em;
	/* +0.125em top / -0.125em bottom optically centres the caps: Apex New's
	   ascent equals its cap height, so the descent space all sits below. */
	padding: calc(0.7rem + 0.125em) 2rem calc(0.7rem - 0.125em);
	border-radius: 2rem;
	text-decoration: none;
	text-align: center;
	line-height: 1;
	transition: background 0.2s, color 0.2s;
}
.btn-landing-outline:hover {
	background: #0055FF;
	color: #fff;
	text-decoration: none;
}
.btn-sm {
	font-size: 0.7rem;
	padding: calc(0.55rem + 0.125em) 1.5rem calc(0.55rem - 0.125em);
}

.text-center { text-align: center; }

@media (max-width: 991px) {
	.pricing-grid {
		grid-template-columns: 1fr;
		gap: 2.5rem;
	}
	.pricing-arrow { display: none; }
}
</style>
