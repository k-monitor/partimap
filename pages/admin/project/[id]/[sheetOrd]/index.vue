<script setup lang="ts">
import type { Project } from '~/server/data/projects';
import type { AggregatedRating } from '~/server/data/ratings';
import type { Sheet } from '~/server/data/sheets';
import type { Question, Survey } from '~/server/data/surveyAnswers';

const { locale, t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { id, sheetOrd } = route.params;

const { data: project } = await useFetch<Project>(`/api/project/${id}`);

const sheet = ref<Sheet | undefined>();
const interactions = ref<Interactions>(deserializeInteractions(undefined));

const endpoint = computed(() => `/api/sheet/${sheet.value?.id}/ratings`);
const { data: ratings } = await useFetch<Record<number, AggregatedRating>>(endpoint);

function init() {
	// TODO this doesn't feel elegant but now I'm just migrating from asyncData

	sheet.value = project.value?.sheets?.[Number(sheetOrd)]; // sheets are ordered on server
	if (!sheet.value) return;

	interactions.value = deserializeInteractions(sheet.value.interactions);

	// BEGIN backward compatibility for #2437
	const descriptionLabel = sheet.value.descriptionLabel || '';
	['Point', 'LineString', 'Polygon'].forEach((dt) => {
		if (!interactions.value.descriptionLabels[dt]) {
			interactions.value.descriptionLabels[dt] = descriptionLabel;
		}
	});
	sheet.value.descriptionLabel = '';
	// END backward compatibility for #2437

	// BEGIN backward compatibility for #2434
	const survey = safeParseJSON(sheet.value.survey);
	if (survey?.showResultsOnly) {
		interactions.value.enabled.push('ShowResultsOnly');
		delete survey.showResultsOnly;
		sheet.value.survey = JSON.stringify(survey);
	}
	// END backward compatibility for #2434

	if (ratings.value) sheet.value.ratings = ratings.value;
}
init();

provide('interactions', interactions);
provide('sheet', sheet);

useHead({
	title: () =>
		`Admin: ${project.value?.title} (${Number(sheetOrd) + 1}/${project.value?.sheets?.length})`,
});

const { changeBaseMap, loading } = useStore();
const contentModified = ref(false);

const isFirstSheet = computed(() => sheet.value?.ord === 0);
const isLastSheet = computed(() => sheet.value?.ord === (project.value?.sheets?.length || 0) - 1);
const previewUrl = computed(() => {
	return `/${locale.value}/p/${project.value?.slug}/${sheet.value?.ord}?force=1`;
});
const { confirmLeavingUnsaved } = useConfirmation();
async function canLeavePage() {
	if (!contentModified.value) return true;
	return confirmLeavingUnsaved();
}
async function back() {
	if (!(await canLeavePage())) return;
	navigateTo(localePath(`/admin/project/${project.value?.id}`));
}
function goToSheetOrd(ord: number) {
	navigateTo(localePath(`/admin/project/${project.value?.id}/${ord}`));
}
async function next() {
	if (!(await canLeavePage())) return;
	goToSheetOrd((sheet.value?.ord || -1) + 1);
}
async function prev() {
	if (!(await canLeavePage())) return;
	if (isFirstSheet.value) {
		back();
	} else {
		goToSheetOrd((sheet.value?.ord || 1) - 1);
	}
}
function addedSheet(sheet: Sheet) {
	project.value?.sheets?.push(sheet);
	next();
}

const isInteractive = computed(
	() =>
		interactions.value.enabled.includes('Point') ||
		interactions.value.enabled.includes('LineString') ||
		interactions.value.enabled.includes('Polygon'),
);
const interactionOptions = computed(() => {
	const options = [];
	if (!sheet.value) return;

	const ia = (interactionName: string) => ({
		value: interactionName,
		text: t(`sheetEditor.interactions.${interactionName}`),
	});

	if (sheet.value.features) {
		// map sheet
		if (!sheet.value.survey) {
			// interactive map sheet
			options.push(ia('Point'), ia('LineString'), ia('Polygon'));
			if (isInteractive.value) options.push(ia('naming'));
		} else {
			options.push(ia('Rating'));
		}
	} else {
		options.push(ia('SocialSharing'));
	}
	return options;
});
function hasSettings(ia: string) {
	return ['Point', 'LineString', 'Polygon', 'Rating'].includes(ia);
}
const surveyQuestions = computed<Question[] | undefined>(() => {
	const survey = safeParseJSON(sheet.value?.survey || '{}') as Survey;
	return survey.questions;
});
const isAllResultsEnabled = computed(() => {
	if (!interactions.value.enabled.includes('RatingResults')) return false;
	const questionsWithResults = surveyQuestions.value?.filter(
		(q: Question) => q.type && q.type !== 'text',
	);
	if (questionsWithResults?.some((q: Question) => !q.showResult)) return false;
	return true;
});
const canHaveResults = computed(() => {
	if (interactions.value.enabled.includes('Rating')) return true;
	return (surveyQuestions.value?.length || 0) > 0;
});
const someResultsEnabled = computed(() => {
	if (interactions.value.enabled.includes('RatingResults')) return true;
	return surveyQuestions.value?.some((q) => q.showResult);
});
function toggleInteraction(ia: string, enabled: boolean) {
	if (enabled) {
		if (!interactions.value.enabled.includes(ia)) {
			interactions.value.enabled.push(ia);
		}
	} else {
		interactions.value.enabled = interactions.value.enabled.filter((i) => i !== ia);
	}
}
function handleInteractionModified(
	drawType: string,
	buttonLabel: string,
	descriptionLabel: string,
	featureLabel: string,
	featureQuestion: Record<string, string>,
) {
	interactions.value.buttonLabels[drawType] = buttonLabel;
	interactions.value.descriptionLabels[drawType] = descriptionLabel;
	interactions.value.featureLabels[drawType] = featureLabel;
	interactions.value.featureQuestions[drawType] = featureQuestion;
}
function handleRatingInteractionModified(
	ratingExplanation: boolean,
	ratingProsCons: boolean,
	ratingQuestion: string,
	ratingResults: boolean,
	stars: number,
) {
	interactions.value.ratingQuestion = ratingQuestion;
	interactions.value.stars = stars;
	toggleInteraction('RatingExplanation', ratingExplanation);
	toggleInteraction('RatingProsCons', ratingProsCons);
	toggleInteraction('RatingResults', ratingResults);
}
watch(
	interactions,
	(interactions) => {
		if (!sheet.value) return;
		sheet.value.interactions = serializeInteractions(interactions);
		if (interactions.baseMap) changeBaseMap(interactions.baseMap);
	},
	{
		deep: true,
	},
);
function openInteractionSettings(ia: string) {
	if (hasSettings(ia) && interactions.value.enabled.includes(ia)) {
		// FIXME this.$bvModal.show(ia + '-modal');
	}
}

const showAllResults = ref(false);
function showAllResultsClicked() {
	if (!sheet.value) return;
	const showResults = showAllResults.value;
	toggleInteraction('RatingResults', showResults);
	const survey = safeParseJSON(sheet.value?.survey || '{}');
	survey.questions?.forEach((q: Question) => (q.showResult = showResults));
	sheet.value.survey = JSON.stringify(survey);
}
onMounted(() => {
	showAllResults.value = isAllResultsEnabled.value;
});
watch(
	sheet,
	() => {
		contentModified.value = true;
		showAllResults.value = isAllResultsEnabled.value;
	},
	{ deep: true },
);

const backgroundImage = ref();
const backgroundImageState = ref();
const backgroundImageData = ref();
function removeBackground() {
	backgroundImage.value = null;
	if (sheet.value) sheet.value.image = null;
}
watch(backgroundImage, (val) => {
	contentModified.value = true;
	backgroundImageData.value = null;
	if (!val) {
		// clear validation error message on file removal
		backgroundImageState.value = null;
		return;
	}

	const valid = backgroundImage.value.size < 5 * 1024 * 1024;
	backgroundImageState.value = valid;
	if (valid) {
		const reader = new FileReader();
		reader.onloadend = () => {
			backgroundImageData.value = reader.result;
		};
		reader.readAsDataURL(val);
	}
});

const newSheetModalVisible = ref(false);

function openNewSheetModal() {
	newSheetModalVisible.value = true;
}

async function uploadBackground() {
	if (!backgroundImageState.value) return;
	try {
		const formData = new FormData();
		formData.append('image', backgroundImage.value);
		sheet.value = await $fetch(`/api/sheet/${sheet.value?.id}/image`, {
			method: 'PUT',
			body: formData,
		});
		backgroundImage.value = null;
	} catch (error) {
		errorToast(t('imageUpload.failed'));
	}
}

const { errorToast, successToast } = useToasts();
async function save() {
	// FIXME make sure sheet.features stays empty if it was empty

	try {
		loading.value = true;

		if (backgroundImage.value) {
			await uploadBackground();
		}

		sheet.value = await $fetch(`/api/sheet/${sheet.value?.id}`, {
			method: 'PATCH',
			body: sheet.value,
		});
		await nextTick();
		contentModified.value = false;
		successToast(t('sheetEditor.success'));
	} catch {
		errorToast(t('sheetEditor.saveFailed'));
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<SheetFrame
		v-if="project && sheet"
		:background-image-url="backgroundImageData || sheet.image"
	>
		<Sidebar
			admin
			:back-label="$t('sheetEditor.back')"
			:fixed="!sheet.features"
			:loading="loading"
			:project="project"
			@back="back"
		>
			<form-group :label="$t('sheetEditor.sheetName')">
				<input
					v-model="sheet.title"
					class="form-control form-control-lg"
				/>
			</form-group>
			<form-group
				class="rich"
				:label="$t('sheetEditor.sheetDescription')"
			>
				<tiptap v-model="sheet.description" />
			</form-group>

			<client-only>
				<b-form-group
					v-if="!sheet.features"
					:invalid-feedback="$t('imageUpload.maxFileSize')"
					:state="backgroundImageState"
				>
					<template #label>
						<h6 class="mb-0">
							{{ $t('sheetEditor.backgroundImage') }}
						</h6>
					</template>
					<b-input-group v-if="!sheet.image">
						<b-form-file
							v-model="backgroundImage"
							accept="image/jpeg, image/png, image/webp"
							class="sheet-background-input"
							browse-text=""
							:drop-placeholder="$t('imageUpload.dropzone')"
							:placeholder="$t('imageUpload.browse')"
							:state="backgroundImageState"
						/>
						<template #append>
							<b-button
								:disabled="!backgroundImage"
								variant="outline-danger"
								@click="removeBackground"
							>
								<i class="fas fa-backspace" />
							</b-button>
						</template>
					</b-input-group>
					<b-button
						v-else
						class="w-100"
						variant="outline-danger"
						@click="removeBackground"
					>
						{{ $t('imageUpload.remove') }}
					</b-button>
				</b-form-group>
			</client-only>

			<!-- FIXME
			<b-form-group v-if="sheet.survey">
				<template #label>
					<h6 class="mb-0">{{ $t('sheetEditor.survey') }}</h6>
				</template>
				<client-only>
					<SurveyEditor
						v-model="sheet.survey"
						:project="project"
						:sheet="sheet"
					/>
				</client-only>
			</b-form-group>

			<b-form-group v-if="interactionOptions.length">
				<template #label>
					<h6 class="mb-0">
						{{ $t('sheetEditor.visitorInteractions') }}
					</h6>
				</template>
				<b-list-group class="mb-3">
					<b-list-group-item
						v-for="o in interactionOptions"
						:key="o.value"
						class="d-flex p-0 align-items-center"
					>
						<div class="p-2">
							<b-form-checkbox
								v-model="interactions.enabled"
								:value="o.value"
								@change="openInteractionSettings(o.value)"
							>
								{{ o.text }}
							</b-form-checkbox>
						</div>
						<b-button
							v-if="hasSettings(o.value)"
							class="border-0 ms-auto px-2 py-2 rounded-0"
							variant="outline-primary"
							:disabled="!interactions.enabled.includes(o.value)"
							@click="openInteractionSettings(o.value)"
						>
							<i class="fas fa-fw fa-cog" />
						</b-button>
					</b-list-group-item>
				</b-list-group>
				<InteractionSettingsModal
					v-for="dt in ['Point', 'LineString', 'Polygon']"
					:id="dt + '-modal'"
					:key="dt"
					:draw-type="dt"
					:interactions="interactions"
					@modified="handleInteractionModified"
				/>
				<RatingSettingsModal
					:interactions="interactions"
					@modified="handleRatingInteractionModified"
				/>
			</b-form-group>

			<b-form-group v-if="canHaveResults">
				<template #label>
					<h6 class="mb-0">
						{{ $t('SheetContent.results') }}
					</h6>
				</template>
				<b-form-checkbox
					v-model="showAllResults"
					@change="showAllResultsClicked"
				>
					{{ $t('sheetEditor.showAllResults') }}
				</b-form-checkbox>
				<b-form-checkbox
					v-if="someResultsEnabled"
					v-model="interactions.enabled"
					value="ShowResultsOnly"
				>
					{{ $t('sheetEditor.interactions.ShowResultsOnly') }}
				</b-form-checkbox>
			</b-form-group>

			<b-form-group
				v-if="isInteractive || sheet.features"
				:label="$t('sheetEditor.defaultBaseMap')"
			>
				<b-form-select
					v-model="interactions.baseMap"
					:options="baseMaps"
				/>
			</b-form-group>

			<FeatureList
				v-if="sheet.features"
				:filename="sheet.title"
				:is-interactive="isInteractive"
				is-on-editor-view
			/> -->

			<template #footer>
				<div class="align-items-center d-flex justify-content-between p-2 w-100">
					<div class="fixed-width">
						<b-button
							variant="primary"
							@click="prev"
						>
							<i class="fas fa-fw fa-chevron-left" />
						</b-button>
					</div>
					<SaveButton
						:content-modified="contentModified"
						@save="save"
					/>
					<b-button
						v-if="project.id"
						:href="previewUrl"
						target="_blank"
						variant="outline-primary"
					>
						<i class="fas fa-external-link-alt fa-fw" />
					</b-button>
					<div class="fixed-width">
						<b-button
							v-if="!isLastSheet"
							variant="primary"
							@click="next"
						>
							<i class="fas fa-fw fa-chevron-right" />
						</b-button>
						<b-button
							v-else
							variant="success"
							@click="openNewSheetModal"
						>
							<i class="fas fa-fw fa-plus" />
						</b-button>
					</div>
				</div>
			</template>
		</Sidebar>

		<div
			v-if="sheet.features"
			class="flex-grow-1"
		>
			<Map
				:key="$route.path"
				:features="safeParseJSONArray(sheet.features)"
				:initial-base-map-key="interactions.baseMap"
			/>
			<MapToolbar />
			<MapHint />
		</div>

		<NewSheetModal
			v-model="newSheetModalVisible"
			:project-id="project.id"
			@added-sheet="addedSheet"
		/>
	</SheetFrame>
</template>
