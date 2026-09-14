<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();

withDefaults(
	defineProps<{
		showSearch?: boolean;
	}>(),
	{ showSearch: false },
);

// "HOGYAN MŰKÖDIK" dropdown items. "whatIs" leads the list and points to the
// PARTIMAP intro page; the rest link to their matching Súgó section.
const howItWorksSubmenu = computed(() => [
	{ key: 'whatIs', to: localePath({ name: 'partimaprol' }) },
	{ key: 'respondents', to: localePath({ name: 'sugo-kitoltoknek' }) },
	{ key: 'create', to: localePath({ name: 'sugo-keszites' }) },
	{ key: 'analyze', to: localePath({ name: 'sugo-elemzes' }) },
	{ key: 'plan', to: localePath({ name: 'sugo-projekt' }) },
	{ key: 'questionnaire', to: localePath({ name: 'sugo-kerdoiv' }) },
	{ key: 'methodology', to: localePath({ name: 'sugo-modszertan' }) },
]);

const contactSubmenu = computed(() => [
	{ key: 'rolunk', to: localePath({ name: 'rolunk' }) },
	{ key: 'impresszum', to: localePath({ name: 'impresszum' }) },
]);

// Below the lg breakpoint the horizontal links do not fit, so they move into
// this collapsible panel.
const menuOpen = ref(false);
const route = useRoute();
watch(
	() => route.fullPath,
	() => {
		menuOpen.value = false;
	},
);

// The brand links home; when we are already there, navigating is a no-op, so
// scroll back to the top instead.
const onBrandPage = computed(() => {
	const strip = (p: string) => p.replace(/\/+$/, '');
	return strip(route.path) === strip(localePath('/'));
});

