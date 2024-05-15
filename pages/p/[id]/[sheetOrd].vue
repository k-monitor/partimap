<script setup lang="ts">
// TODO spaghetti, need to decouple into multiple components/composables

import type { Feature as GeoJsonFeature } from 'geojson';
import type { Project } from '~/server/data/projects';
import type { Survey } from '~/server/data/surveyAnswers';

const { loading } = useStore();
loading.value = true;

const { user } = useAuth();
const { fullPath, params, query } = useRoute();
const forcedSheetOrd = user && query.force;
const visitId = useState('visitId', () => 0);

if (Number(params.sheetOrd) > 0 && !visitId.value && !forcedSheetOrd) {
	// before visitId generation, so it's a manual navigation
	navigateTo(`/p/${params.id}/0`);
} else {
	visitId.value = visitId.value || Date.now();
}

const { data: project } = await useFetch<Project>(`/api/project/access`, {
	method: 'POST',
	body: {
		idOrSlug: params.id,
		visitId: visitId.value,
	},
}); // FIXME test password protected project, should still parse response body when unauthorized

watchEffect(() => {
	if (project.value && params.id !== project.value.slug) {
		navigateTo(`/p/${project.value.slug}/${params.sheetOrd || 0}`);
	}
});

function goToSheetOrd(ord: number) {
	navigateTo(fullPath.replace(/[?#].*$/, '').replace(/\d+$/, String(ord)));
}

const {
	public: { baseUrl },
} = useRuntimeConfig();

const { t } = useI18n();

useHead({
	title: () => project.value?.title || t('sheet.restrictedTitle'),
	meta: () => [
		{
			name: 'description',
			content: project.value?.description || null,
		},
		{
			property: 'og:image',
			content: `${baseUrl}${project.value?.image || '/ogimage.png'}`,
		},
	],
});

const hit = useState('hit', () => false);

function registerHit() {
	if (project.value && !hit.value && Number(params.sheetOrd) === 0) {
		hit.value = true;
		$fetch(`/api/project/view/${params.id}`, { method: 'POST' });
		// no need to wait for it
	}
}

const sheet = computed(() => project.value?.sheets?.[Number(params.sheetOrd)]);
const interactions = computed(() => deserializeInteractions(sheet.value?.interactions));
provide('interactions', interactions);
provide('sheet', sheet);

const labels = computed(() => {
	const labels: Record<string, string> = {};
	if (!resultsShown.value || !sheet.value || !sheet.value?.ratings) return labels;
	Object.entries(sheet.value.ratings || {}).forEach(([id, r]) => {
		if (interactions.value?.stars === -2) {
			labels[id] = `👍 ${r.likeCount} 👎 ${Math.abs(r.dislikeCount)}`;
		} else if (interactions.value?.stars === 1) {
			labels[id] = `⭐ ${r.count}`;
		} else {
			const avg = Math.round(r.average * 10) / 10;
			labels[id] = `⭐ ${Number(avg).toFixed(1)}`;
		}
	});
	return labels;
});

const showOnlyResults = computed(() => {
	const survey: Survey = safeParseJSON(sheet.value?.survey) || {};
	return interactions.value?.enabled?.includes('ShowResultsOnly') || survey.showResultsOnly;
});

const visitorAnswers = computed(() => {
	// FIXME return this.getVisitorAnswers(this.sheet?.id);
	return {} as Record<string, any>;
});

const resultsData = computed(() => {
	if (showOnlyResults.value) return sheet.value?.answers || [];
	// Show results for only those questions that has been answered.
	const answeredIds = Object.keys(visitorAnswers.value || {}).filter(
		(id) => !!visitorAnswers.value?.[id],
	);
	return sheet.value?.answers?.filter((e) => answeredIds.includes(String(e.questionId))) || [];
});

const needToShowResults = computed(() => {
	// We will show results if we got results from server.
	// Server knows when to include results based on sheet settings.
	if (!sheet.value) return false;
	const haveAnswers = resultsData.value.length > 0;
	const haveRatings = sheet.value.ratings && Object.keys(sheet.value.ratings).length > 0;
	const haveResults = haveAnswers || haveRatings;
	return haveResults && !resultsShown.value;
});

const passwordInput = ref<HTMLInputElement>();
const resultsShown = ref(false);
onMounted(async () => {
	registerHit(); // no need to wait for it
	if (!project.value) {
		passwordInput.value?.focus();
	} else if (needToShowResults.value && showOnlyResults.value) {
		resultsShown.value = true;
	}

	loading.value = false;
});

function getAllVisitorAnswers() {
	// FIXME
	return {};
}

const availableSheetOrds = computed(() =>
	(project.value?.sheets || [])
		.filter((sheet) => {
			if (!sheet.survey) return true;
			const survey: Survey = safeParseJSON(sheet.survey) || {};
			const { questions } = survey;
			if (!questions || !questions.length) return true;
			const questionsAvailable = !!questions.find((q) => {
				return canShowQuestion(q, getAllVisitorAnswers());
			});
			return questionsAvailable;
		})
		.map((sheet) => sheet.ord),
);

const nextSheetOrd = computed(() =>
	availableSheetOrds.value.find((o) => o > (sheet.value?.ord || -1)),
);

const prevSheetOrd = computed(() => {
	const ords = [...availableSheetOrds.value];
	ords.reverse();
	return ords.find((o) => o < (sheet.value?.ord || -1));
});

const isFirstSheet = computed(() => typeof prevSheetOrd.value === 'undefined');
const isLastSheet = computed(() => typeof nextSheetOrd.value === 'undefined');

const { executeReCaptcha } = useReCaptcha();

const password = ref('');

const submitted = useState('submitted', () => false);

const isInteractive = computed(
	() =>
		interactions.value.enabled.includes('Point') ||
		interactions.value.enabled.includes('LineString') ||
		interactions.value.enabled.includes('Polygon'),
);

// FIXME
/*
function getVisitorFeatures(sheetId: number) {
	// FIXME
	return [];
}

function addVisitorFeature(feature: GeoJsonFeature) {
	if (!sheet.value) return;

	const cat = t(
		'FeatureListElement.defaultName.' + feature.getGeometry().getType(),
	);
	feature.set('category', cat);

	const features = getVisitorFeatures(sheet.value.id) || [];
	features.push(feature);
	const payload = { features, sheetId: this.sheet.id };
	this.$store.commit('visitordata/addFeatures', payload);
}

function delVisitorFeature(feature) {
	const features = this.getVisitorFeatures(this.sheet.id) || [];
	const idx = features.indexOf(feature);
	if (idx !== -1) {
		features.splice(idx, 1);
		const payload = { features, sheetId: this.sheet.id };
		this.$store.commit('visitordata/addFeatures', payload);
	}
}

function featuresFromRaw(featuresRaw) {
	const features = JSON.parse(featuresRaw);
	const featureCollection = { type: 'FeatureCollection', features };
	return features ? new GeoJSON().readFeatures(featureCollection) : [];
}

function loadInitFeatures() {
	const adminFeatures = this.featuresFromRaw(this.sheet.features);
	if (this.isInteractive) {
		// on interactive sheets, admin features cannot be selected
		adminFeatures.forEach((f) => f.set('hidden', true));
	}

	const visitorFeatures = this.getVisitorFeatures(this.sheet.id) || [];

	// adding "rating" to feature objects for graying effect on map and in FLE header
	const visitorRatings = this.getVisitorRatings(this.sheet.id) || {};
	adminFeatures.forEach((f) => {
		const ratingObj = visitorRatings[f.getId()];
		if (ratingObj?.value) f.set('rating', ratingObj.value);
	});

	return [...visitorFeatures, ...adminFeatures];
}

function next() {
	this.$store.commit('selected/clear');
	const sidebar = document.getElementsByClassName('b-sidebar-body')[0];
	if (sidebar) sidebar.scrollTop = 0;
	if (!this.$refs.sheetForm.reportValidity()) {
		return;
	}
	if (this.needToShowResults) {
		this.resultsShown = true;
	} else {
		this.goToSheetOrd(this.nextSheetOrd);
	}
}

function prev() {
	this.goToSheetOrd(this.prevSheetOrd);
}

async function sendPassword() {
	this.loading = true;
	const { password } = this;
	const projectId = this.$route.params.id;
	const visitId = this.$store.state.visitId;
	try {
		const captcha = await this.$recaptcha.execute('access');
		this.project = await this.$axios.$post('/api/project/access', {
			password,
			projectId,
			visitId,
			captcha,
		});
		this.sheet = this.project.sheets[this.$route.params.sheetOrd];
		this.registerHit();
	} catch (error) {
		if (error.message && error.message.endsWith('status code 401')) {
			this.errorToast(this.$t('sheet.invalidPassword'));
		} else {
			throw error; // let Nuxt handle it
		}
	} finally {
		this.password = null;
		this.$refs.password.focus();
		this.loading = false;
	}
}

async function submit() {
	this.$store.commit('selected/clear');
	const sidebar = document.getElementsByClassName('b-sidebar-body')[0];
	if (sidebar) sidebar.scrollTop = 0;
	if (!this.$refs.sheetForm.reportValidity()) {
		return;
	}
	this.loading = true;
	const sheetIds = this.project.sheets.map((s) => s.id);
	const data = this.getSubmissionData(sheetIds);
	if (Object.keys(data).length) {
		this.injectDataIntoFeatures(data);
		try {
			const captcha = await this.$recaptcha.execute('submit');
			await this.$axios.$post('/api/submission/' + this.project.id, {
				...data,
				captcha,
			});
			this.$store.commit('setSubmitted');
			this.success(this.$t('sheet.submitSuccess'));
		} catch {
			this.errorToast(this.$t('sheet.submitFailed'));
		}
	}
	this.loading = false;
}

function injectDataIntoFeatures(data) {
	const questions = {};
	const answers = {};

	// gather questions and answers to inject
	const str = (v) => (Array.isArray(v) ? v.join(', ') : v || '');
	this.project.sheets.forEach((sheet) => {
		try {
			const qs = JSON.parse(sheet.survey).questions;
			qs.filter((q) => q.addToFeatures).forEach((q) => {
				const ans = data[sheet.id]?.answers[q.id];
				if (Object.isExtensible(ans) && !Array.isArray(ans)) {
					// answer is {...}, so a matrix -> injecting rows separately
					Object.keys(ans).forEach((k, i) => {
						const qak = `${q.id}_${i}`;
						questions[qak] = `${q.label} [${k}]`;
						answers[qak] = str(ans[k]);
					});
				} else {
					questions[q.id] = q.label;
					answers[q.id] = str(ans);
				}
			});
		} catch {}
	});

	// inject into features
	Object.keys(data).forEach((sid) => {
		const features = data[sid].features;
		if (!features) return;
		for (let i = 0; i < features.length; i++) {
			const f = features[i];
			Object.keys(questions).forEach((qid) => {
				f.properties[`partimapQuestion_${qid}`] = questions[qid];
				f.properties[`partimapQuestion_${qid}_ans`] = answers[qid];
			});
		}
	});
}*/
</script>

<template>
	<h1>sheet</h1>
	<h1>{{ visitId }}</h1>
	<button @click="navigateTo('3')">GO TO 3</button>
	<!-- <SheetFrame
		v-if="project && sheet"
		:background-image-url="sheet.image"
		:class="{ branded: !!project.user.color }"
		:style="`--brand: ${project.user.color || '#007bff'}`"
	>
		<form
			ref="sheetForm"
			@submit.prevent=""
		>
			<b-modal
				v-if="!sheet.features"
				content-class="shadow-sm"
				footer-class="d-flex p-0"
				hide-backdrop
				no-close-on-backdrop
				no-close-on-esc
				no-fade
				scrollable
				static
				visible
			>
				<template #modal-header>
					<div class="d-flex justify-content-between w-100">
						<a
							v-b-tooltip.hover.bottom
							:href="localePath({ name: 'hogyan-mukodik' })"
							target="_blank"
							:title="$t('PublicFrame.help')"
						>
							<Logo />
						</a>
						<a
							:href="project.user.website"
							target="_blank"
						>
							<img
								v-if="project.user.logo"
								:src="project.user.logo"
								:alt="project.user.website"
								height="30"
							/>
						</a>
					</div>
				</template>
				<SheetContent
					:brand-color="project.user.color"
					:project="project"
					:results="resultsShown"
					:results-data="resultsData"
					:sheet="sheet"
					:show-consent="isFirstSheet"
				/>
				<LoadingOverlay :show="loading" />
				<template #modal-footer>
					<FooterButtons
						:disable-submit="loading || !getConsent || submitted"
						:show-next="!isLastSheet || needToShowResults"
						:show-prev="!isFirstSheet && !submitted"
						:show-submit="getConsent && isLastSheet && !needToShowResults"
						:step="sheet.ord + 1"
						:steps="project.sheets.length"
						@next="next"
						@prev="prev"
						@submit="submit"
					/>
				</template>
			</b-modal>
			<div v-else>
				<client-only>
					<Map
						:key="$route.path"
						:features="loadInitFeatures()"
						fit-selected
						:gray-rated="!resultsShown"
						:initial-base-map-key="interactions.baseMap"
						:labels="labels"
						visitor
						@visitor-feature-added="addVisitorFeature"
						@visitor-feature-removed="delVisitorFeature"
					/>
					<template #placeholder>
						<div class="h-100 position-absolute w-100 map" />
					</template>
				</client-only>
				<MapToolbar v-if="!!getDrawType" />
				<MapTask :interactions="interactions" />
				<MapHint />
				<Sidebar
					:fixed="!sheet.features"
					:loading="loading"
					:project="project"
				>
					<SheetContent
						:brand-color="project.user.color"
						class="mb-3"
						:project="project"
						:results="resultsShown"
						:results-data="resultsData"
						:sheet="sheet"
						:show-consent="isFirstSheet"
					/>
					<FeatureList
						v-if="!submitted"
						:show-results="resultsShown"
						:is-interactive="isInteractive"
						is-on-sheet-view
						visitor
					/>

					<template #footer>
						<FooterButtons
							:disable-submit="loading || !getConsent || submitted"
							:show-next="!isLastSheet || needToShowResults"
							:show-prev="!isFirstSheet && !submitted"
							:show-submit="getConsent && isLastSheet && !needToShowResults"
							:step="sheet.ord + 1"
							:steps="project.sheets.length"
							@next="next"
							@prev="prev"
							@submit="submit"
						/>
					</template>
				</Sidebar>
			</div>
		</form>
		<b-modal
			id="privacy-modal"
			hide-footer
			scrollable
			size="lg"
			:title="$t('sheet.privacyPolicy')"
		>
			<Terms :project-data-processor="project.privacyPolicy" />
		</b-modal>
	</SheetFrame>
	<div
		v-else
		class="container d-flex flex-column flex-grow-1"
	>
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="sendPassword">
					<div class="card m-3 shadow-sm">
						<h5 class="card-header">PARTIMAP</h5>
						<div class="card-body">
							<p>{{ $t('sheet.restricted') }}</p>
							<p>{{ $t('sheet.passwordRequired') }}</p>
							<div class="form-group">
								<b-input-group>
									<template #prepend>
										<b-input-group-text>
											<i class="fas fa-key fa-fw" />
										</b-input-group-text>
									</template>
									<b-form-input
										ref="passwordInput"
										v-model="password"
										:placeholder="$t('sheet.password')"
										type="password"
									/>
								</b-input-group>
							</div>
						</div>
						<div class="card-footer text-end">
							<button class="btn btn-primary">
								{{ $t('sheet.view') }}
								<i class="fas fa-sign-in-alt ms-1" />
							</button>
						</div>
						<LoadingOverlay :show="loading" />
					</div>
				</form>
			</div>
		</div>
	</div> -->
</template>
