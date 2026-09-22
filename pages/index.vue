<script setup lang="ts">
const localePath = useLocalePath();
const { t, locale, locales } = useI18n();

useHead({
	title: t('landing.title'),
});

// news dates are not translatable, they are formatted with the active locale
const newsDates = ['2025-07-15', '2025-05-21', '2025-02-06'];

const newsDateFormat = computed(() => {
	const language = locales.value.find(l => l.code === locale.value)?.language || locale.value;
	return new Intl.DateTimeFormat(language, { year: 'numeric', month: 'long', day: 'numeric' });
});

function formatNewsDate(n: number) {
	return newsDateFormat.value.format(new Date(newsDates[n - 1]));
}

const activePopup = ref<number | null>(null);
const activeFeature = ref<number | null>(null);

const partners = [
	{ name: 'BKK', src: '/partners/bkk.png', url: 'https://bkk.hu/' },
	{ name: 'Megérti', src: '/partners/megerti.png', url: 'https://megerti.hu/index.php/fejlesztespolitikai-tanacsadas/' },
	{ name: 'ITI', src: '/partners/iti-logo.svg', url: 'https://itimagyarorszag.hu/' },
	{ name: 'Mobilissimus', src: '/partners/mobilissimus.png', url: 'https://mobilissimus.hu/' },
	{ name: 'MÖK', src: '/partners/mok.jpg', url: 'https://mok.hu/' },
	{ name: 'NTVESZ', src: '/partners/ntvesz.jpg', url: 'https://nagytavak.hu/rolunk/' },
	{ name: 'AKE', src: '/partners/ake_logo.jpg', url: 'https://altkozegy.hu/' },
	{ name: 'Tavirozsa', src: '/partners/tavirozsa_logo.png', url: 'https://www.tavirozsa-egyesulet.hu/' },
	{ name: 'TU/e', src: '/partners/tue_logo.png', url: 'https://www.tue.nl/en/' },
	{ name: 'Alba Natura', src: '/partners/alba_natura.jpg', url: 'https://www.facebook.com/albanaturaalapitvany/' },
	{ name: 'Magyar Kerékpárosklubb', src: '/partners/kerekparos.png', url: 'https://kerekparosklub.hu/' },
	{ name: 'RÉV8', src: '/partners/rev_logo.png', url: 'https://rev8.hu/' },
];

function togglePopup(n: number) {
	activePopup.value = activePopup.value === n ? null : n;
}

function closePopup() {
	activePopup.value = null;
}

function openFeature(n: number) {
	activeFeature.value = n;
}

function closeFeature() {
	activeFeature.value = null;
}

function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape') closeFeature();
}

function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

