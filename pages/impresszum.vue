<script setup lang="ts">
defineI18nRoute({
	paths: {
		en: '/imprint',
		es: '/aviso-legal',
		lt: '/rekvizitai',
		de: '/impressum',
	},
});

const { t } = useI18n();
const localePath = useLocalePath();

useHead({
	title: t('impresszum.title'),
});
</script>

<template>
	<LandingFrame>
		<section class="imprint-section">
			<!-- <div class="imprint-blob imprint-blob-1" aria-hidden="true" /> -->
			<div class="imprint-blob imprint-blob-2" aria-hidden="true" />
			<div class="imprint-blob imprint-blob-3" aria-hidden="true" />
			<div class="imprint-outline imprint-outline-1" aria-hidden="true" />
			<div class="imprint-outline imprint-outline-2" aria-hidden="true" />
			<div class="imprint-inner">
				<h1>{{ t('impresszum.title') }}</h1>

				<h2>{{ t('impresszum.aboutTitle') }}</h2>
				<p>{{ t('impresszum.aboutDesc') }}</p>

				<h2>{{ t('impresszum.sourceTitle') }}</h2>
				<p>{{ t('impresszum.sourceDesc') }}</p>
				<p>
					<a href="https://github.com/k-monitor/partimap" target="_blank" rel="noopener">
						{{ t('impresszum.githubLink') }}
					</a>
				</p>

				<h2>{{ t('impresszum.dataTitle') }}</h2>
				<p>{{ t('impresszum.dataDesc') }}</p>

				<h2>{{ t('impresszum.copyrightTitle') }}</h2>
				<p>{{ t('impresszum.copyrightDesc') }}</p>

				<p class="imprint-feedback">{{ t('impresszum.feedbackNote') }}</p>
				<p>
					{{ t('impresszum.moreInfoBefore') }}
					<NuxtLink :to="localePath({ name: 'rolunk' })">{{ t('impresszum.moreInfoLink') }}</NuxtLink>
					{{ t('impresszum.moreInfoAfter') }}
				</p>

				<dl class="imprint-details">
					<div class="imprint-row">
						<dt>{{ t('impresszum.operatorLabel') }}:</dt>
						<dd>{{ t('impresszum.operator') }}</dd>
					</div>
					<div class="imprint-row">
						<dt>{{ t('impresszum.hqLabel') }}:</dt>
						<dd>{{ t('impresszum.hq') }}</dd>
					</div>
					<div class="imprint-row">
						<dt>{{ t('impresszum.officeLabel') }}:</dt>
						<dd>{{ t('impresszum.office') }}</dd>
					</div>
					<div class="imprint-row">
						<dt>{{ t('impresszum.phoneLabel') }}:</dt>
						<dd><a :href="`tel:${t('impresszum.phone').replace(/\s/g, '')}`">{{ t('impresszum.phone') }}</a></dd>
					</div>
					<div class="imprint-row">
						<dt>{{ t('impresszum.taxLabel') }}:</dt>
						<dd>{{ t('impresszum.tax') }}</dd>
					</div>
					<div class="imprint-row">
						<dt>{{ t('impresszum.emailLabel') }}:</dt>
						<dd>
							<a :href="`mailto:${t('impresszum.email')}`">{{ t('impresszum.email') }}</a>,
							<a :href="`mailto:${t('impresszum.email2')}`">{{ t('impresszum.email2') }}</a>
						</dd>
					</div>
					<div class="imprint-row">
						<dt>{{ t('impresszum.leadLabel') }}:</dt>
						<dd>
							{{ t('impresszum.lead') }} –
							<a :href="`mailto:${t('impresszum.leadEmail')}`">{{ t('impresszum.leadEmail') }}</a>
						</dd>
					</div>
				</dl>
			</div>
		</section>
	</LandingFrame>
</template>

<style scoped>
.imprint-section {
	padding: 4rem 2rem 6rem;
	font-family: 'Apex New', 'Segoe UI', sans-serif;
	position: relative;
	overflow: hidden;
	min-height: calc(100vh - 80px);
}
.imprint-inner {
	position: relative;
	z-index: 1;
	max-width: 720px;
	margin: 0 auto;
}

/* ── Background Gradient Blobs ────────────────────────── */
.imprint-blob {
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
	filter: blur(80px);
	z-index: 0;
}
.imprint-blob-1 { width: 500px; height: 400px; top: -80px; right: -120px; background: rgba(0, 85, 255, 0.3); }
.imprint-blob-2 { width: 450px; height: 450px; top: 45%; left: -180px; background: rgba(0, 85, 255, 0.3); }
.imprint-blob-3 { width: 300px; height: 300px; bottom: 220px; right: 8%; background: rgba(0, 85, 255, 0.4); }

/* ── Decorative circle outlines ───────────────────────── */
.imprint-outline {
	position: absolute;
	border: 1.5px solid #0055FF;
	border-radius: 50%;
	pointer-events: none;
	opacity: 0.6;
	z-index: 0;
}
.imprint-outline-1 { width: 280px; height: 280px; top: 140px; left: 80px; }
.imprint-outline-2 { width: 180px; height: 180px; bottom: 260px; right: 90px; }
@media (max-width: 1450px) {
	.imprint-outline {
		display: none;
	}
}
.imprint-inner h1 {
	color: #0055FF;
	font-size: clamp(2rem, 4.5vw, 3rem);
	font-weight: 500;
	margin-bottom: 1.5rem;
}
.imprint-inner h2 {
	color: #0055FF;
	font-size: 1.25rem;
	font-weight: 500;
	margin-top: 2rem;
	margin-bottom: 0.5rem;
}
.imprint-inner p {
	font-size: 0.95rem;
	color: #333;
	opacity: 0.9;
	line-height: 1.6;
	margin-bottom: 0.5rem;
}
.imprint-feedback {
	margin-top: 2rem;
}
.imprint-inner a {
	color: #0055FF;
	text-decoration: none;
}
.imprint-inner a:hover {
	text-decoration: underline;
}
.imprint-details {
	margin-top: 2rem;
	font-size: 0.95rem;
	color: #333;
}
.imprint-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem;
	margin-bottom: 0.35rem;
}
.imprint-row dt {
	font-weight: 500;
	flex-shrink: 0;
}
.imprint-row dd {
	margin: 0;
	opacity: 0.9;
}
</style>
