<template>
	<div
		class="mt-1 rounded"
		:class="{ highlight: selectedFeature }"
	>
		<div
			v-if="selectedFeature"
			class="fle-backdrop"
			@click="featureClicked"
		/>
		<FeatureListElementHeader
			ref="feature"
			:is-deletable="isDeletable"
			:is-selected="selectedFeature"
			:show-result="showResults"
			@click="featureClicked"
			@delete="deleteFeature"
		/>
		<b-collapse
			:id="`collapse-${feature.getId()}`"
			:visible="selectedFeature"
			accordion="my-accordion"
			@shown="expandFinished()"
		>
			<b-card
				v-if="selectedFeature"
				ref="card"
				body-class="pb-3"
				class="collapse-content py-0"
				:class="{
					/* only hiding above 'sm' because below we have the jump btn */
					'd-sm-none':
						isOnSheetView &&
						!isInteractive &&
						!feature.get('category') &&
						!feature.get('description') &&
						!visitorCanRate,
				}"
			>
				<div
					class="d-flex flex-column"
					style="gap: 1rem"
				>
					<template v-if="isOnSubmittedView">
						<SubmittedFeatureInfo />
						<JumpToMapButton />
						<FeatureListElementFooter @delete="deleteFeature" />
					</template>
					<template v-if="isOnSheetView">
						<template v-if="isInteractive">
							<FeatureNameEditor v-if="visitorCanName" />
							<FeatureQuestionDisplay />
							<FeatureDescriptionPlainEditor />
							<FeatureListElementFooter
								save
								@delete="deleteFeature"
								@save="featureClicked"
							/>
						</template>
						<template v-else>
							<TipTapDisplay :html="feature.get('description')" />
							<FeatureRatingControls
								v-if="visitorCanRate"
								:show-results="showResults"
							/>
							<JumpToMapButton />
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
		</b-collapse>
	</div>
</template>

<script>
import Feature from 'ol/Feature';
import { mapGetters } from 'vuex';

export default {
	provide() {
		return {
			aggregatedRating: this.aggregatedRating,
			feature: this.feature,
		};
	},
	inject: {
		interactions: {
			default: null,
		},
		sheet: {
			default: null,
		},
	},
	props: {
		aggregatedRating: {
			type: Object,
			default: () => {},
		},
		categories: {
			type: Array,
			default: () => [],
		},
		feature: {
			type: Feature,
			default: new Feature(),
		},
		isInteractive: {
			type: Boolean,
			default: true,
		},
		isOnEditorView: {
			type: Boolean,
			default: false,
		},
		isOnSheetView: {
			type: Boolean,
			default: false,
		},
		isOnSubmittedView: {
			type: Boolean,
			default: false,
		},
		showResults: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			confirmedClose: false,
			icons: {
				Point: 'fa-map-marker-alt',
				LineString: 'fa-route',
				Polygon: 'fa-draw-polygon',
			},
		};
	},
	computed: {
		...mapGetters(['getSidebarVisible']),
		...mapGetters({ getSelectedFeature: 'selected/getSelectedFeature' }),
		...mapGetters('visitordata', ['getVisitorRatings']),
		isDeletable() {
			return (
				this.isOnEditorView ||
				(this.isOnSheetView && this.isInteractive) ||
				this.isOnSubmittedView
			);
		},
		selectedFeature() {
			return this.getSelectedFeature === this.feature;
		},
		question() {
			const dt = this.feature.getGeometry().getType();
			const q = this.interactions?.featureQuestions[dt] || {};
			return q.label ? q : null;
		},
		stars() {
			return this.interactions?.stars;
		},
		visitorCanName() {
			return this.interactions?.enabled.includes('naming');
		},
		visitorCanRate() {
			return this.interactions?.enabled.includes('Rating');
		},
	},
	watch: {
		getSidebarVisible(v) {
			if (v && this.selectedFeature) {
				this.expandFinished();
			}
		},
	},
	mounted() {
		// notify feature list to initialize category tags/autocomplete
		this.$emit('categoryEdited');
		// When an element is created, scroll to it
		if (this.selectedFeature) {
			this.expandFinished();
		}
	},
	created() {
		this.$nuxt.$on('selectAttempt', this.handleSelectAttempt);
	},
	beforeDestroy() {
		this.$nuxt.$off('selectAttempt', this.handleSelectAttempt);
	},
	methods: {
		async handleSelectAttempt(clickedFeature) {
			const currentId = this.feature?.getId();
			const selectedId = this.getSelectedFeature?.getId();
			const clickedId = clickedFeature?.getId();
			if (!selectedId && clickedId === currentId) {
				// no feature selected currently
				// this feature was clicked on map
				// --> finalize feature selection
				this.$store.commit('selected/change', clickedFeature);
			} else if (this.selectedFeature && clickedId !== currentId) {
				// this feature is selected currently
				// another feature was clicked on map
				// --> confirm as needed
				const canDeselect = await this.canDeselectFeature();
				if (canDeselect) {
					this.$store.commit('selected/change', clickedFeature);
				}
			}
		},
		visitorFilledEverything() {
			if (this.isInteractive) {
				if (!this.feature.get('description')) return false;
				if (!this.question) return true;
				try {
					const answer = JSON.parse(
						this.feature.get('partimapFeatureQuestion_ans')
					);
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
					if (!ratingObj.pros || !ratingObj.cons) return false;
				}
			}

			return true;
		},
		getRatingObj() {
			const ratings = this.getVisitorRatings(this.sheet?.id) || {};
			return ratings[this.feature.getId()] || { value: undefined };
		},
		async canDeselectFeature() {
			if (
				this.isOnSheetView &&
				!this.visitorFilledEverything() &&
				!this.confirmedClose
			) {
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
		async deleteFeature() {
			const anon = this.$t('FeatureListElement.defaultName')[
				this.feature.getGeometry().getType()
			];
			const nonEmptyName = this.feature.get('name') || anon;
			const confirmed = await this.confirmDeletion(
				nonEmptyName || this.feature.id
			);
			if (confirmed) {
				this.$nuxt.$emit('clearFeature', this.feature);
			}
		},
		expandFinished() {
			// custom scrollIntoView as its more accurate:
			const t = this.$refs.feature?.$el?.offsetTop || 0;
			document.getElementsByClassName('b-sidebar-body')[0].scrollTop =
				t - 75;
			if (this.isOnSheetView && this.$refs.card) {
				const firstInput =
					this.$refs.card.querySelector('input,textarea');
				if (
					firstInput?.tagName === 'TEXTAREA' ||
					firstInput?.type === 'text'
				)
					firstInput.focus();
			}
		},
	},
};
</script>

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