// The ↓ arrows are scroll cues: clicking one advances to the section that
// follows the one the arrow sits in.
function scrollToNextSection(e: Event) {
	let next = (e.currentTarget as HTMLElement).closest('section')?.nextElementSibling ?? null;
	while (next && next.tagName !== 'SECTION' && next.tagName !== 'FOOTER') {
		next = next.nextElementSibling;
	}
	if (!next) return;
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	next.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

const statsSection = ref<HTMLElement | null>(null);
const statTargets = computed(() => [
	parseStat('1007'),
	parseStat('245154'),
	parseStat('103672'),
]);
const statDisplays = ref<string[]>(['0', '0', '0']);

function parseStat(raw: string) {
	const match = String(raw).match(/^(\D*)(\d[\d\s,.]*)(\D*)$/);
	if (!match) return { prefix: '', number: 0, suffix: String(raw), raw };
	const numeric = parseInt(match[2].replace(/[^\d]/g, ''), 10) || 0;
	return { prefix: match[1], number: numeric, suffix: match[3], raw };
}

function animateStats() {
	const duration = 2500;
	const start = performance.now();
	const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
	const tick = (now: number) => {
		const progress = Math.min((now - start) / duration, 1);
		const eased = easeOut(progress);
		statDisplays.value = statTargets.value.map((s) => {
			const current = Math.round(s.number * eased);
			return `${s.prefix}${current}${s.suffix}`;
		});
		if (progress < 1) requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
}

onMounted(() => {
	window.addEventListener('keydown', onKeydown);
	if (!statsSection.value) return;
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduced) {
		statDisplays.value = statTargets.value.map((s) => s.raw);
		return;
	}
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					animateStats();
					observer.disconnect();
					break;
				}
			}
		},
		{ threshold: 0.3 },
	);
	observer.observe(statsSection.value);
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
	<div class="landing doc-scroll">
		<!-- Floating animated blue dots -->
		<div class="floating-dots" aria-hidden="true">
			<span v-for="n in 12" :key="n" :class="`dot dot-${n}`" />
		</div>

		<!-- Navigation -->
		<LandingNav />

		<!-- Hero Section -->
		<section class="hero-section">
			<div class="hero-blob blob-tr" aria-hidden="true" />
			<div class="hero-blob blob-bl" aria-hidden="true" />

			<div class="hero-inner">
				<div class="hero-left">
					<span class="hero-brand">PARTIMAP</span>
					<h1 class="hero-title" v-html="t('landing.hero.tagline')" />
					<p class="hero-subtitle">{{ t('landing.hero.subtitle') }}</p>
					<NuxtLink
						:to="localePath('/register')"
						class="btn-landing"
					>{{ t('landing.hero.cta') }}</NuxtLink>
					<div class="deco-circle hero-left-circle no-phone-deco" aria-hidden="true" />
					<button
						type="button"
						class="hero-left-arrow"
						aria-label="Scroll down"
						@click="scrollToNextSection"
					>↓</button>
				</div>

				<div class="hero-center">
					<div class="hero-circle-wrap">
						<HeroMap />
						<svg class="rotating-svg" viewBox="0 0 300 300" aria-hidden="true">
							<defs>
								<path
									id="heroTextPath"
									d="M 150,150 m -130,0 a 130,130 0 1,1 260,0 a 130,130 0 1,1 -260,0"
								/>
							</defs>
							<text font-size="13" fill="var(--l-blue)" font-weight="500" letter-spacing="5">
								<textPath href="#heroTextPath" startOffset="0%">
									{{ t('landing.hero.circleText') }}
								</textPath>
								<textPath href="#heroTextPath" startOffset="50%">
									{{ t('landing.hero.circleText') }}
								</textPath>
							</text>
						</svg>
					</div>
				</div>

				<div class="hero-right d-none d-xl-block">
					<div class="hero-feat">
						<h3>{{ t('landing.hero.feat1Title') }}</h3>
						<p>{{ t('landing.hero.feat1Desc') }}</p>
					</div>
					<div class="hero-feat-sep" aria-hidden="true" />
					<div class="hero-feat">
						<h3>{{ t('landing.hero.feat2Title') }}</h3>
						<p>{{ t('landing.hero.feat2Desc') }}</p>
					</div>
					<div class="hero-feat-sep" aria-hidden="true" />
					<div class="hero-feat">
						<h3>{{ t('landing.hero.feat3Title') }}</h3>
						<p>{{ t('landing.hero.feat3Desc') }}</p>
					</div>
					<button
						type="button"
						class="hero-right-scroll"
						aria-label="Scroll down"
						@click="scrollToNextSection"
					>
						<span class="hero-chevrons" aria-hidden="true">
							<span class="hero-chevron" />
							<span class="hero-chevron" />
							<span class="hero-chevron" />
						</span>
					</button>
				</div>
			</div>
			<a
				href="#examples"
				class="hero-scroll-indicator"
				aria-label="Scroll down"
				@click.prevent="scrollToNextSection"
			>
				<span class="hero-scroll-mouse">
					<span class="hero-scroll-wheel" />
				</span>
				<span class="hero-scroll-chevron">↓</span>
			</a>
		</section>

		<!-- Examples / Use cases -->
		<section id="examples" class="examples-section">
			<div class="section-blob blob-examples" aria-hidden="true" />
			<div class="examples-inner">
				<div class="examples-head">
					<div class="examples-head-text">
						<h2 class="sec-title">{{ t('landing.examples.title') }}</h2>
						<p class="sec-sub" v-html="t('landing.examples.sub')" />
					</div>
					<div class="sec-arrow sec-arrow-top">
						<button type="button" class="sec-arrow-glyph" aria-label="Scroll down" @click="scrollToNextSection">↓</button>
					</div>
				</div>
				<div class="examples-grid">
					<div v-for="n in 2" :key="n" class="example-card">
						<img
							:src="['/demo-general.webp', '/demo-cycling.webp'][n-1]"
							alt=""
							class="example-map-img"
							aria-hidden="true"
						/>
						<div class="example-card-content">
							<div class="example-icon">
								<i :class="`fas fa-${['map-marked-alt','bicycle'][n-1]}`" />
							</div>
							<span class="example-badge">{{ t(`landing.examples.card${n}Badge`) }}</span>
							<p>{{ t(`landing.examples.card${n}Desc`) }}</p>
							<a :href="t(`landing.examples.card${n}Link`)" target="_blank" class="btn-landing-outline btn-sm">
								{{ t('landing.examples.viewBtn') }}
							</a>
						</div>
					</div>
				</div>
				<p class="examples-note">{{ t('landing.examples.moreSoon') }}</p>
			</div>
			<div class="sec-arrow">
				<button type="button" class="sec-arrow-glyph" aria-label="Scroll down" @click="scrollToNextSection">↓</button>
			</div>
		</section>

		<!-- Why use it -->
		<section id="about" class="why-section">
			<div class="section-blob blob-why" aria-hidden="true" />
			<button type="button" class="why-side-arrow" aria-label="Scroll down" @click="scrollToNextSection">
				<svg aria-hidden="true" viewBox="0 0 24 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
					<line x1="12" y1="0" x2="12" y2="384" stroke="currentColor" stroke-width="1.5"/>
					<polyline points="4,374 12,385 20,374" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
				</svg>
			</button>
			<div class="why-inner">
				<h2 class="sec-title">{{ t('landing.why.title') }}</h2>
				<p class="sec-sub" v-html="t('landing.why.sub')" />
				<div class="feat-grid">
					<div class="feat-card">
						<div class="feat-icon"><img src="/icons/hand.png" alt="" /></div>
						<div class="feat-body">
							<h4>{{ t('landing.why.feat1') }}</h4>
							<p>{{ t('landing.why.feat1Desc') }}</p>
							<button type="button" class="btn-landing-outline btn-sm feat-readmore" @click="openFeature(1)">{{ t('landing.why.readMore') }}</button>
						</div>
					</div>
					<div class="feat-card">
						<div class="feat-icon"><img src="/icons/money.png" alt="" /></div>
						<div class="feat-body">
							<h4>{{ t('landing.why.feat2') }}</h4>
							<p>{{ t('landing.why.feat2Desc') }}</p>
							<button type="button" class="btn-landing-outline btn-sm feat-readmore" @click="openFeature(2)">{{ t('landing.why.readMore') }}</button>
						</div>
					</div>
					<div class="feat-card">
						<div class="feat-icon"><img src="/icons/settings.png" alt="" class="feat-icon-img-sm" /></div>
						<div class="feat-body">
							<h4>{{ t('landing.why.feat3') }}</h4>
							<p>{{ t('landing.why.feat3Desc') }}</p>
							<button type="button" class="btn-landing-outline btn-sm feat-readmore" @click="openFeature(3)">{{ t('landing.why.readMore') }}</button>
						</div>
					</div>
					<div class="feat-card">
						<div class="feat-icon"><img src="/icons/language.png" alt="" class="feat-icon-img-sm" /></div>
						<div class="feat-body">
							<h4>{{ t('landing.why.feat4') }}</h4>
							<p>{{ t('landing.why.feat4Desc') }}</p>
							<button type="button" class="btn-landing-outline btn-sm feat-readmore" @click="openFeature(4)">{{ t('landing.why.readMore') }}</button>
						</div>
					</div>
					<div class="feat-card">
						<div class="feat-icon"><img src="/icons/pin.png" alt="" /></div>
						<div class="feat-body">
							<h4>{{ t('landing.why.feat5') }}</h4>
							<p>{{ t('landing.why.feat5Desc') }}</p>
							<button type="button" class="btn-landing-outline btn-sm feat-readmore" @click="openFeature(5)">{{ t('landing.why.readMore') }}</button>
						</div>
					</div>
					<div class="feat-card">
						<div class="feat-icon"><img src="/icons/cog.png" alt="" /></div>
						<div class="feat-body">
							<h4>{{ t('landing.why.feat6') }}</h4>
							<p>{{ t('landing.why.feat6Desc') }}</p>
							<button type="button" class="btn-landing-outline btn-sm feat-readmore" @click="openFeature(6)">{{ t('landing.why.readMore') }}</button>
						</div>
					</div>
				</div>
				<div class="why-cta text-center">
					<NuxtLink :to="localePath('/register')" class="btn-landing">{{ t('landing.why.registerCta') }}</NuxtLink>
				</div>
			</div>

			<Teleport to="body">
				<Transition name="fmodal">
					<div
						v-if="activeFeature !== null"
						class="feature-modal-overlay"
						@click.self="closeFeature"
					>
						<div class="feature-modal" role="dialog" aria-modal="true" :aria-label="t(`landing.why.feat${activeFeature}`)">
							<button class="feature-modal-close" aria-label="Close" @click="closeFeature">×</button>
							<h3 class="feature-modal-title">{{ t(`landing.why.feat${activeFeature}`) }}</h3>
							<div class="feature-modal-body" v-html="t(`landing.why.feat${activeFeature}Full`)" />
						</div>
					</div>
				</Transition>
			</Teleport>
		</section>

		<!-- How we can help -->
		<section id="help" class="help-section">
			<div class="help-inner">
				<div class="why-help-block">
					<h2 class="sec-title text-center" v-html="t('landing.help.title')" />
					<p class="sec-desc showcase-desc text-center">{{ t('landing.help.desc') }}</p>
					<div class="helpl-grid">
						<div class="helpl-card">
							<div class="helpl-icon"><img src="/icons/pin.png" alt="" class="helpl-icon-img" /></div>
							<h4>{{ t('landing.help.card1Title') }}</h4>
							<p>{{ t('landing.help.card1Desc') }}</p>
							<a :href="localePath({ name: 'sugo-keszites' })" class="btn-landing-outline btn-sm">{{ t('landing.help.readMore') }}</a>
						</div>
						<div class="helpl-card">
							<div class="helpl-icon"><img src="/icons/pencil.png" alt="" class="helpl-icon-img" /></div>
							<h4>{{ t('landing.help.card2Title') }}</h4>
							<p>{{ t('landing.help.card2Desc') }}</p>
							<a :href="localePath({ name: 'sugo-kerdoiv' })" class="btn-landing-outline btn-sm">{{ t('landing.help.readMore') }}</a>
						</div>
						<div class="helpl-card">
							<div class="helpl-icon"><img src="/icons/magnify.png" alt="" class="helpl-icon-img" /></div>
							<h4>{{ t('landing.help.card3Title') }}</h4>
							<p>{{ t('landing.help.card3Desc') }}</p>
							<a :href="localePath({ name: 'sugo-elemzes' })" class="btn-landing-outline btn-sm">{{ t('landing.help.readMore') }}</a>
						</div>
					</div>
					<div class="why-contact">
						<span class="why-contact-label">{{ t('landing.help.contactPrefix') }}</span>
						<a href="mailto:hello@partimap.eu" class="why-contact-email">hello@partimap.eu</a>
					</div>
				</div>
			</div>
		</section>

		<!-- Statistics -->
		<section id="stats" ref="statsSection" class="stats-section">
			<div class="section-blob blob-stats" aria-hidden="true" />
			<div class="stats-inner">
				<h2 class="sec-title">{{ t('landing.stats.title') }}</h2>
				<p class="sec-desc">{{ t('landing.stats.desc') }}</p>
				<div class="stats-grid">
					<div class="stat-item">
						<div class="stat-circle" >{{ statDisplays[0] }}</div>
						<h4>{{ t('landing.stats.stat1Title') }}</h4>
						<p>{{ t('landing.stats.stat1Desc') }}</p>
					</div>
					<div class="stat-item">
						<div class="stat-circle" >{{ statDisplays[1] }}</div>
						<h4>{{ t('landing.stats.stat2Title') }}</h4>
						<p>{{ t('landing.stats.stat2Desc') }}</p>
					</div>
					<div class="stat-item">
						<div class="stat-circle" >{{ statDisplays[2] }}</div>
						<h4>{{ t('landing.stats.stat3Title') }}</h4>
						<p>{{ t('landing.stats.stat3Desc') }}</p>
					</div>
				</div>
			</div>
			<div class="stat-arrow">
				<button type="button" class="sec-arrow-glyph" aria-label="Scroll down" @click="scrollToNextSection">↓</button>
			</div>
		</section>

		<!-- Showcase -->
		<section id="showcase" class="showcase-section">
			<div class="section-blob blob-show" aria-hidden="true" />

			<div class="showcase-inner">
				<div class="showcase-circle no-phone-deco deco-circle" aria-hidden="true" />

				<a href="#" class="home-link" @click.prevent="scrollToTop"><img src="/icons/home.png" alt="" class="showcase-top-icon" /></a>
				<h2 class="sec-title text-center">{{ t('landing.showcase.title') }}</h2>
				<p class="sec-desc showcase-desc text-center">{{ t('landing.showcase.desc') }}</p>
				<div class="map-visual" @click.self="closePopup">
					<img src="/map.webp" alt="" class="map-svg" aria-hidden="true">
					<template v-for="n in 6" :key="n">
						<div
							:class="`map-dot map-dot-${n}`"
							:aria-label="t(`landing.showcase.dot${n}Title`)"
							role="button"
							tabindex="0"
							@click.stop="togglePopup(n)"
							@keydown.enter.stop="togglePopup(n)"
							@keydown.space.prevent.stop="togglePopup(n)"
						/>
						<Transition name="popup">
							<div
								v-if="activePopup === n"
								:class="`map-popup map-popup-${n}`"
								role="dialog"
								@click.stop
							>
								<button class="map-popup-close" aria-label="Close" @click="closePopup">×</button>
								<h4 class="map-popup-title">{{ t(`landing.showcase.dot${n}Title`) }}</h4>
								<p class="map-popup-desc">{{ t(`landing.showcase.dot${n}Desc`) }}</p>
								<p v-if="t(`landing.showcase.dot${n}Author`)" class="map-popup-author">{{ t('landing.showcase.author') }}: {{ t(`landing.showcase.dot${n}Author`) }}</p>
							</div>
						</Transition>
					</template>
				</div>
			</div>
			<div class="news-circle no-phone-deco deco-circle" aria-hidden="true" />
		</section>

		<!-- News -->
		<section class="news-section">
			<div class="section-blob blob-news" aria-hidden="true" />
			<div class="news-inner">

				<h2 class="sec-title">{{ t('landing.news.title') }}</h2>
				<p class="sec-desc">{{ t('landing.news.desc') }}</p>
				<div class="news-grid">
					<div v-for="n in 3" :key="n" class="news-card">
						<span class="news-date">{{ formatNewsDate(n) }}</span>
						<h4>{{ t(`landing.news.news${n}Title`) }}</h4>
						<p>{{ t(`landing.news.news${n}Desc`) }}</p>
						<a
							:href="t(`landing.news.news${n}Link`)"
							target="_blank"
							rel="noopener"
							class="news-readmore"
						>{{ t('landing.news.readMore') }}</a>
					</div>
				</div>
				<div class="news-line" aria-hidden="true" />
				<div class="text-center mt-4">
					<a href="https://k.blog.hu" target="_blank" rel="noopener" class="btn-landing-outline">{{ t('landing.news.readMore') }}</a>
				</div>
			</div>
		</section>

		<!-- Partners -->
		<section id="partners" class="partners-section">
			<div class="section-blob blob-part" aria-hidden="true" />
			<div class="partners-inner">
				<h2 class="sec-title">{{ t('landing.partners.title') }}</h2>
				<p class="sec-desc">{{ t('landing.partners.desc') }}</p>
				<div class="partner-logos">
					<a
						v-for="p in partners"
						:key="p.name"
						:href="p.url"
						target="_blank"
						rel="noopener noreferrer"
						class="partner-logo-link"
					>
						<img :src="p.src" :alt="p.name" class="partner-logo" />
					</a>
				</div>
				<div class="partner-circle no-phone-deco deco-circle" aria-hidden="true" />
			</div>
			<div class="partner-circle-left no-phone-deco deco-circle" aria-hidden="true" />
			<div class="partner-line no-phone-deco" aria-hidden="true" />
		</section>

		<!-- Funding -->
		<section class="funding-section">
			<div class="funding-inner">
				<div class="funding-logos">
					<img src="/eu-commission-logo-en.svg" :alt="t('landing.funding.euAlt')" class="funding-logo funding-logo-eu" />
					<img src="/heinrich-boll-logo.svg" :alt="t('landing.funding.bollAlt')" class="funding-logo funding-logo-boll" />
				</div>
				<p class="funding-text">{{ t('landing.funding.text') }}</p>
			</div>
		</section>

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
							<li><a href="https://k.blog.hu" target="_blank" rel="noopener">Blog</a></li>
							<li><a href="https://www.facebook.com/Kmonitor/" target="_blank" rel="noopener">Facebook</a></li>
							<li><a href="https://www.instagram.com/kmonitorhu/" target="_blank" rel="noopener">Instagram</a></li>
							<li><a href="https://www.youtube.com/@k-monitor" target="_blank" rel="noopener">YouTube</a></li>
							<li><a href="https://k-monitor.hu/" target="_blank" rel="noopener">k-monitor.hu</a></li>
						</ul>
					</div>
					<div class="footer-col">
						<h5>{{ t('landing.footer.imprint') }}</h5>
						<ul>
							<li>K-Monitor Közhasznú Egyesület</li>
							<li>{{ t('landing.footer.office') }}</li>
							<li>1077 Budapest, Rózsa utca 8.</li>
							<li>Tel.: +36 1 789 5005</li>
							<li>Adószám: 18193288-1-42</li>
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

