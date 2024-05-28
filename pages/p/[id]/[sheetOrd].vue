<script setup lang="ts">
// TODO spaghetti, need to decouple into multiple components/composables

import type { Feature as GeoJsonFeature } from 'geojson';
import type { Project } from '~/server/data/projects';
import type { Survey } from '~/server/data/surveyAnswers';

const localePath = useLocalePath();

const { consent, drawType, loading, selectedFeatureId, submitted } = useStore();
loading.value = true;

const {
	getAllVisitorAnswers,
	getSubmissionData,
	getVisitorAnswers,
	getVisitorFeatures,
	getVisitorRatings,
	setVisitorFeatures,
} = useVisitorData();

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

const password = ref('');
const { data: project } = await useFetch<Project>(`/api/project/access`, {
	method: 'POST',
	body: {
		idOrSlug: params.id,
		visitId: visitId.value,
	},
	ignoreResponseError: true,
});

watchEffect(() => {
	if (project.value?.slug && params.id !== project.value.slug) {
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

const visitorAnswers = computed(() => (sheet.value ? getVisitorAnswers(sheet.value?.id) : {}));

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
onMounted(() => {
	registerHit(); // no need to wait for it
	if (!project.value) {
		passwordInput.value?.focus();
	} else if (needToShowResults.value && showOnlyResults.value) {
		resultsShown.value = true;
	}

	loading.value = false;
});

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

const nextSheetOrd = computed(() => {
	const o = availableSheetOrds.value.find((o) => o > Number(sheet.value?.ord));
	return typeof o === 'undefined' ? -1 : o;
});

const prevSheetOrd = computed(() => {
	const ords = [...availableSheetOrds.value].reverse();
	const o = ords.find((o) => o < Number(sheet.value?.ord));
	return typeof o === 'undefined' ? -1 : o;
});

const isFirstSheet = computed(() => prevSheetOrd.value < 0);
const isLastSheet = computed(() => nextSheetOrd.value < 0);

const isInteractive = computed(
	() =>
		interactions.value.enabled.includes('Point') ||
		interactions.value.enabled.includes('LineString') ||
		interactions.value.enabled.includes('Polygon'),
);

const features = ref<GeoJsonFeature[]>([]);
const isSheetLoaded = computed(() => !!sheet.value);
watchEffect(() => {
	if (!isSheetLoaded.value || !sheet.value) return;

	const adminFeatures = safeParseJSONArray(sheet.value.features) as GeoJsonFeature[];
	if (isInteractive.value) {
		// on interactive sheets, admin features cannot be selected
		adminFeatures.forEach((f) => {
			f.properties = f.properties || {};
			f.properties.hidden = true;
		});
	}

	const visitorFeatures = getVisitorFeatures(sheet.value.id) || [];

	// adding "rating" to feature objects for graying effect on map and in FLE header
	const visitorRatings = getVisitorRatings(sheet.value.id) || {};
	adminFeatures.forEach((f) => {
		const ratingObj = visitorRatings[Number(f.id)];
		if (ratingObj?.value) {
			f.properties = f.properties || {};
			f.properties.rating = ratingObj.value;
		}
	});

	features.value = [...visitorFeatures, ...adminFeatures];
});

function handleFeatureDrawn(feature: GeoJsonFeature) {
	if (!sheet.value) return;

	const cat = t(`FeatureListElement.defaultName.${feature.geometry.type}`);
	feature.properties = feature.properties || {};
	feature.properties.category = cat;

	//const features = getVisitorFeatures(sheet.value.id) || [];
	features.value.push(feature);
	//setVisitorFeatures(sheet.value.id, features);
}

const currentVisitorFeaturesJSON = computed(() =>
	JSON.stringify(features.value.filter((f) => f.properties?.visitorFeature)),
);
watch(currentVisitorFeaturesJSON, () => {
	if (!sheet.value) return;
	// visitor features are edited or deleted in FeatureList
	// or a new visitor feature is drawn on Map
	const _visitorFeatures = features.value.filter((f) => f.properties?.visitorFeature);
	setVisitorFeatures(sheet.value?.id, _visitorFeatures);
});

const { executeReCaptcha } = useReCaptcha();

const { errorToast, successToast } = useToasts();

async function sendPassword() {
	try {
		loading.value = true;
		const captcha = (await executeReCaptcha('access')) || '';
		project.value = await $fetch<Project>('/api/project/access', {
			method: 'POST',
			body: {
				captcha: captcha,
				idOrSlug: params.id,
				password: password.value,
				visitId: visitId.value,
			},
		});
		registerHit();
	} catch (error: any) {
		if (error.message && error.message.endsWith('status code 401')) {
			errorToast(t('sheet.invalidPassword'));
		} else {
			throw error; // let Nuxt handle it
		}
	} finally {
		password.value = '';
		passwordInput.value?.focus();
		loading.value = false;
	}
}

function prev() {
	goToSheetOrd(prevSheetOrd.value);
}

const sheetForm = ref<HTMLFormElement>();

function next() {
	selectedFeatureId.value = null;
	document.querySelector('.sidebar-body')?.scrollTo(0, 0);
	if (!sheetForm.value || !sheetForm.value.reportValidity()) {
		return;
	}
	if (needToShowResults.value) {
		resultsShown.value = true;
	} else {
		goToSheetOrd(nextSheetOrd.value);
	}
}

function injectDataIntoFeatures(data: SubmissionDataBySheet) {
	const questions: Record<string, string> = {};
	const answers: Record<string, string> = {};

	// gather questions and answers to inject
	const str = (v: any) => (Array.isArray(v) ? v.join(', ') : v || '');
	(project.value?.sheets || []).forEach((sheet) => {
		const survey: Survey = safeParseJSON(sheet.survey) || {};
		const qs = survey.questions || [];
		qs.filter((q) => q.addToFeatures).forEach((q) => {
			const sheetAnswers = data[sheet.id]?.answers || {};
			if (Object.keys(sheetAnswers).includes(String(q.id))) return;
			const ans = sheetAnswers[q.id];
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
	});

	// inject into features
	Object.keys(data).forEach((sid) => {
		const features = data[Number(sid)].features;
		if (!features) return;
		for (let i = 0; i < features.length; i++) {
			const f = features[i];
			Object.keys(questions).forEach((qid) => {
				f.properties = f.properties || {};
				f.properties[`partimapQuestion_${qid}`] = questions[qid];
				f.properties[`partimapQuestion_${qid}_ans`] = answers[qid];
			});
		}
	});
}

async function submit() {
	document.querySelector('.sidebar-body')?.scrollTo(0, 0);
	if (
		!project.value ||
		!project.value.sheets ||
		!sheetForm.value ||
		!sheetForm.value.reportValidity()
	) {
		return;
	}
	loading.value = true;

	const sheetIds = project.value.sheets.map((s) => s.id);
	const data = getSubmissionData(sheetIds);
	if (Object.keys(data).length) {
		try {
			injectDataIntoFeatures(data);
			const captcha = await executeReCaptcha('submit');
			await $fetch(`/api/project/${project.value.id}/submission`, {
				method: 'PUT',
				body: {
					...data,
					captcha,
				},
			});
			submitted.value = true;
			successToast(t('sheet.submitSuccess'));
		} catch {
			errorToast(t('sheet.submitFailed'));
		}
	}
	loading.value = false;
}
</script>

<template>
	<SheetFrame
		v-if="project && sheet"
		:background-image-url="sheet.image"
		:class="{ branded: !!project.user?.color }"
		:style="`--brand: ${project.user?.color || '#007bff'}`"
	>
		<form
			ref="sheetForm"
			class="d-flex h-100 w-100"
			@submit.prevent=""
		>
			<div
				v-if="!sheet.features"
				class="modal show"
				style="display: block"
			>
				<div class="modal-dialog modal-dialog-scrollable">
					<div class="modal-content shadow-sm">
						<div class="modal-header">
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
									:href="project.user?.website"
									target="_blank"
								>
									<img
										v-if="project.user?.logo"
										:src="project.user.logo"
										:alt="project.user?.website"
										height="30"
									/>
								</a>
							</div>
						</div>
						<div class="modal-body">
							<SheetContent
								:brand-color="project.user?.color"
								:project="project"
								:results="resultsShown"
								:results-data="resultsData"
								:sheet="sheet"
								:show-consent="isFirstSheet"
							/>
							<LoadingOverlay :show="loading" />
						</div>
						<div class="modal-footer d-flex p-0">
							<FooterButtons
								:disable-submit="loading || !consent || submitted"
								:show-next="!isLastSheet || needToShowResults"
								:show-prev="!isFirstSheet && !submitted"
								:show-submit="consent && isLastSheet && !needToShowResults"
								:step="sheet.ord + 1"
								:steps="project.sheets?.length || 0"
								@next="next"
								@prev="prev"
								@submit="submit"
							/>
						</div>
					</div>
				</div>
			</div>
			<template v-else>
				<Sidebar
					:fixed="!sheet.features"
					:loading="loading"
					:project="project"
				>
					<SheetContent
						:brand-color="project.user?.color"
						class="mb-3"
						:project="project"
						:results="resultsShown"
						:results-data="resultsData"
						:sheet="sheet"
						:show-consent="isFirstSheet"
					/>
					<FeatureList
						v-if="!submitted"
						v-model="features"
						:show-results="resultsShown"
						:is-interactive="isInteractive"
						is-on-sheet-view
					/>

					<template #footer>
						<FooterButtons
							:disable-submit="loading || !consent || submitted"
							:show-next="!isLastSheet || needToShowResults"
							:show-prev="!isFirstSheet && !submitted"
							:show-submit="consent && isLastSheet && !needToShowResults"
							:step="sheet.ord + 1"
							:steps="project.sheets?.length || 0"
							@next="next"
							@prev="prev"
							@submit="submit"
						/>
					</template>
				</Sidebar>
				<div
					v-if="sheet.features"
					class="flex-grow-1"
				>
					<Map
						:key="$route.path"
						:features="features"
						fit-selected
						:gray-rated="!resultsShown"
						:label-overrides="labels"
						visitor
						@feature-drawn="handleFeatureDrawn"
					/>
					<MapToolbar v-if="!!drawType" />
					<MapTask :interactions="interactions" />
					<MapHint />
				</div>
			</template>
		</form>
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
								<div class="input-group">
									<div class="input-group-text">
										<i class="fas fa-key fa-fw" />
									</div>
									<input
										ref="passwordInput"
										v-model="password"
										class="form-control"
										:placeholder="$t('sheet.password')"
										type="password"
									/>
								</div>
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
	</div>
</template>
