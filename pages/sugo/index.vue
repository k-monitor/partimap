<script setup lang="ts">
defineI18nRoute({
	paths: {
		en: '/help',
		es: '/ayuda',
		lt: '/pagalba',
		de: '/hilfe',
	},
});

const localePath = useLocalePath();
const { t } = useI18n();

const sections = helpSections;

// Kept in the URL so a search can be linked and survives a reload.
const route = useRoute();
const router = useRouter();
const query = ref(typeof route.query.q === 'string' ? route.query.q : '');
watch(query, (q) => router.replace({ query: q ? { q } : {} }));

const results = computed(() =>
	searchHelp(query.value).map((hit) => ({
		key: `${hit.section.slug}/${hit.page.slug}`,
		section: hit.section.title,
		to: {
			path: localePath({ name: hit.section.route }),
			hash: `#${hit.page.slug}`,
		},
		title: highlightHelpMatches(hit.page.title, query.value),
		excerpt: highlightHelpMatches(hit.excerpt, query.value),
	})),
);

useHead({
	title: t('helpPage.title'),
});
</script>

<template>
	<LandingFrame>
		<section class="help-index">
			<div class="help-index-inner">
				<header>
					<h1>{{ t('helpPage.title') }}</h1>
					<div class="help-divider" />
				</header>

				<div class="help-search">
					<i
						aria-hidden="true"
						class="fas fa-search"
					/>
					<input
						v-model="query"
						:aria-label="t('helpPage.search')"
						:placeholder="t('helpPage.search')"
						type="search"
					>
					<button
						v-if="query"
						:aria-label="t('helpPage.clearSearch')"
						type="button"
						@click="query = ''"
					>
						<i
							aria-hidden="true"
							class="fas fa-times"
						/>
					</button>
				</div>

				<div
					v-if="query.trim()"
					class="help-results"
				>
					<p
						v-if="!results.length"
						class="help-no-results"
					>
						{{ t('helpPage.noResults', { query: query.trim() }) }}
					</p>
					<ul v-else>
						<li
							v-for="hit in results"
							:key="hit.key"
						>
							<NuxtLink :to="hit.to">
								<span class="help-result-section">{{ hit.section }}</span>
								<span class="help-result-title">
									<template
										v-for="(part, i) in hit.title"
										:key="i"
									>
										<mark v-if="part.match">{{ part.text }}</mark>
										<template v-else>{{ part.text }}</template>
									</template>
								</span>
								<span class="help-result-excerpt">
									<template
										v-for="(part, i) in hit.excerpt"
										:key="i"
									>
										<mark v-if="part.match">{{ part.text }}</mark>
										<template v-else>{{ part.text }}</template>
									</template>
								</span>
							</NuxtLink>
						</li>
					</ul>
				</div>

				<div
					v-else
					class="help-cards"
				>
					<section
						v-for="section in sections"
						:key="section.slug"
						class="help-card"
					>
						<h2>
							<NuxtLink :to="localePath({ name: section.route })">
								{{ section.title }}
							</NuxtLink>
						</h2>
						<ol>
							<li
								v-for="page in section.pages"
								:key="page.slug"
							>
								<NuxtLink
									:to="{
										path: localePath({ name: section.route }),
										hash: `#${page.slug}`,
									}"
								>
									{{ page.title }}
								</NuxtLink>
							</li>
						</ol>
					</section>
				</div>
			</div>
		</section>
	</LandingFrame>
</template>

<style scoped>
.help-index {
	font-family: 'Apex New', 'Segoe UI', sans-serif;
	padding: 3rem 2rem 6rem;
}
.help-index-inner {
	margin: 0 auto;
	max-width: 1100px;
}
.help-index h1 {
	color: #0055FF;
	font-size: clamp(1.8rem, 4vw, 2.6rem);
	font-weight: 500;
	margin-bottom: 1rem;
}
.help-divider {
	border-top: 1.5px solid #0055FF;
	margin-bottom: 2.5rem;
}

.help-search {
	align-items: center;
	background: rgba(255, 255, 255, 0.75);
	border: 1.5px solid rgba(0, 85, 255, 0.35);
	border-radius: 10px;
	display: flex;
	gap: 0.7rem;
	margin-bottom: 2.5rem;
	padding: 0.7rem 1rem;
	transition: border-color 0.15s;
}
.help-search:focus-within {
	border-color: #0055FF;
}
.help-search .fa-search {
	color: rgba(0, 85, 255, 0.7);
	flex: none;
}
.help-search input {
	background: none;
	border: 0;
	color: #333;
	flex: 1;
	font-family: inherit;
	font-size: 0.95rem;
	min-width: 0;
	outline: none;
}
.help-search input::placeholder {
	color: #888;
}
.help-search input::-webkit-search-cancel-button {
	display: none;
}
.help-search button {
	background: none;
	border: 0;
	color: #666;
	flex: none;
	line-height: 1;
	padding: 0.2rem 0.3rem;
}
.help-search button:hover {
	color: #0055FF;
}

.help-no-results {
	color: #555;
	font-size: 0.9rem;
}
.help-results ul {
	list-style: none;
	margin: 0;
	padding: 0;
}
.help-results li + li {
	margin-top: 0.5rem;
}
.help-results a {
	border: 1.5px solid rgba(0, 85, 255, 0.2);
	border-radius: 10px;
	display: block;
	padding: 0.9rem 1.1rem;
	text-decoration: none;
	transition: background 0.15s, border-color 0.15s;
}
.help-results a:hover {
	background: rgba(255, 255, 255, 0.55);
	border-color: #0055FF;
}
.help-result-section {
	color: #0055FF;
	display: block;
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	margin-bottom: 0.2rem;
	text-transform: uppercase;
}
.help-result-title {
	color: #0055FF;
	display: block;
	font-size: 1rem;
	font-weight: 700;
	line-height: 1.3;
	margin-bottom: 0.3rem;
}
.help-result-excerpt {
	color: #444;
	display: block;
	font-size: 0.85rem;
	line-height: 1.6;
}
.help-results mark {
	background: rgba(255, 193, 7, 0.45);
	color: inherit;
	padding: 0;
}

.help-cards {
	display: grid;
	gap: 2rem;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
.help-card {
	background: rgba(255, 255, 255, 0.55);
	border: 1.5px solid rgba(0, 85, 255, 0.35);
	border-radius: 12px;
	padding: 1.5rem;
}
.help-card h2 {
	font-size: 1.15rem;
	font-weight: 700;
	line-height: 1.3;
	margin-bottom: 1rem;
}
.help-card h2 a {
	color: #0055FF;
	text-decoration: none;
}
.help-card h2 a:hover {
	text-decoration: underline;
}
.help-card ol {
	color: rgba(0, 85, 255, 0.6);
	margin: 0;
	padding-left: 1.25rem;
}
.help-card li {
	margin-bottom: 0.4rem;
}
.help-card li a {
	color: #333;
	font-size: 0.85rem;
	line-height: 1.4;
	text-decoration: none;
}
.help-card li a:hover {
	color: #0055FF;
	text-decoration: underline;
}

</style>