@font-face {
	font-family: 'Apex New';
	src: url('/apex-new/ApexNew-Bold.ttf') format('truetype');
	font-weight: 800;
	font-style: normal;
	font-display: swap;
}

/* ── Custom Properties ────────────────────────────────── */
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

/* ── Section Shared Styles ────────────────────────────── */
.sec-title {
	color: var(--l-blue);
	font-size: clamp(2rem, 5vw, 3.5rem);
	font-weight: 500;
	margin-bottom: 1.5rem;
	line-height: 1.15;
	/* Long compounds (e.g. German "Anwendungsmöglichkeiten") are wider than a
	   narrow phone viewport at the clamp minimum: hyphenate per html[lang],
	   and hard-break if there is still no valid break point. */
	-webkit-hyphens: auto;
	hyphens: auto;
	overflow-wrap: break-word;
}
.sec-sub {
	font-size: 1.05rem;
	opacity: 0.7;
	font-weight: 500;
	margin-bottom: 3rem;
}
.sec-desc {
	font-size: 1.05rem;
	line-height: 1.7;
	opacity: 0.8;
	font-weight: 500;
	margin-bottom: 3rem;
}
.hero-left {
	margin-top: 7rem;
}
/* The ↓ cues are buttons that scroll to the next section, but they must look
   exactly like the bare glyphs they replaced. */
