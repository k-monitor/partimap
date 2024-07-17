<script setup lang="ts">
import type { BCard } from 'bootstrap-vue-next';
import type { Feature as GeoJsonFeature } from 'geojson';
import type FeatureListElementHeader from '~/components/featureList/FeatureListElementHeader.vue';
import type { AggregatedRating } from '~/server/data/ratings';
import type { Sheet } from '~/server/data/sheets';

const { t } = useI18n();

const { selectedFeatureId, sidebarVisible } = useStore();
const { getVisitorRatings } = useVisitorData();

const sheet = inject<Ref<Sheet | null>>('sheet', ref(null));
const interactions = inject<Ref<Interactions | null>>('interactions', ref(null));

const props = withDefaults(
	defineProps<{
		aggregatedRating?: AggregatedRating | null;
		categories: string[];
		feature: GeoJsonFeature;
		isInteractive: boolean;
		isOnEditorView?: boolean;
		isOnSheetView?: boolean;
		isOnSubmittedView?: boolean;
		showResults?: boolean;
	}>(),
	{
		aggregatedRating: null,
		isInteractive: true,
	},
);

provide('feature', props.feature);

const aggregatedRating = toRef(props, 'aggregatedRating');
provide('aggregatedRating', aggregatedRating);

const emit = defineEmits<{
	(e: 'change', f: GeoJsonFeature): void;
	(e: 'delete'): void;
}>();

const feature = toRef(props, 'feature');
const featureJSON = computed(() => JSON.stringify(feature.value));
watch(featureJSON, () => emit('change', feature.value));
// If I'd change feature itself, it would emit even without changes for some reason

const isSelected = computed(() => selectedFeatureId.value === String(props.feature.id || ''));
const isDeletable = computed(
	() =>
		props.isOnEditorView ||
		(props.isOnSheetView && props.isInteractive) ||
		props.isOnSubmittedView,
);

const confirmedClose = ref(false);

const drawingInteraction = computed(() =>
	lookupDrawingInteraction(interactions?.value, feature.value),
);

const question = computed(() => {
	const q = drawingInteraction.value?.featureQuestion;
	return q?.label ? q : null;
});

const showSaveButtonOnStaticSheet = computed(() => {
	const ias = interactions?.value?.enabled || [];
	if (!ias.includes('Rating')) return false;
	if (!ias.includes('RatingExplanation') && !ias.includes('RatingProsCons')) {
		return false;
	}
	const ratings = !sheet.value ? {} : getVisitorRatings(sheet.value.id);
	const rating = ratings[String(props.feature.id || '')] || {
		value: undefined,
	};
	return !!rating.value && !props.showResults;
});

const visitorCanDescribe = computed(() => drawingInteraction.value?.describing);
const visitorCanName = computed(() => drawingInteraction.value?.naming);

const visitorCanRate = computed(() => {
	return interactions?.value?.enabled?.includes('Rating');
});

watch(sidebarVisible, (v) => {
	if (v && isSelected.value) {
		expandFinished();
	}
});

onMounted(() => {
	if (isSelected.value) {
		expandFinished();
	}
});

const featureRef = ref<InstanceType<typeof FeatureListElementHeader> | null>();
const cardRef = ref<InstanceType<typeof BCard> | null>();

async function expandFinished() {
	// custom scrollIntoView as its more accurate:
	await nextTick();
	const t = featureRef.value?.$el?.offsetTop || 0;
	document.getElementsByClassName('sidebar-body')[0].scrollTop = t - 75;
	if (props.isOnSheetView && cardRef.value) {
		const firstInput = cardRef.value?.$el?.querySelector('input,textarea') as
			| HTMLInputElement
			| HTMLTextAreaElement
			| undefined;
		firstInput?.focus();
	}
}

function getRatingObj() {
	const ratings = !sheet.value ? {} : getVisitorRatings(sheet.value.id);
	return ratings[String(feature.value.id || '')] || { value: undefined };
}

const visitorFilledEverything = computed(() => {
	if (props.isInteractive) {
		const needAnswer = !!question.value;
		const needDescription = drawingInteraction.value?.describing;
		if (!needAnswer && !needDescription) return true;

		const hasAnswer =
			safeParseJSONArray(feature.value.properties?.partimapFeatureQuestion_ans).length > 0;
		const hasDescription = feature.value.properties?.description;
		if (hasAnswer || hasDescription) return true;

		return false;
	} else if (feature.value.properties?.rating) {
		const ratingObj = getRatingObj();
		const ias = interactions?.value?.enabled || [];
		if (ias.includes('RatingExplanation')) {
			if (!ratingObj.answer) return false;
		} else if (ias.includes('RatingProsCons')) {
			if (!ratingObj.pros && !ratingObj.cons) return false;
		}
	}
	return true;
});

const { confirmFeatureClose } = useConfirmation();

async function canDeselectFeature() {
	if (props.isOnSheetView && !visitorFilledEverything.value && !confirmedClose.value) {
		const confirmed = await confirmFeatureClose();
		if (!confirmed) return false;
		confirmedClose.value = true;
	}
	return true;
}

