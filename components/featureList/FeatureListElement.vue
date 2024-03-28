<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';

const { t } = useI18n();

const { selectedFeatureId, sidebarVisible } = useStore();

const sheet = inject<Record<string, any>>('sheet', {}); // FIXME Sheet type
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

const featureRef = ref<HTMLElement>();
const cardRef = ref<HTMLElement>();

function expandFinished() {
	// custom scrollIntoView as its more accurate:
	const t = featureRef.value?.offsetTop || 0;
	document.getElementsByClassName('sidebar-body')[0].scrollTop = t - 75;
	if (props.isOnSheetView && cardRef.value) {
		const firstInput = cardRef.value.querySelector('input,textarea') as
			| HTMLInputElement
			| HTMLTextAreaElement;
		if (firstInput?.tagName === 'TEXTAREA' || firstInput?.getAttribute('type') === 'text')
			firstInput.focus();
	}
}

/*
export default {
	computed: {
		...mapGetters('visitordata', ['getVisitorRatings']),
	},
	created() {
		this.$nuxt.$on('selectAttempt', this.handleSelectAttempt);
	},
	beforeUnmount() {
		this.$nuxt.$off('selectAttempt', this.handleSelectAttempt);
	},
	methods: {
		async handleSelectAttempt(clickedFeature) {
			const currentId = this.feature?.getId();
			const selectedId = this.getSelectedFeature?.getId();
			const clickedId = clickedFeature?.getId();
			const isHidden = clickedFeature?.get('hidden') && this.isOnSheetView;

			if (!selectedId && clickedId === currentId) {
				// no feature selected currently
				// this feature was clicked on map
				// --> finalize feature selection
				this.$store.commit('selected/change', clickedFeature);
			}

			if (!this.selectedFeature) return;
			// this feature is selected currently

			if (clickedId !== currentId) {
				// another feature was clicked
				// --> confirm as needed
				const canDeselect = await this.canDeselectFeature();
				if (canDeselect) {
					if (isHidden) {
						this.$store.commit('selected/clear');
					} else {
						this.$store.commit('selected/change', clickedFeature);
						// this will also open the sidebar but with delay
						// logic in Sidebar.vue
					}
				} else {
					this.setSidebarVisible(true);
				}
			} else {
				// this feature was clicked on map
				// --> open sidebar if needed
				this.setSidebarVisible(true);
			}
		},
		visitorFilledEverything() {
			if (this.isInteractive) {
				if (!this.feature.get('description')) return false;
				if (!this.question) return true;
				try {
					const answer = JSON.parse(this.feature.get('partimapFeatureQuestion_ans'));
					if (!Array.isArray(answer) || !answer.length) return false;
				} catch {
					return false;
				}
			} else if (this.feature.get('rating')) {
				const ratingObj = this.getRatingObj();
				const ias = this.interactions?.enabled;
				if (ias.includes('RatingExplanation')) {
					if (!ratingObj.answer) return false;
				} else if (ias.includes('RatingProsCons')) {
					if (!ratingObj.pros && !ratingObj.cons) return false;
				}
			}

			return true;
		},
		getRatingObj() {
			const ratings = this.getVisitorRatings(this.sheet?.id) || {};
			return ratings[this.feature.getId()] || { value: undefined };
		},
		async canDeselectFeature() {
			if (this.isOnSheetView && !this.visitorFilledEverything() && !this.confirmedClose) {
				const confirmed = await this.confirmFeatureClose();
				if (!confirmed) return false;
				this.confirmedClose = true;
			}
			return true;
		},
		async featureClicked() {
			if (this.selectedFeature) {
				const canDeselect = await this.canDeselectFeature();
				if (!canDeselect) return;
				this.$store.commit('selected/remove', this.feature);
				document.querySelector('.b-sidebar-body').scrollTo(0, 0);
			} else {
				this.$nuxt.$emit('selectAttempt', this.feature);
			}
		},
	},
};*/

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
		<!-- FIXME -->
		<!-- <b-collapse
			:id="`collapse-${feature.id}`"
			:visible="isSelected"
			accordion="my-accordion"
			@shown="expandFinished()"
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
							<FeatureDescriptionPlainEditor />
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
								:show-results="showResults"
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
							v-if="aggregatedRating.count"
							show-results
						/>
						<FeatureNameEditor />
						<FeatureStyleEditor />
						<FeatureCategoryEditor
							:categories="categories"
							@change="$emit('categoryEdited')"
						/>
						<FeatureDescriptionRichEditor />
						<FeatureHideCheckbox v-if="!!sheet && !isInteractive" />
						<FeatureListElementFooter
							save
							@delete="deleteFeature"
							@save="featureClicked"
						/>
					</template>
				</div>
			</b-card>
		</b-collapse> -->
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