.hero-left-arrow,
.hero-right-scroll,
.sec-arrow-glyph,
.why-side-arrow {
	appearance: none;
	background: none;
	border: 0;
	padding: 0;
	font: inherit;
	color: inherit;
	cursor: pointer;
}
.hero-left-arrow {
	display: block;
	color: var(--l-blue);
	font-size: 1.5rem;
	text-align: left;
	margin-top: 6rem;
}
.sec-arrow {
	color: var(--l-blue);
	font-size: 1.8rem;
	text-align: right;
	padding: 0 8rem 2rem 0;
}
.examples-head-text .sec-sub {
	margin-bottom: 0;
}
.sec-arrow-top {
	padding: 0.5rem 8rem 1rem 0;
}
/* On wide screens there's room in the right margin: lift the arrow up beside
   the text and align it horizontally with the section's bottom arrow. */
@media (min-width: 1200px) {
	.sec-arrow-top {
		position: absolute;
		top: 11rem;
		right: 10rem;
		padding: 0;
	}
}
.sec-arrow-glyph {
	display: inline-block;
	width: 24px;
	text-align: center;
	line-height: 1;
	animation: secArrowBounce 1.6s ease-in-out infinite;
}
@keyframes secArrowBounce {
	0%, 100% { transform: translateY(0); opacity: 0.55; }
	50% { transform: translateY(7px); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
	.sec-arrow-glyph { animation: none; }
}
.stat-arrow {
	color: var(--l-blue);
	font-size: 1.8rem;
	text-align: right;
	margin-top: 4rem;
	padding: 0 8rem 2rem 0;
}

/* ── Buttons ──────────────────────────────────────────── */
/* Apex New's ascent (750) equals its cap height, so all 250 units of descent
   space sit below the glyphs and centred text reads as too high. The button
   paddings below correct for that with +0.125em top / -0.125em bottom. */
.btn-landing {
	display: inline-block;
	background: var(--l-blue);
	color: #fff;
	font-size: 0.9rem;
	font-weight: 700;
	letter-spacing: 0.1em;
	padding: calc(1rem + 0.125em) 2.5rem calc(1rem - 0.125em);
	border-radius: 2.5rem;
	text-decoration: none;
	border: 1.5px solid var(--l-blue);
	transition: background 0.2s, color 0.2s;
}
.btn-landing:hover {
	background: transparent;
	color: var(--l-blue);
}
.btn-landing-outline {
	display: inline-block;
	border: 1.5px solid var(--l-blue);
	color: var(--l-blue);
	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0.1em;
	padding: calc(0.7rem + 0.125em) 2rem calc(0.7rem - 0.125em);
	border-radius: 2rem;
	text-decoration: none;
	transition: background 0.2s, color 0.2s;
}
.btn-landing-outline:hover {
	background: var(--l-blue);
	color: #fff;
}
.btn-sm {
	font-size: 0.7rem;
	padding: calc(0.5rem + 0.125em) 1.4rem calc(0.5rem - 0.125em);
}

/* ── Hero Section ─────────────────────────────────────── */
.hero-section {
	position: relative;
	min-height: 100vh;
	padding: 7rem 2rem 3rem;
	display: flex;
	flex-direction: column;
}
.hero-inner {
	max-width: 1200px;
	margin: 0 auto;
	flex: 1;
	display: grid;
	grid-template-columns: 1fr 1.2fr 0.8fr;
	align-items: start;
	gap: 2rem;
	width: 100%;
}
.hero-brand {
	color: var(--l-blue);
	font-size: 1rem;
	font-weight: 700;
	letter-spacing: 0.15em;
	display: block;
	margin-bottom: 1.5rem;
}
.hero-title {
	color: var(--l-blue);
	font-size: clamp(2.5rem, 5vw, 4rem);
	font-weight: 500;
	/* font-style: italic; */
	line-height: 1.1;
	margin-bottom: 1rem;
}
.hero-subtitle {
	color: var(--l-blue);
	font-size: clamp(1rem, 2vw, 1.25rem);
	font-weight: 400;
	line-height: 1.4;
	margin-bottom: 2rem;
}
.hero-center {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}
.hero-circle-wrap {
	position: relative;
	width: 420px;
	height: 420px;
	display: flex;
	align-items: start;
	margin-top: 80px;
	justify-content: center;
}
.rotating-svg {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 2;
	pointer-events: none;
	transform-origin: center center;
	animation: spin 30s linear infinite reverse;
}
@media (prefers-reduced-motion: reduce) {
	.rotating-svg { animation: none; }
}
.hero-arrow-circle {
	color: var(--l-blue);
	font-size: 1.1rem;
	margin-left: 1.5rem;
	width: 36px;
	height: 36px;
	border: 1.5px solid var(--l-blue);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.hero-left-line {
	margin-top: 1.5rem;
	width: 100%;
	height: 0;
	border-top: 1.5px solid var(--l-blue);
}
.hero-left-circle {
	width: 300px; height: 300px;
	position: absolute;
	transform: translate(-200px, 30px);
}
.showcase-circle {
	width: 420px; height: 420px;
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(-380px, 280px);
}
.showcase-desc {
	max-width: 400px;
	margin-left: auto;
  	margin-right: auto;
}
.hero-feat-sep {
	width: 100%;
	height: 0;
	border-top: 1.5px solid var(--l-blue);
	margin-bottom: 0.5rem;
}
.hero-right {
	padding-left: 2rem;
	padding-right: 1rem;
	margin-top: 10rem;
}
.hero-feat {
	margin-bottom: 1rem;
	padding-top: 0.5rem;
	position: relative;
}
.hero-feat h3 {
	color: var(--l-blue);
	font-size: 1.2rem;
	font-weight: 400;
	margin-bottom: 0.3rem;
}
.hero-feat p {
	font-size: 1rem;
	font-weight: 500;
	opacity: 0.7;
	margin: 0;
}
.hero-feat-btn {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 32px;
	height: 32px;
	border: 1.5px solid var(--l-blue);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--l-blue);
	font-size: 1.2rem;
}
.hero-scroll {
	color: var(--l-blue);
	font-size: 1.5rem;
	text-align: left;
	padding-left: 6rem;
	margin-top: auto;
}

/* Right-side scroll indicator inside hero-right */
.hero-right-scroll {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	margin-top: 3rem;
	width: 100%;
	color: var(--l-blue);
}
.hero-right-scroll-label {
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.25em;
	writing-mode: vertical-rl;
	transform: rotate(180deg);
	opacity: 0.8;
}
.hero-chevrons {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
}
.hero-chevron {
	width: 12px;
	height: 12px;
	border-right: 2px solid var(--l-blue);
	border-bottom: 2px solid var(--l-blue);
	transform: rotate(45deg);
	opacity: 0;
	animation: chevronCascade 1.6s ease-in-out infinite;
}
.hero-chevron:nth-child(2) { animation-delay: 0.2s; }
.hero-chevron:nth-child(3) { animation-delay: 0.4s; }

@keyframes chevronCascade {
	0% { opacity: 0; transform: rotate(45deg) translate(-3px, -3px); }
	50% { opacity: 1; }
	100% { opacity: 0; transform: rotate(45deg) translate(3px, 3px); }
}
@media (prefers-reduced-motion: reduce) {
	.hero-chevron { animation: none; opacity: 0.7; }
}

/* Centered animated scroll indicator at hero bottom */
.hero-scroll-indicator {
	position: absolute;
	left: 50%;
	bottom: 1.5rem;
	transform: translateX(-50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.4rem;
	color: var(--l-blue);
	text-decoration: none;
	z-index: 5;
	animation: scrollBlink 1.8s ease-in-out infinite;
}
/* The global a:hover underline would draw a line under the chevron glyph. */
.hero-scroll-indicator:hover,
.hero-scroll-indicator:focus-visible {
	opacity: 1;
	text-decoration: none;
}
.hero-scroll-mouse {
	width: 24px;
	height: 38px;
	border: 1.5px solid var(--l-blue);
	border-radius: 14px;
	display: flex;
	justify-content: center;
	padding-top: 6px;
}
.hero-scroll-wheel {
	width: 3px;
	height: 8px;
	background: var(--l-blue);
	border-radius: 2px;
	animation: scrollWheel 1.6s ease-in-out infinite;
}
.hero-scroll-chevron {
	font-size: 1.2rem;
	line-height: 1;
	animation: scrollBounce 1.8s ease-in-out infinite;
}

@keyframes scrollBlink {
	0%, 100% { opacity: 0.4; }
	50% { opacity: 1; }
}
@keyframes scrollBounce {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(6px); }
}
@keyframes scrollWheel {
	0% { transform: translateY(0); opacity: 1; }
	100% { transform: translateY(12px); opacity: 0; }
}
@keyframes scrollLineGrow {
	0%, 100% { transform: scaleY(0.6); opacity: 0.4; }
	50% { transform: scaleY(1); opacity: 1; }
}

/* ── Why / Features Section ───────────────────────────── */
.why-section {
	position: relative;
	padding: 5rem 2rem 3rem;
}
.why-side-arrow {
	position: absolute;
	right: 5rem;
	top: 65%;
	transform: translateY(-50%);
	width: 24px;
	height: 400px;
	scale: 1;
	color: var(--l-blue);
}
.why-side-arrow svg {
	display: block;
	width: 100%;
	height: 100%;
}
.why-inner {
	max-width: 1000px;
	margin: 0 auto;
}
.why-cta {
	margin-top: 3rem;
}
.feat-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 2.5rem 4rem;
}
.feat-card {
	display: flex;
	align-items: flex-start;
	gap: 1.2rem;
	max-width: 500px;
	margin-left: auto;
	margin-right: auto;
}
.feat-icon {
	flex-shrink: 0;
	width: 64px;
	height: 64px;
	border: 1.5px solid var(--l-blue);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}