const { emitSelectAttempt, onSelectAttempt } = useSelectAttempt();

async function featureClicked() {
	if (isSelected.value) {
		const canDeselect = await canDeselectFeature();
		if (!canDeselect) return;
		selectedFeatureId.value = null;
		document.querySelector('.sidebar-body')?.scrollTo(0, 0);
	} else {
		emitSelectAttempt(feature.value);
	}
}

onSelectAttempt(async (clickedFeature) => {
	// TODO would be nice to make it clearer (e.g. work only with curr = clicked case) and move it up to FL

	const currentId = String(feature.value.id || '');
	const clickedId = String(clickedFeature?.id || '');
	const isHidden = clickedFeature?.properties?.hidden && props.isOnSheetView;

	if (!selectedFeatureId.value) {
		if (clickedId === currentId) {
			// no feature selected currently
			// this feature was clicked on map
			// --> finalize feature selection
			selectedFeatureId.value = clickedId;
		}
		return;
	}

	// this feature is selected currently

	if (clickedId !== currentId) {
		// another feature was clicked
		// --> confirm as needed
		const canDeselect = await canDeselectFeature();
		if (canDeselect) {
			if (isHidden) {
				selectedFeatureId.value = null;
			} else {
				selectedFeatureId.value = clickedId;
				// this will also open the sidebar but with delay
				// logic in Sidebar.vue
			}
		} else {
			sidebarVisible.value = true;
		}
	} else {
		// this feature was clicked on map
		// --> open sidebar if needed
		sidebarVisible.value = true;
	}
});

const { confirmDeletion } = useConfirmation();

async function deleteFeature() {
	const anon = t(`FeatureListElement.defaultName.${feature.value.geometry.type}`);
	const nonEmptyName = feature.value.properties?.name || anon;
	const confirmed = await confirmDeletion(nonEmptyName || props.feature.id);
	if (!confirmed) return;
	emit('delete');
}
</script>

<template>
	<div
		class="feature-list-element mt-1 rounded"
		:class="{ highlight: isSelected }"
	>
		<div
			v-if="isSelected"
			class="fle-backdrop"
			@click="featureClicked"
		/>
		<FeatureListElementHeader
			ref="featureRef"
			:is-deletable="isDeletable"
			:is-selected="isSelected"
			:show-result="!!showResults"
			@click="featureClicked"
			@delete="deleteFeature"
		/>
		<client-only>
			<b-collapse
				accordion="feature-list-accordion"
				:visible="isSelected"
				@show="expandFinished"
			>
				<b-card
					v-if="isSelected"
					ref="cardRef"
					body-class="pb-3"
					class="collapse-content py-0"
					:class="{
						/* only hiding above 'sm' because below we have the jump btn */
						'd-sm-none':
							isOnSheetView &&
							!isInteractive &&
							!feature.properties?.category &&
							!feature.properties?.description &&
							!visitorCanRate,
					}"
				>
					<div
						class="d-flex flex-column"
						style="gap: 1rem"
					>
						<template v-if="isOnSubmittedView">
							<JumpToMapButton />
							<SubmittedFeatureInfo />
							<FeatureListElementFooter
								show-delete
								@delete="deleteFeature"
							/>
						</template>
						<template v-if="isOnSheetView">
							<template v-if="isInteractive">
								<FeatureNameEditor v-if="visitorCanName" />
								<FeatureQuestionDisplay />
								<FeatureDescriptionPlainEditor v-if="visitorCanDescribe" />
								<FeatureListElementFooter
									show-delete
									show-save
									@delete="deleteFeature"
									@save="featureClicked"
								/>
							</template>
							<template v-else>
								<JumpToMapButton />
								<TipTapDisplay :html="feature.properties?.description" />
								<FeatureRatingControls
									v-if="visitorCanRate"
									:show-results="!!showResults"
								/>
								<FeatureListElementFooter
									v-if="showSaveButtonOnStaticSheet"
									show-save
									@save="featureClicked"
								/>
							</template>
						</template>
						<template v-if="isOnEditorView">
							<FeatureRatingControls
								v-if="aggregatedRating?.count"
								show-results
							/>
							<FeatureNameEditor />
							<FeatureStyleEditor />
							<FeatureCategoryEditor :categories="categories" />
							<FeatureDescriptionRichEditor />
							<FeatureHideCheckbox v-if="!!sheet && !isInteractive" />
							<FeatureListElementFooter
								show-delete
								show-save
								@delete="deleteFeature"
								@save="featureClicked"
							/>
						</template>
					</div>
				</b-card>
			</b-collapse>
		</client-only>
	</div>
</template>

<style scoped>
.highlight {
	z-index: 100;
}

.fle-backdrop {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
}

.collapse-content {
	border-top: none;
	border-radius: 0 0 0.25rem 0.25rem;
}
.card-body {
	padding: 1rem;
}

.char-count {
	position: absolute;
	margin-top: 2px;
	font-size: 60%;
}
</style>
