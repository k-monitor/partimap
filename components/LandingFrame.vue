<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();

withDefaults(
	defineProps<{
		showSearch?: boolean;
	}>(),
	{ showSearch: false },
);
</script>

<template>
	<div class="landing doc-scroll">
		<!-- Floating animated blue dots -->
		<div class="floating-dots" aria-hidden="true">
			<span v-for="n in 12" :key="n" :class="`dot dot-${n}`" />
		</div>

		<!-- Navigation -->
		<LandingNav :show-search="showSearch" />

		<!-- Page content -->
		<main class="landing-main">
			<slot />
		</main>

		<!-- Footer -->
		<footer id="contact" class="landing-footer">
			<div class="footer-inner">
				<div class="footer-grid">
					<div class="footer-col">
						<h5>{{ t('landing.footer.contact') }}</h5>
						<p class="footer-desc">{{ t('landing.footer.contactDesc') }}</p>
						<ul>
							<li><a href="mailto:hello@partimap.eu">hello@partimap.eu</a></li>
							<li><a href="mailto:info@k-monitor.hu">info@k-monitor.hu</a></li>
						</ul>
					</div>
					<div class="footer-col">
						<h5 class="footer-col-spacer" aria-hidden="true">&nbsp;</h5>
						<ul>
							<li><NuxtLink :to="localePath('/privacy')">{{ t('landing.footer.privacy') }}</NuxtLink></li>
							<li><NuxtLink :to="localePath('/terms')">{{ t('landing.footer.terms') }}</NuxtLink></li>
						</ul>
					</div>
					<div class="footer-col">
						<h5>{{ t('landing.footer.follow') }}</h5>
						<ul>
							<li><a href="https://k.blog.hu" target="_blank" rel="noopener">k.blog</a></li>
							<li><a href="#" target="_blank">Facebook</a></li>
							<li><a href="#" target="_blank">Instagram</a></li>
							<li><a href="#" target="_blank">YouTube</a></li>
							<li><a href="https://k-monitor.hu/" target="_blank" rel="noopener">k-monitor.hu</a></li>
						</ul>
					</div>
					<div class="footer-col">
						<h5>{{ t('landing.footer.imprint') }}</h5>
						<ul>
							<li>K-Monitor Közhasznú Egyesület</li>
							<li>{{ t('landing.footer.office') }}</li>
							<li>1077 Budapest, Rózsa utca 8.</li>
						</ul>
					</div>
				</div>
				<div class="footer-line" />
				<p class="footer-copy">{{ t('landing.footer.copyright') }}</p>
			</div>
		</footer>
	</div>
</template>

<style scoped>
@font-face {
	font-family: 'Apex New';
	src: url('/apex-new/ApexNew-Book.ttf') format('truetype');
	font-weight: 400;
	font-style: normal;
	font-display: swap;
}
@font-face {
	font-family: 'Apex New';
	src: url('/apex-new/ApexNew-Medium.ttf') format('truetype');
	font-weight: 500;
	font-style: normal;
	font-display: swap;
}
@font-face {
	font-family: 'Apex New';
	src: url('/apex-new/ApexNew-Bold.ttf') format('truetype');
	font-weight: 700;
	font-style: normal;
	font-display: swap;
}

.landing {
	--l-font: 'Apex New', 'Segoe UI', sans-serif;
	--l-blue: #0055FF;
	--l-bg: rgba(237, 228, 211, 0.56);
	--l-text: #333;
	--l-blue-10: rgba(0, 85, 255, 0.3);
	--l-blue-15: rgba(0, 85, 255, 0.4);

	font-family: var(--l-font);
	background-color: #EDE4D3;
	background-image: linear-gradient(var(--l-bg), var(--l-bg)), url('/background.webp');
	background-size: cover;
	background-position: center top;
	background-repeat: no-repeat;
	background-attachment: fixed;
	color: var(--l-text);
	overflow-x: hidden;
	position: relative;
	min-height: 100vh;
}

.landing-main {
	padding-top: 5rem;
	min-height: calc(100vh - 5rem);
	/* Sit above the fixed floating dots (z-index: 1) so they drift behind the content */
	position: relative;
	z-index: 2;
}