.feat-icon img {
	width: 40px;
	height: 40px;
	object-fit: contain;
}
.feat-icon img.feat-icon-img-sm {
	width: 28px;
	height: 28px;
}
.feat-icon i {
	font-size: 1.7rem;
	color: var(--l-blue);
}
.feat-body {
	flex: 1;
	min-width: 0;
}
.feat-card h4 {
	color: var(--l-blue);
	font-size: 1.15rem;
	font-weight: 400;
	margin-bottom: 0.3rem;
}
.feat-card p {
	font-size: 1rem;
	opacity: 0.7;
	font-weight: 500;
	margin: 0 0 0.8rem 0;
	line-height: 1.6;
}
.feat-readmore {
	margin-top: 0.2rem;
	background: transparent;
	font-family: inherit;
	cursor: pointer;
}
.help-section {
	position: relative;
	padding: 8rem 2rem 5rem;
}
.help-inner {
	max-width: 1000px;
	margin: 0 auto;
}
.why-help-block {
	margin-top: 0;
}
.why-help-block .sec-title {
	margin-bottom: 1rem;
}
.why-contact {
	margin-top: 3rem;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.6rem;
}
.why-contact-label {
	font-size: 1.05rem;
	color: var(--l-text);
	opacity: 0.8;
	font-weight: 500;
}
.why-contact-email {
	display: inline-block;
	background: var(--l-blue);
	color: #fff;
	font-size: 1.1rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	padding: calc(0.85rem + 0.125em) 2.2rem calc(0.85rem - 0.125em);
	border-radius: 2.5rem;
	text-decoration: none;
	border: 1.5px solid var(--l-blue);
	transition: background 0.2s, color 0.2s;
}
.why-contact-email:hover {
	background: transparent;
	color: var(--l-blue);
}

