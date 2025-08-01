<script setup lang="ts">
// TODO spaghetti, need to decouple into multiple components/composables

import type { Feature as GeoJsonFeature } from 'geojson';
import type { Extent } from 'ol/extent';
import type { Project } from '~/server/data/projects';
import type { AggregatedRating } from '~/server/data/ratings';
import type { Sheet } from '~/server/data/sheets';
import type { Question, Survey } from '~/server/data/surveyAnswers';
import type { OnOffInteraction } from '~/utils/interactions';

const { locale, t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { id, sheetOrd } = route.params;

const { drawType, loading } = useStore();

const { data: project } = await useFetch<Project>(`/api/project/${id}`);

const sheet = ref(project.value?.sheets?.[Number(sheetOrd)]); // sheets are ordered on server
const interactions = ref<Interactions>(deserializeInteractions(sheet.value));

// #2434 cleanup
if (sheet.value && (sheet.value?.survey || '').includes('showResultsOnly')) {
	const survey: Survey = safeParseJSON(sheet.value?.survey) || {};
	delete survey.showResultsOnly;
	sheet.value.survey = JSON.stringify(survey);
}

// #2437 cleanup
if (sheet.value) sheet.value.descriptionLabel = '';

const { data: ratings } = await useFetch<Record<number, AggregatedRating>>(
	`/api/sheet/${sheet.value?.id}/ratings`,
);

const sheetWithRatings = computed(() => {
	if (!sheet.value) return null;
	return { ...sheet.value, ratings: ratings.value };
});

provide('interactions', interactions);
provide('project', project);
provide('sheet', sheetWithRatings);

useHead({
	title: () =>
		`Admin: ${project.value?.title} (${Number(sheetOrd) + 1}/${project.value?.sheets?.length})`,
});

const contentModified = ref(false);

const features = ref(safeParseJSONArray(sheet.value?.features) as GeoJsonFeature[]);
const featuresJson = computed(() => JSON.stringify(features.value));
watch(featuresJson, () => (contentModified.value = true));

function handleFeatureDrawn(feature: GeoJsonFeature) {
	features.value.push(feature);
}

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
	if (!sheet.value) return;
	if (!(await canLeavePage())) return;
	goToSheetOrd(sheet.value.ord + 1);
}
async function prev() {
	if (!sheet.value) return;
	if (!(await canLeavePage())) return;
	if (isFirstSheet.value) {
		back();
	} else {
		goToSheetOrd(sheet.value?.ord - 1);
	}
}
function addedSheet(sheet: Sheet | undefined) {
	if (!sheet) return;
	project.value?.sheets?.push(sheet);
	next();
}

const isInteractive = computed(() => isItInteractive(interactions.value));

const surveyQuestions = computed(() => {
	const survey: Survey = safeParseJSON(sheet.value?.survey) || {};
	return survey.questions || [];
});