/* ── Floating Dots ────────────────────────────────────── */
.floating-dots {
	position: fixed;
	inset: 0;
	pointer-events: none;
	z-index: 1;
	overflow: hidden;
}
.dot {
	position: absolute;
	border-radius: 50%;
	background: #0055FF;
	opacity: 0.3;
}
.dot-1  { width:  6px; height:  6px; top: 12%; left:  8%; animation: driftA 14s ease-in-out infinite; }
.dot-2  { width:  4px; height:  4px; top: 22%; left: 75%; animation: driftB 18s ease-in-out infinite 1s; }
.dot-3  { width:  8px; height:  8px; top: 35%; left: 50%; animation: driftC 12s ease-in-out infinite 2s; }
.dot-4  { width:  4px; height:  4px; top: 48%; left: 20%; animation: driftA 16s ease-in-out infinite 3s; }
.dot-5  { width:  5px; height:  5px; top: 55%; left: 85%; animation: driftB 13s ease-in-out infinite 0.5s; }
.dot-6  { width:  7px; height:  7px; top: 68%; left: 40%; animation: driftC 17s ease-in-out infinite 4s; }
.dot-7  { width:  4px; height:  4px; top: 78%; left: 65%; animation: driftA 15s ease-in-out infinite 2.5s; }
.dot-8  { width:  6px; height:  6px; top: 88%; left: 12%; animation: driftB 14s ease-in-out infinite 1.5s; }
.dot-9  { width:  3px; height:  3px; top:  5%; left: 55%; animation: driftC 19s ease-in-out infinite 3.5s; }
.dot-10 { width:  5px; height:  5px; top: 42%; left: 92%; animation: driftA 16s ease-in-out infinite 0.8s; }
.dot-11 { width:  8px; height:  8px; top: 62%; left:  5%; animation: driftB 13s ease-in-out infinite 2.2s; }
.dot-12 { width:  4px; height:  4px; top: 92%; left: 70%; animation: driftC 18s ease-in-out infinite 4.5s; }
/* The dots are spread in viewport percentages inside a fixed layer, so on a
   phone all 12 crowd into a narrow strip and read as lint on the screen.
   Keep 5 that stay spread out vertically and horizontally. */
@media (max-width: 767px) {
	.dot { opacity: 0.22; }
	.dot-2,
	.dot-4,
	.dot-6,
	.dot-9,
	.dot-10,
	.dot-11,
	.dot-12 { display: none; }
}

@keyframes driftA {
	0%, 100% { transform: translate(0, 0); }
	25% { transform: translate(20px, -15px); }
	50% { transform: translate(-12px, 22px); }
	75% { transform: translate(16px, 8px); }
}
@keyframes driftB {
	0%, 100% { transform: translate(0, 0); }
	33% { transform: translate(-18px, 20px); }
	66% { transform: translate(22px, -12px); }
}
@keyframes driftC {
	0%, 100% { transform: translate(0, 0); }
	20% { transform: translate(12px, 16px); }
	40% { transform: translate(-22px, -6px); }
	60% { transform: translate(16px, -20px); }
	80% { transform: translate(-8px, 12px); }
}

/* ── Footer ───────────────────────────────────────────── */
.landing-footer {
	position: relative;
	padding: 3rem 2rem 2rem;
}
.footer-inner {
	max-width: 1000px;
	margin: 0 auto;
}
.footer-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 2rem;
	margin-bottom: 2rem;
}
.footer-col h5 {
	color: var(--l-blue);
	font-size: 0.85rem;
	font-weight: 700;
	margin-bottom: 0.8rem;
}
.footer-desc {
	font-size: 0.8rem;
	line-height: 1.6;
	opacity: 0.8;
	font-weight: 500;
	margin-bottom: 1rem;
}
.footer-col ul {
	list-style: none;
	padding: 0;
	margin: 0;
}
.footer-col li {
	font-size: 0.8rem;
	opacity: 0.7;
	margin-bottom: 0.3rem;
}
.footer-col a {
	color: var(--l-text);
	text-decoration: none;
}
.footer-col a:hover { text-decoration: underline; }
.footer-line {
	height: 0;
	border-top: 1.5px solid var(--l-blue);
	margin-bottom: 1.5rem;
}
.footer-copy {
	text-align: center;
	font-size: 0.75rem;
	opacity: 0.6;
}

@media (max-width: 575px) {
	.footer-grid { grid-template-columns: 1fr; }
}
@media (max-width: 991px) {
	.footer-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