/* ── Examples Section ─────────────────────────────────── */
.examples-section {
	position: relative;
	padding: 5rem 2rem 3rem;
}
.examples-inner {
	max-width: 1000px;
	margin: 0 auto;
}
.examples-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	margin-top: 2.5rem;
}
.examples-note {
	margin: 2rem 0 0;
	text-align: center;
	font-size: 1.05rem;
	font-weight: 500;
	opacity: 0.7;
}
.example-card {
	border: 1.5px solid var(--l-blue);
	border-radius: 12px;
	padding: 2rem;
	display: grid;
	grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
	align-items: center;
	gap: 2.5rem;
	transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.example-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 24px rgba(0, 85, 255, 0.12);
}
.example-card-content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.7rem;
}
.example-map-img {
	width: 100%;
	height: auto;
	object-fit: contain;
	border-radius: 8px;
	border: 1.5px solid var(--l-blue);
	opacity: 0.85;
}
.example-icon {
	flex-shrink: 0;
	width: 56px;
	height: 56px;
	border: 1.5px solid var(--l-blue);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--l-blue);
	font-size: 1.2rem;
	margin-bottom: 0.3rem;
}
.example-badge {
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.06em;
	color: var(--l-blue);
	text-transform: uppercase;
	opacity: 0.7;
}
.example-card p {
	font-size: 0.95rem;
	line-height: 1.6;
	opacity: 0.7;
	font-weight: 500;
	margin: 0;
	flex-grow: 1;
}
.example-card .btn-sm {
	margin-top: 0.5rem;
}
.blob-examples {
	top: -100px;
	right: -200px;
}
@media (max-width: 768px) {
	.example-card {
		grid-template-columns: 1fr;
		gap: 1.5rem;
		padding: 1.5rem;
	}
}

/* ── Statistics Section ───────────────────────────────── */
.stats-section {
	position: relative;
	padding: 5rem 2rem 3rem;
}
.stats-inner {
	max-width: 1000px;
	margin: 0 auto;
}
.stats-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0rem;
	text-align: center;
}
.stat-circle {
	width: 110px;
	height: 110px;
	border: 1.5px solid var(--l-blue);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 1.2rem;
	font-size: 1.3rem;
	font-weight: 400;
	color: var(--l-blue);
	margin-bottom: 1rem;
}
.stat-item {
	/* Cap the text column, but never exceed the grid track: a fixed width
	   overflows the viewport on narrow screens. */
	width: 100%;
	max-width: 22rem;
	margin: 0 auto;
	overflow-wrap: break-word;
}
.stat-item h4 {
	color: var(--l-blue);
	font-size: 1.2rem;
	font-weight: 400;
	letter-spacing: 0.05em;
	margin-bottom: 1.5rem;
}
.stat-item p {
	font-size: 0.95rem;
	line-height: 1.6;
	font-weight: 500;
}

/* ── Showcase Section ─────────────────────────────────── */
.showcase-section {
	position: relative;
	padding: 0rem 2rem;
	/* No top padding of its own, so keep it clear of the fixed nav when the
	   statistics arrow scrolls to it. */
	scroll-margin-top: 6rem;
}
.showcase-inner {
	max-width: 800px;
	margin: 0 auto;
	position: relative;
}
.map-visual {
	position: relative;
	width: 100%;
	max-width: 600px;
	margin: 2rem auto 0;
	/* aspect-ratio: 1; */
}
.map-svg {
	width: 100%;
	height: 100%;
}
.map-dot {
	position: absolute;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	border-radius: 50%;
	overflow: hidden;
	filter: brightness(0.82);
	transition: filter 0.5s ease, transform 0.5s ease;
}
.map-dot::after {
	content: '';
	position: absolute;
	inset: 0;
	background: #0055FF80;
	transition: opacity 0.25s ease;
	pointer-events: none;
}
.map-dot:hover {
	filter: saturate(1) brightness(1);
	transform: scale(1.04);
	cursor: pointer;
}
.map-dot:hover::after {
	opacity: 0;
}
.map-dot-1 { width: 130px; height: 130px; top: 8%; left: 12%; background-image: url('/buszkeseg1.webp'); }
.map-dot-2 { width: 130px; height: 130px; top: 15%; left: 55%; background-image: url('/buszkeseg2.webp'); }
.map-dot-3 { width: 130px; height: 130px; top: 40%; right: 15%; background-image: url('/buszkeseg3.webp'); }
.map-dot-4 { width: 130px; height: 130px; top: 65%; left: 15%; background-image: url('/buszkeseg4.webp'); }
.map-dot-5 { width: 130px; height: 130px; bottom: 10%; right: 30%; background-image: url('/buszkeseg5.webp'); }
.map-dot-6 { width: 130px; height: 130px; top: 42%; left: 35%; background-image: url('/buszkeseg6.webp'); }

/* ── Map Popups ───────────────────────────────────────── */
.map-popup {
	position: absolute;
	z-index: 10;
	width: 320px;
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 8px 32px rgba(0, 85, 255, 0.18), 0 2px 8px rgba(0,0,0,0.10);
	padding: 1.4rem 1.4rem 1.25rem;
	pointer-events: all;
}
.map-popup::before {
	content: '';
	position: absolute;
	width: 14px;
	height: 14px;
	background: #fff;
	box-shadow: -2px 2px 6px rgba(0,0,0,0.08);
	transform: rotate(45deg);
}
/* Arrow positions per dot */
.map-popup-1 { top: -8%; left: calc(12% + 140px); }
.map-popup-1::before { bottom: 30%; left: -7px; }
.map-popup-2 { top: 5%; left: calc(55% + 140px); }
.map-popup-2::before { bottom: 30%; left: -7px; }
.map-popup-3 { top: 30%; right: calc(15% + 140px); }
.map-popup-3::before { bottom: 30%; right: -7px; transform: rotate(45deg); }
.map-popup-4 { top: 58%; left: calc(15% + 140px); }
.map-popup-4::before { bottom: 30%; left: -7px; }
.map-popup-5 { bottom: 5%; right: calc(30% + 140px); }
.map-popup-5::before { bottom: 30%; right: -7px; transform: rotate(45deg); }
.map-popup-6 { top: 38%; left: calc(35% + 140px); }
.map-popup-6::before { bottom: 30%; left: -7px; }

.map-popup-close {
	position: absolute;
	top: 0.5rem;
	right: 0.65rem;
	background: none;
	border: none;
	font-size: 1.2rem;
	line-height: 1;
	color: #aaa;
	cursor: pointer;
	padding: 0;
	transition: color 0.2s;
}
.map-popup-close:hover { color: #0055FF; }
.map-popup-title {
	font-size: 1.15rem;
	font-weight: 700;
	color: #0055FF;
	margin: 0 1.2rem 0.5rem 0;
	line-height: 1.3;
}
.map-popup-desc {
	font-size: 0.95rem;
	color: #444;
	margin: 0;
	line-height: 1.55;
}
.map-popup-author {
	font-size: 0.85rem;
	font-weight: 600;
	color: #0055FF;
	margin: 0.6rem 0 0;
	line-height: 1.4;
}

/* Popup enter/leave transitions */
.popup-enter-active,
.popup-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}
.popup-enter-from,
.popup-leave-to {
	opacity: 0;
	transform: scale(0.92) translateY(4px);
}

