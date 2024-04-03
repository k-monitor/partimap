<script setup lang="ts">
import type { BCard } from 'bootstrap-vue-next';
import type { Feature as GeoJsonFeature } from 'geojson';
import type FeatureListElementHeader from '~/components/featureList/FeatureListElementHeader.vue';

const { t } = useI18n();

const { selectedFeatureId, sidebarVisible } = useStore();

const sheet = inject<Record<string, any> | null>('sheet', null); // FIXME Sheet type
const interactions = inject<Record<string, any>>('interactions', {}); // FIXME Interactions type

const props = withDefaults(
	defineProps<{
		aggregatedRating: Record<string, number>; // FIXME need type
		categories: string[];
		feature: GeoJsonFeature;
		isInteractive: boolean;
		isOnEditorView: boolean;
		isOnSheetView: boolean;
		isOnSubmittedView: boolean;
		showResults: boolean;
	}>(),
	{
		isInteractive: true,
	},
);

provide('feature', props.feature);
provide('aggregatedRating', props.aggregatedRating);

const emit = defineEmits<{
	(e: 'change', f: GeoJsonFeature): void;
	(e: 'delete'): void;
}>();

const feature = toRef(props, 'feature');
watch(feature, (f) => emit('change', f), { deep: true });

const isSelected = computed(() => selectedFeatureId.value === props.feature.id);
const isDeletable = computed(
	() =>
		props.isOnEditorView ||
		(props.isOnSheetView && props.isInteractive) ||
		props.isOnSubmittedView,
);

const confirmedClose = ref(false);

const question = computed(() => {
	const dt = feature.value.geometry.type;
	const q = interactions.featureQuestions?.[dt] || {};
	return q.label ? q : null;
});

const showSaveButtonOnStaticSheet = computed(() => {
	const ias = interactions.enabled;
	if (!ias.includes('Rating')) return false;
	if (!ias.includes('RatingExplanation') && !ias.includes('RatingProsCons')) {
		return false;
	}
	const ratings: any = /*this.getVisitorRatings(this.sheet?.id) ||*/ {}; // FIXME
	const rating = ratings[String(props.feature.id)] || {
		value: undefined,
	};
	return !!rating.value && !props.showResults;
});

const stars = computed(() => {
	return interactions.stars;
});

const visitorCanName = computed(() => {
	return interactions.enabled.includes('naming');
});

const visitorCanRate = computed(() => {
	return interactions.enabled.includes('Rating');
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
		const firstInput = cardRef.value?.$el?.querySelector('input[type="text"],textarea') as
			| HTMLInputElement
			| HTMLTextAreaElement
			| undefined;
		firstInput?.focus();
	}
}

function getRatingObj() {
	// FIXME
	//const ratings = this.getVisitorRatings(this.sheet?.id) || {};
	const ratings = {} as any;
	return ratings[String(feature.value.id)] || { value: undefined };
}

const visitorFilledEverything = computed(() => {
	if (props.isInteractive) {
		if (!feature.value.properties?.description) return false;
		if (!question.value) return true;
		try {
			const answer = JSON.parse(feature.value.properties?.partimapFeatureQuestion_ans);
			if (!Array.isArray(answer) || !answer.length) return false;
		} catch {
			return false;
		}
	} else if (feature.value.properties?.rating) {
		const ratingObj = getRatingObj();
		const ias = interactions?.enabled || [];
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

	const currentId = Number(feature.value.id);
	const clickedId = Number(clickedFeature?.id);
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
			:show-result="showResults"
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
						<!-- FIXME -->
						<template v-if="isOnSubmittedView">
							<JumpToMapButton />
							<!-- <SubmittedFeatureInfo /> -->
							<FeatureListElementFooter
								show-delete
								@delete="deleteFeature"
							/>
						</template>
						<template v-if="isOnSheetView">
							<template v-if="isInteractive">
								<FeatureNameEditor v-if="visitorCanName" />
								<!-- <FeatureQuestionDisplay />
								<FeatureDescriptionPlainEditor /> -->
								<FeatureListElementFooter
									show-delete
									show-save
									@delete="deleteFeature"
									@save="featureClicked"
								/>
							</template>
							<template v-else>
								<JumpToMapButton />
								<!-- <TipTapDisplay :html="feature.properties?.description" />
								<FeatureRatingControls
									v-if="visitorCanRate"
									:show-results="showResults"
								/> -->
								<FeatureListElementFooter
									v-if="showSaveButtonOnStaticSheet"
									show-save
									@save="featureClicked"
								/>
							</template>
						</template>
						<template v-if="isOnEditorView">
							<!-- <FeatureRatingControls
								v-if="aggregatedRating.count"
								show-results
							/> -->
							<FeatureNameEditor />
							<FeatureStyleEditor />
							<!-- <FeatureCategoryEditor :categories="categories" />
							<FeatureDescriptionRichEditor /> -->
							<FeatureHideCheckbox v-if="!!sheet && !isInteractive" />
							<FeatureListElementFooter
								save
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