function onBrandClick(e: MouseEvent) {
	if (!onBrandPage.value) return;
	e.preventDefault();
	menuOpen.value = false;

	window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
	<nav class="landing-nav">
		<div class="nav-inner">
			<NuxtLink :to="localePath('/')" class="nav-brand" @click="onBrandClick">
				<img src="/logo_kek.png" alt="PARTIMAP" />
			</NuxtLink>

			<div v-if="showSearch" class="nav-search d-none d-lg-flex">
				<i class="fas fa-search" />
				<input type="text" :placeholder="t('landing.nav.search')" />
			</div>

			<div class="nav-links d-none d-lg-flex">
				<NuxtLink :to="localePath({ name: 'partimaprol' })" class="nav-link-item">
					{{ t('landing.nav.about') }}
				</NuxtLink>
				<div class="nav-dropdown">
					<NuxtLink :to="localePath({ name: 'sugo' })" class="nav-link-item nav-dropdown-toggle">
						<span class="nav-dropdown-label">{{ t('landing.nav.aboutUs') }}</span>
						<span class="nav-dropdown-caret" aria-hidden="true">▾</span>
					</NuxtLink>
					<div class="nav-dropdown-menu">
						<NuxtLink
							v-for="item in howItWorksSubmenu"
							:key="item.key"
							:to="item.to"
							class="nav-dropdown-item"
						>
							{{ t(`landing.nav.aboutSubmenu.${item.key}`) }}
						</NuxtLink>
					</div>
				</div>
				<NuxtLink :to="localePath({ name: 'arazas' })" class="nav-link-item">
					{{ t('landing.nav.pricing') }}
				</NuxtLink>
				<div class="nav-dropdown">
					<button type="button" class="nav-link-item nav-dropdown-toggle nav-dropdown-btn">
						<span class="nav-dropdown-label">{{ t('landing.nav.contact') }}</span>
						<span class="nav-dropdown-caret" aria-hidden="true">▾</span>
					</button>
					<div class="nav-dropdown-menu">
						<NuxtLink
							v-for="item in contactSubmenu"
							:key="item.key"
							:to="item.to"
							class="nav-dropdown-item"
						>
							{{ t(`landing.nav.contactSubmenu.${item.key}`) }}
						</NuxtLink>
					</div>
				</div>
				<a
					:href="t('landing.tryLink')"
					target="_blank"
					class="nav-btn-filled"
				>{{ t('landing.nav.tryIt') }}</a>
			</div>

			<b-navbar-nav class="nav-right">
				<LangSwitcher />
				<li class="nav-item nav-login-item d-none d-lg-block">
					<NuxtLink :to="localePath('/admin')" class="nav-btn-outline">
						{{ t('landing.nav.login') }}
					</NuxtLink>
				</li>
			</b-navbar-nav>

			<button
				type="button"
				class="nav-toggle d-lg-none"
				:aria-label="t('landing.nav.menu')"
				aria-controls="landing-nav-menu"
				:aria-expanded="menuOpen"
				@click="menuOpen = !menuOpen"
			>
				<i class="fas" :class="menuOpen ? 'fa-times' : 'fa-bars'" />
			</button>
		</div>

		<Transition name="nav-panel">
			<div v-show="menuOpen" id="landing-nav-menu" class="nav-panel d-lg-none">
				<div v-if="showSearch" class="nav-panel-search">
					<i class="fas fa-search" />
					<input type="text" :placeholder="t('landing.nav.search')" />
				</div>

				<NuxtLink :to="localePath({ name: 'partimaprol' })" class="nav-panel-link">
					{{ t('landing.nav.about') }}
				</NuxtLink>

				<NuxtLink :to="localePath({ name: 'sugo' })" class="nav-panel-link">
					{{ t('landing.nav.aboutUs') }}
				</NuxtLink>
				<NuxtLink
					v-for="item in howItWorksSubmenu"
					:key="item.key"
					:to="item.to"
					class="nav-panel-link nav-panel-sublink"
				>
					{{ t(`landing.nav.aboutSubmenu.${item.key}`) }}
				</NuxtLink>

				<NuxtLink :to="localePath({ name: 'arazas' })" class="nav-panel-link">
					{{ t('landing.nav.pricing') }}
				</NuxtLink>

				<span class="nav-panel-link nav-panel-heading">{{ t('landing.nav.contact') }}</span>
				<NuxtLink
					v-for="item in contactSubmenu"
					:key="item.key"
					:to="item.to"
					class="nav-panel-link nav-panel-sublink"
				>
					{{ t(`landing.nav.contactSubmenu.${item.key}`) }}
				</NuxtLink>

				<div class="nav-panel-actions">
					<a
						:href="t('landing.tryLink')"
						target="_blank"
						class="nav-btn-filled"
					>{{ t('landing.nav.tryIt') }}</a>
					<NuxtLink :to="localePath('/admin')" class="nav-btn-outline">
						{{ t('landing.nav.login') }}
					</NuxtLink>
				</div>
			</div>
		</Transition>
	</nav>
</template>

<style scoped>
.landing-nav {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	padding: 1rem 2rem;
	backdrop-filter: blur(8px);
	background: rgba(237, 228, 211, 0.45);
}
.nav-inner {
	max-width: 1200px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	gap: 1.5rem;
}
.nav-brand {
	flex-shrink: 0;
}
.nav-brand img {
	height: 28px;
	width: auto;
	display: block;
}
.nav-search {
	flex: 0 1 260px;
	display: flex;
	align-items: center;
	gap: 0.6rem;
	background: rgba(255, 255, 255, 0.6);
	border: 1px solid var(--l-blue);
	border-radius: 2rem;
	padding: 0.55rem 1.2rem;
}
.nav-search i {
	color: var(--l-blue);
	font-size: 0.8rem;
}
.nav-search input {
	flex: 1;
	background: transparent;
	border: none;
	outline: none;
	font-family: var(--l-font);
	font-size: 0.85rem;
	color: var(--l-text);
}
.nav-links {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	margin-left: auto;
}
.nav-link-item {
	color: var(--l-blue);
	font-size: 0.8rem;
	font-weight: 500;
	letter-spacing: 0.08em;
	text-decoration: none;
	white-space: nowrap;
}
.nav-link-item:hover { text-decoration: underline; }
.nav-dropdown {
	position: relative;
}
.nav-dropdown-toggle {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
}
.nav-dropdown-btn {
	background: none;
	border: none;
	padding: 0;
	font-family: inherit;
	cursor: pointer;
}
/* Underline the label only, never the caret: the caret's 180° rotation would
   flip an inherited underline above the arrow. */
.nav-dropdown-toggle:hover,
.nav-dropdown-toggle:focus-visible {
	text-decoration: none;
}
.nav-dropdown-toggle:hover .nav-dropdown-label,
.nav-dropdown-toggle:focus-visible .nav-dropdown-label {
	text-decoration: underline;
}
.nav-dropdown-caret {
	display: inline-block;
	font-size: 0.65rem;
	line-height: 1;
	transition: transform 0.2s ease;
}
.nav-dropdown:hover .nav-dropdown-caret,
.nav-dropdown:focus-within .nav-dropdown-caret {
	transform: rotate(180deg);
}
.nav-dropdown-menu {
	position: absolute;
	top: 100%;
	left: 0;
	min-width: 280px;
	background: rgba(255, 255, 255, 0.96);
	backdrop-filter: blur(8px);
	border: 1.5px solid var(--l-blue);
	border-radius: 12px;
	padding: 0.5rem 0;
	margin-top: 0.5rem;
	box-shadow: 0 8px 24px rgba(0, 85, 255, 0.12);
	opacity: 0;
	visibility: hidden;
	transform: translateY(-4px);
	transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s ease;
	z-index: 200;
}
.nav-dropdown:hover .nav-dropdown-menu,
.nav-dropdown:focus-within .nav-dropdown-menu {
	opacity: 1;
	visibility: visible;
	transform: translateY(0);
}
.nav-dropdown-item {
	display: block;
	padding: 0.55rem 1.1rem;
	color: var(--l-blue);
	font-size: 0.8rem;
	font-weight: 500;
	text-decoration: none;
	white-space: normal;
	line-height: 1.35;
}
.nav-dropdown-item:hover {
	background: rgba(0, 85, 255, 0.08);
	text-decoration: none;
}
.nav-btn-filled {
	background: var(--l-blue);
	color: #fff !important;
	font-size: 0.9rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	/* +0.125em top / -0.125em bottom optically centres the caps: Apex New's
	   ascent equals its cap height, so the descent space all sits below. */
	padding: calc(0.6rem + 0.125em) 1.6rem calc(0.6rem - 0.125em);
	border-radius: 2rem;
	text-decoration: none;
	white-space: nowrap;
}
.nav-btn-filled:hover { opacity: 0.9; }
.nav-right {
	display: flex !important;
	flex-direction: row !important;
	align-items: center;
	gap: 0.5rem;
	margin-left: auto;
	list-style: none;
	margin-bottom: 0;
	padding-left: 0;
}
.nav-right :deep(.nav-item) {
	list-style: none;
}
.nav-item {
	color: var(--l-blue);
}
.nav-login-item {
	list-style: none;
}
.nav-login-item :deep(.nav-link) {
	padding: 0;
}
.nav-btn-outline {
	border: 1.5px solid var(--l-blue);
	color: var(--l-blue);
	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	padding: calc(0.55rem + 0.125em) 1.6rem calc(0.55rem - 0.125em);
	border-radius: 2rem;
	text-decoration: none;
	white-space: nowrap;
}
.nav-btn-outline:hover {
	background: var(--l-blue);
	color: #fff;
}

.nav-toggle {
	background: none;
	border: none;
	padding: 0.25rem 0;
	margin-left: 0;
	color: var(--l-blue);
	font-size: 1.35rem;
	line-height: 1;
	cursor: pointer;
}
.nav-panel {
	max-width: 1200px;
	margin: 1rem auto 0;
	display: flex;
	flex-direction: column;
	background: rgba(255, 255, 255, 0.96);
	backdrop-filter: blur(8px);
	border: 1.5px solid var(--l-blue);
	border-radius: 12px;
	padding: 0.5rem 0;
	box-shadow: 0 8px 24px rgba(0, 85, 255, 0.12);
	/* The bar is fixed, so a long panel needs its own scroll area. */
	max-height: calc(100vh - 6rem);
	overflow-y: auto;
}
.nav-panel-link {
	padding: 0.6rem 1.1rem;
	color: var(--l-blue);
	font-size: 0.85rem;
	font-weight: 500;
	letter-spacing: 0.04em;
	text-decoration: none;
	line-height: 1.35;
}
a.nav-panel-link:hover {
	background: rgba(0, 85, 255, 0.08);
	text-decoration: none;
}
.nav-panel-heading {
	cursor: default;
}
.nav-panel-sublink {
	padding-left: 2rem;
	font-weight: 400;
	letter-spacing: 0;
}
.nav-panel-search {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	margin: 0.25rem 1.1rem 0.5rem;
	background: rgba(255, 255, 255, 0.6);
	border: 1px solid var(--l-blue);
	border-radius: 2rem;
	padding: 0.5rem 1.1rem;
}
.nav-panel-search i {
	color: var(--l-blue);
	font-size: 0.8rem;
}
.nav-panel-search input {
	flex: 1;
	min-width: 0;
	background: transparent;
	border: none;
	outline: none;
	font-family: var(--l-font);
	font-size: 0.85rem;
	color: var(--l-text);
}
.nav-panel-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	padding: 0.75rem 1.1rem 0.25rem;
}
.nav-panel-enter-active,
.nav-panel-leave-active {
	transition: opacity 0.18s ease, transform 0.18s ease;
}
.nav-panel-enter-from,
.nav-panel-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}

@media (max-width: 575px) {
	.landing-nav { padding: 0.75rem 1rem; }
	.nav-right { gap: 0.5rem; }
	.nav-panel-actions .nav-btn-filled,
	.nav-panel-actions .nav-btn-outline {
		flex: 1;
		text-align: center;
	}
}
</style>