const isAllResultsEnabled = computed(() => {
	if (!interactions.value.enabled.includes('RatingResults')) return false;
	const questionsWithResults = surveyQuestions.value.filter(
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
	return surveyQuestions.value.some((q) => q.showResult);
});

function toggleInteraction(ia: OnOffInteraction, enabled: boolean) {
	if (enabled) {
		if (!interactions.value.enabled.includes(ia)) {
			interactions.value.enabled.push(ia);
		}
	} else {
		interactions.value.enabled = interactions.value.enabled.filter((i) => i !== ia);
	}
}

watch(
	interactions,
	(interactions) => {
		if (!sheet.value) return;
		sheet.value.interactions = serializeInteractions(interactions);
	},
	{
		deep: true,
	},
);

const showAllResults = ref(isAllResultsEnabled.value);

function showAllResultsClicked() {
	if (!sheet.value) return;
	const showResults = showAllResults.value;
	toggleInteraction('RatingResults', showResults);
	const survey: Survey = safeParseJSON(sheet.value?.survey) || {};
	(survey.questions || []).forEach((q: Question) => (q.showResult = showResults));
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

async function uploadBackground() {
	if (!backgroundImageState.value) return;
	try {
		const formData = new FormData();
		formData.append('image', backgroundImage.value);
		sheet.value = await $fetch<Sheet>(`/api/sheet/${sheet.value?.id}/image`, {
			method: 'PUT',
			body: formData,
		});
		backgroundImage.value = null;
	} catch (error) {
		errorToast(t('imageUpload.failed'));
	}
}

const questionIdsRefByDIs = ref<number[]>([]);

function gatherQuestionIdsRefByDIs() {
	return interactions.value.drawing.flatMap((di) => di.showIf.map((c) => c[0][0]));
}

onMounted(() => {
	questionIdsRefByDIs.value = gatherQuestionIdsRefByDIs();
});

function saveSheet(s: Sheet) {
	return $fetch<Sheet>(`/api/sheet/${s.id}`, {
		method: 'PATCH',
		body: s,
	});
}

async function modifyOtherSheetsIfNeeded() {
	const prev = questionIdsRefByDIs.value;
	const current = gatherQuestionIdsRefByDIs();
	const newIds = current.filter((id) => !prev.includes(id));
	await Promise.all(
		(project.value?.sheets || []).map((sheet) => {
			const survey = parseSurvey(sheet.survey);
			if (!survey) return;
			const questions = survey.questions || [];
			if (!questions.length) return;
			let modified = false;
			survey.questions = questions.map((q) => {
				if (newIds.includes(q.id)) {
					q.addToFeatures = true;
					modified = true;
				}
				return q;
			});
			if (!modified) return;
			return saveSheet({ ...sheet, survey: JSON.stringify(survey) });
		}),
	);
	questionIdsRefByDIs.value = current;
}

const { errorToast, successToast } = useToasts();
async function save() {
	if (!sheet.value) return;
	try {
		loading.value = true;
		sheet.value = await saveSheet({
			...sheet.value,
			features: sheet.value.features ? JSON.stringify(features.value) : null,
		});
		await modifyOtherSheetsIfNeeded();
		if (backgroundImage.value) {
			await uploadBackground();
		}
		await nextTick();
		contentModified.value = false;
		successToast(t('sheetEditor.success'));
	} catch {
		errorToast(t('sheetEditor.saveFailed'));
	} finally {
		loading.value = false;
	}
}

function startDrawingExtent() {
	drawType.value = 'box';
}

function handleExtentDrawn(extent: Extent) {
	if (!sheet.value) return;
	sheet.value.extent = JSON.stringify(extent);
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
					<ImageFileInput
						v-model="backgroundImage"
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

			<form-group
				v-if="sheet.survey"
				:label="$t('sheetEditor.survey')"
			>
				<SurveyEditor
					v-model="sheet.survey"
					:sheets="project.sheets || []"
					@modified="save"
				/>
			</form-group>

			<InteractionsEditor
				v-model="interactions"
				@modified="save"
			/>

			<form-group
				v-if="canHaveResults"
				:label="$t('SheetContent.results')"
			>
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
			</form-group>

			<form-group
				v-if="isInteractive || sheet.features"
				:label="$t('sheetEditor.defaultBaseMap')"
			>
				<b-form-select
					v-model="interactions.baseMap"
					:options="baseMaps.map((bm) => bm.id)"
				/>
			</form-group>

			<div
				v-if="isInteractive"
				class="form-group"
			>
				<button
					v-if="!sheet.extent"
					:disabled="drawType !== ''"
					class="btn btn-primary"
					@click="startDrawingExtent"
				>
					<i class="fas fa-fw fa-expand me-1" />
					{{ $t('sheetEditor.drawExtent') }}
				</button>
				<button
					v-else
					class="btn btn-danger"
					@click="sheet.extent = null"
				>
					<i class="fas fa-fw fa-expand me-1" />
					{{ $t('sheetEditor.clearExtent') }}
				</button>
			</div>

			<FeatureList
				v-if="sheet.features"
				v-model="features"
				:filename="sheet.title"
				:is-interactive="isInteractive"
				is-on-editor-view
			/>

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
							@click="newSheetModalVisible = true"
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
				:features="features"
				:show-bubbles="isInteractive"
				:view-extent="safeParseJSON(sheet.extent) || undefined"
				@extent-drawn="handleExtentDrawn"
				@feature-drawn="handleFeatureDrawn"
			/>
			<EdgeDrawingButtons side="right" />
			<MapHint />
		</div>

		<NewSheetModal
			v-model="newSheetModalVisible"
			:project-id="project.id"
			@added-sheet="addedSheet"
		/>
	</SheetFrame>
</template>