/* ── Feature Modal (Why section "read more") ──────────── */
.feature-modal-overlay {
	position: fixed;
	inset: 0;
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem 1rem;
	background: rgba(0, 20, 60, 0.45);
	backdrop-filter: blur(3px);
	font-family: 'Apex New', 'Segoe UI', sans-serif;
}
.feature-modal {
	position: relative;
	width: 100%;
	max-width: 560px;
	max-height: 85vh;
	overflow-y: auto;
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 8px 32px rgba(0, 85, 255, 0.18), 0 2px 8px rgba(0, 0, 0, 0.10);
	padding: 2.5rem 2rem 2rem;
	animation: fmodalPop 0.24s ease;
}
@keyframes fmodalPop {
	from { opacity: 0; transform: scale(0.94) translateY(8px); }
	to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
	.feature-modal { animation: none; }
}
.feature-modal-close {
	position: absolute;
	top: 0.8rem;
	right: 1rem;
	background: none;
	border: none;
	font-size: 1.6rem;
	line-height: 1;
	color: #aaa;
	cursor: pointer;
	padding: 0;
	transition: color 0.2s;
}
.feature-modal-close:hover { color: #0055FF; }
.feature-modal-title {
	font-size: 1.4rem;
	font-weight: 700;
	color: #0055FF;
	margin: 0 1.5rem 1rem 0;
	line-height: 1.25;
}
.feature-modal-body {
	font-size: 1.05rem;
	color: #444;
	line-height: 1.7;
}

/* Feature modal enter/leave transitions */
.fmodal-enter-active,
.fmodal-leave-active {
	transition: opacity 0.22s ease;
}
.fmodal-enter-from,
.fmodal-leave-to {
	opacity: 0;
}

/* ── News Section ─────────────────────────────────────── */
.news-section {
	position: relative;
	padding: 5rem 2rem;
}
.news-inner {
	max-width: 1000px;
	margin: 0 auto;
}
.news-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 2rem;
	margin-bottom: 1rem;
}
.news-card {
	display: flex;
	flex-direction: column;
}
.news-date {
	color: var(--l-blue);
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.06em;
	opacity: 0.7;
	margin-bottom: 0.4rem;
}
.news-card h4 {
	color: var(--l-blue);
	font-size: 1.15rem;
	font-weight: 400;
	line-height: 1.3;
	min-height: 2.6em;
	margin-bottom: 1rem;
}
.news-card p {
	font-size: 0.95rem;
	line-height: 1.7;
	font-weight: 500;
	opacity: 0.8;
	margin-bottom: 1rem;
}
.news-readmore {
	margin-top: auto;
	align-self: flex-start;
	color: var(--l-blue);
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.06em;
	text-decoration: none;
}
.news-readmore:hover {
	text-decoration: underline;
}
.news-line {
	height: 0;
	border-top: 1.5px solid var(--l-blue);
}
.news-circle {
	width: 220px; height: 220px; bottom: -80px; right: 50px;
	position: absolute;
}

/* ── Help cards (merged into Why section) ─────────────── */
.helpl-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 2.5rem;
	text-align: center;
	margin-top: 2rem;
}
.helpl-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 500px;
	margin-left: auto;
	margin-right: auto;
}
.helpl-icon {
	width: 105px;
	height: 105px;
	border: 1.5px solid var(--l-blue);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--l-blue);
	font-size: 1.75rem;
	margin: 0 auto 1.5rem;
}
.helpl-icon-img {
	width: 40px;
	height: 40px;
	object-fit: contain;
}
.helpl-card h4 {
	color: var(--l-blue);
	font-size: 1.15rem;
	font-weight: 700;
	margin-bottom: 1rem;
}
.helpl-card p {
	font-size: 0.95rem;
	line-height: 1.7;
	opacity: 0.8;
	margin-bottom: 1.5rem;
}

/* ── Partners Section ─────────────────────────────────── */
.partners-section {
	position: relative;
	padding: 5rem 2rem 2rem;
	/* Keeps the title clear of the fixed nav when the page is opened at #partners. */
	scroll-margin-top: 2rem;
}
.partners-inner {
	max-width: 1000px;
	margin: 0 auto;
}
.partners-inner p {
	max-width: 600px;
}
.partner-logos {
	display: flex;
	flex-wrap: wrap;
	align-items: stretch;
	justify-content: start;
	gap: 1.25rem;
	margin: 2rem 0 3rem;
	position: relative;
	z-index: 2;
}
.partner-logo-link {
	display: block;
	border-radius: 12px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.partner-logo-link:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.partner-logo {
	display: block;
	height: 110px;
	width: 190px;
	object-fit: contain;
	background: #fff;
	border-radius: 12px;
	padding: 1rem 1.25rem;
}
.partner-circle {
	width: 380px; height: 380px;
	position: absolute;
	/* Mirror of .partner-circle-left on the right side: pin the circle's left
	   edge ~20px right of the centered 1000px content column (column right edge =
	   50vw + 500px). Uses left + 50vw (anchored to the viewport via the section's
	   left edge) rather than `right`, so it's deterministic and clears the logos
	   at every width, sliding off-screen right as the viewport narrows. */
	left: calc(50vw + 520px);
	bottom: 38%;
}
.partner-circle-left {
	width: 380px; height: 380px;
	position: absolute;
	/* Pin the circle's right edge ~20px left of the centered 1000px content
	   column. The column's left edge sits at (50vw - 500px), so the circle's
	   right edge lands at (50vw - 520px) — always clear of the content. Must use
	   50vw (viewport), not 50% (which resolves against .partners-section, not the
	   viewport). It sits in the left gutter on wide screens and slides off-screen
	   left as the viewport narrows, so it never overlaps the funding/footer text. */
	left: calc(50vw - 900px);
	bottom: -300px;
}
.partner-line {
	position: absolute;
	bottom: calc(10% - 60px);
	left: 0;
	width: 900px;
	height: 0;
	border-top: 1.5px solid var(--l-blue);
}

/* ── Funding Section ──────────────────────────────────── */
.funding-section {
	position: relative;
	padding: 2rem 2rem 3rem;
}
.funding-inner {
	max-width: 1000px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	gap: 2.5rem;
	flex-wrap: wrap;
}
.funding-logos {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	flex-shrink: 0;
}
.funding-logo {
	height: 60px;
	width: auto;
	object-fit: contain;
}
.funding-logo-eu { height: 60px; }
.funding-logo-boll { height: 60px; }
.funding-text {
	flex: 1;
	min-width: 280px;
	font-size: 0.95rem;
	line-height: 1.7;
	opacity: 0.8;
	font-weight: 500;
	margin: 0;
}
@media (max-width: 768px) {
	.funding-inner {
		flex-direction: column;
		text-align: center;
	}
	.funding-logos { flex-wrap: wrap; justify-content: center; }
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
	font-size: 0.95rem;
	font-weight: 700;
	margin-bottom: 0.8rem;
}
.footer-desc {
	font-size: 0.9rem;
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
	font-size: 0.9rem;
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
	font-size: 0.85rem;
	opacity: 0.6;
}

/* ── Decorative Circles (outlines) ────────────────────── */
.deco-circle {
	/* position: absolute; */
	border: 1.5px solid var(--l-blue);
	border-radius: 50%;
	pointer-events: none;
	opacity: 0.8;
}
.deco-hero-bl  { width: 300px; height: 300px; bottom: 40px; left: -100px; }
.deco-sup-tr   { width: 250px; height: 250px; top: -60px; right: 15%; }
.deco-sup-br   { width: 500px; height: 500px; bottom: -200px; right: -200px; }
.deco-show-tl  { width: 350px; height: 350px; top: -100px; left: -100px; }
.deco-show-br  { width: 300px; height: 300px; bottom: -80px; right: -80px; }
.deco-news-tr  { width: 280px; height: 280px; top: -60px; right: -80px; }
.deco-part-bl  { width: 350px; height: 350px; bottom: -60px; left: -120px; }
.deco-part-tr  { width: 400px; height: 400px; top: -20px; right: -120px; }

/* ── Decorative Lines ─────────────────────────────────── */
.deco-line {
	position: absolute;
	background: transparent;
	border-left: 1.5px solid var(--l-blue);
	pointer-events: none;
}
.home-link {
	cursor: pointer;
	z-index: 10;
	pointer-events: all;
}
.home-link:has(.showcase-top-icon) {
	display: block;
	width: fit-content;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50px;
}
.showcase-top-icon {
	display: block;
	width: 20px;
	height: 20px;
}
.deco-hero-line-v {
	width: 1.5px;
	height: 150px;
	left: 8%;
	bottom: 15%;
}
.deco-hero-line-h {
	height: 1.5px;
	width: 200px;
	left: 0;
	bottom: calc(40px + 150px);
}
.deco-sup-line {
	width: 1.5px;
	height: 120px;
	left: 15%;
	top: 10%;
}

/* ── Background Gradient Blobs ────────────────────────── */
.section-blob,
.hero-blob {
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
	filter: blur(80px);
}
.blob-tr  { width: 500px; height: 500px; top: -100px; right: -100px; background: var(--l-blue-15); }
.blob-bl  { width: 400px; height: 400px; bottom: -50px; left: -50px; background: var(--l-blue-10); }
.blob-why  { width: 500px; height: 400px; bottom: -100px; left: 20%; background: var(--l-blue-10); }
.blob-stats { width: 350px; height: 350px; top: -80px; right: 10%; background: var(--l-blue-10); }
.blob-show  { width: 500px; height: 500px; bottom: -100px; right: -50px; background: var(--l-blue-15); }
.blob-news  { width: 400px; height: 400px; bottom: -80px; left: -50px; background: var(--l-blue-10); }
.blob-part  { width: 1000px; height: 900px; bottom: -300px; right: -250px; background: var(--l-blue-10); filter: blur(120px); }

/* ── Floating Blue Dots ───────────────────────────────── */
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

/* ── Keyframes ────────────────────────────────────────── */
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
@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 1250px) {
	.why-side-arrow { display: none; }
}
@media (max-width: 991px) {
	.hero-inner {
		/* minmax(0, …) rather than a bare 1fr: an fr track's automatic minimum is
		   min-content, so an item wider than the container (the 420px map circle on
		   a phone) stretches the track instead of being constrained by it. The grid
		   box itself stays centered, but the track then overflows to the right only,
		   so everything centered inside it — title, subtitle, CTA, map — sits right
		   of the viewport centre. */
		grid-template-columns: minmax(0, 1fr);
		text-align: center;
	}
	/* With the track capped above, the circle has to be able to shrink into it.
	   aspect-ratio keeps it round as it does. */
	.hero-circle-wrap {
		width: min(420px, 100%);
		height: auto;
		aspect-ratio: 1;
	}
	/* Single column: text + CTA first, map below it (DOM order). */
	.hero-left { margin-top: 1rem; }
	/* The ↓ cue after the CTA now sits right above the map but scrolls past it
	   to the next section — misleading. The hero's centered scroll indicator
	   already does that job. */
	.hero-left-arrow { display: none; }
	.hero-circle-wrap { margin-top: 2rem; }
	/* With the map at the bottom of the hero, the indicator's absolute
	   bottom placement lands on the circle — let it flow below the map. */
	.hero-scroll-indicator {
		position: static;
		transform: none;
		align-self: center;
		margin-top: 2rem;
	}
	/* Centered single-column layout: the decorative circle would overlap
	   the centered text (and the examples title below), so hide it. */
	.hero-left-circle { display: none; }
	/* Same overlap problem at the bottom once the layout narrows: hide the
	   remaining partner decorations. (.partner-circle-left needs no rule here —
	   it slides off-screen on its own as the gutter shrinks.) */
	.partner-circle,
	.partner-line { display: none; }
	.hero-scroll { text-align: center; padding-left: 0; }
	.feat-grid { grid-template-columns: 1fr; }
	.stats-grid { grid-template-columns: 1fr; gap: 3rem; }
	.news-grid { grid-template-columns: 1fr; }
	.helpl-grid { grid-template-columns: 1fr; gap: 3rem; }
	.footer-grid { grid-template-columns: repeat(2, 1fr); }

	/* Hide long decorative arrows; center the small ↓ glyphs */
	.sec-arrow,
	.stat-arrow {
		text-align: center;
		padding: 0 0 2rem 0;
	}
	.sec-arrow-top {
		left: 0;
		right: 0;
		text-align: center;
	}
}
@media (max-width: 599px) {
	/* .why-side-arrow { right: 1rem; } */
	.no-phone-deco { display: none; }

	/* Showcase: scale dots + popups to fit mobile viewport */
	.showcase-section { padding: 3rem 1rem; }
	.map-dot-1,
	.map-dot-2,
	.map-dot-3,
	.map-dot-4,
	.map-dot-5,
	.map-dot-6 { width: 60px; height: 60px; }
	.map-popup { width: 160px; padding: 0.7rem 0.8rem 0.65rem; }
	.map-popup-title { font-size: 0.9rem; margin-right: 1rem; }
	.map-popup-desc { font-size: 0.8rem; }
	/* Popups positioned to the right of the dot would overflow — flip them
	   to sit below-left, anchored within the map bounds */
	.map-popup-1 { top: calc(8% + 65px); left: 0; }
	.map-popup-1::before { top: -7px; left: 20px; bottom: auto; }
	.map-popup-2 { top: calc(15% + 65px); left: auto; right: 0; }
	.map-popup-2::before { top: -7px; right: 20px; left: auto; bottom: auto; }
	.map-popup-3 { top: calc(40% + 65px); right: 0; }
	.map-popup-3::before { top: -7px; right: 20px; bottom: auto; transform: rotate(45deg); }
	.map-popup-4 { top: calc(65% + 65px); left: 0; }
	.map-popup-4::before { top: -7px; left: 20px; bottom: auto; }
	.map-popup-5 { bottom: auto; top: calc(100% - 60px); right: 20%; }
	.map-popup-5::before { top: -7px; right: 20px; bottom: auto; transform: rotate(45deg); }
	/* Dot 6 sits mid-map: anchor the popup 20px left of the dot so its arrow
	   (43px in) lands on the dot's centre, and it stays inside the map bounds. */
	.map-popup-6 { top: calc(42% + 65px); left: calc(35% - 20px); }
	.map-popup-6::before { top: -7px; left: 43px; bottom: auto; }
}
@media (max-width: 575px) {
	.landing-nav { padding: 0.75rem 1rem; }
	.nav-right { gap: 0.5rem; }
	/* Narrower gutters so the map circle — now capped at the column width — keeps
	   the size it had when it was sized off 90vw. Matches .showcase-section. */
	.hero-section { padding: 5rem 1rem 3rem; }
	.footer-grid { grid-template-columns: 1fr; }
	/* The 190px logo tiles only fit one per row on a phone, so the list reads as
	   an endless single column. Let each tile take half the row instead. */
	.partner-logos { gap: 0.75rem; }
	.partner-logo-link { flex: 0 1 calc(50% - 0.375rem); max-width: 190px; }
	.partner-logo {
		width: 100%;
		height: 80px;
		padding: 0.6rem 0.8rem;
	}
}
</style>
