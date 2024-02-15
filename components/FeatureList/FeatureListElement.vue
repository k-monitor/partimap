<template>
	<div
		class="mt-1 rounded"
		:class="{ highlight: selectedFeature }"
	>
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
					'd-sm-none':
						!editable &&
						!feature.get('category') &&
						!feature.get('description') &&
						!visitorCanRate,
				}"
			>
				<template v-if="isOnSubmittedView">
					<SubmittedFeatureInfo />
					<JumpToMapButton class="mb-3" />
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
						<StaticFeatureInfo />

						<FeatureRatingControls />
						<!-- TODO ^ need results + show results -->

						<JumpToMapButton />
					</template>
				</template>

				<template v-if="isOnEditorView">
					<FeatureNameEditor />
					<FeatureStyleEditor />
					<FeatureCategoryEditor
						:categories="categories"
						@change="$emit('categoryEdited')"
					/>
					<FeatureDescriptionRichEditor />

					<FeatureRatingControls />
					<!-- TODO ^ v-if initFeatureRating.count -->
					<!-- TODO ^ need results + readonly/disabled/results -->

					<FeatureHideCheckbox />
					<FeatureListElementFooter
						save
						@delete="deleteFeature"
						@save="featureClicked"
					/>
				</template>

				<!-- <b-form-group
					v-if="
						(visitor && !editable && visitorCanRate) ||
						(!visitor && initFeatureRating.count)
					"
				>
					<b-button-group
						v-if="stars === -2"
						class="w-100"
					>
						<b-button
							:disabled="!visitor || showResults"
							:variant="
								rating === 1 ? 'success' : 'outline-success'
							"
							@click="rating === 1 ? (rating = 0) : (rating = 1)"
						>
							<i class="fas fa-thumbs-up" />
							<span
								v-if="!visitor || showResults"
								class="ml-2"
							>
								{{ initFeatureRating.likeCount || 0 }}
							</span>
						</b-button>
						<div class="flex-grow-1" />
						<b-button
							:disabled="!visitor || showResults"
							:variant="
								rating === -1 ? 'danger' : 'outline-danger'
							"
							@click="
								rating === -1 ? (rating = 0) : (rating = -1)
							"
						>
							<i class="fas fa-thumbs-up fa-flip-both" />
							<span
								v-if="!visitor || showResults"
								class="ml-2"
							>
								{{ initFeatureRating.dislikeCount || 0 }}
							</span>
						</b-button>
					</b-button-group>
					<div
						v-else
						class="border d-flex font-weight-bold justify-content-center p-1"
					>
						<StarRating
							v-model="rating"
							active-color="var(--brand)"
							:animate="visitor && !showResults"
							border-color="var(--brand)"
							:border-width="2"
							clearable
							inactive-color="#fff"
							:max-rating="stars"
							:read-only="!visitor || showResults"
							:round-start-rating="false"
							:show-rating="false"
							:star-size="16"
						/>
						<span
							v-if="!visitor || showResults"
							class="ml-2"
						>
							{{ rating ? Number(rating).toFixed(1) : '-' }}
							(<small class="fas fa-user fa-fw" />
							{{ initFeatureRating.count || 0 }})
						</span>
					</div>
				</b-form-group> -->
			</b-card>
		</b-collapse>
	</div>
</template>

<script>
import Feature from 'ol/Feature';
import { mapGetters } from 'vuex';

// TODO visitor, editable & isOnSubmittedView - all mean slightly different things here, need a cleanup (separate components)

export default {
	provide() {
		return {
			aggregatedRating: this.aggregatedRating,
			feature: this.feature,
		};
	},
	inject: ['interactions'],
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
		visitor: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			confirmedClose: false,
			editable: !this.visitor || this.feature.get('visitorFeature'),
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
			return true;
		},
		async canDeselectFeature() {
			if (
				this.isOnSheetView &&
				this.isInteractive &&
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
			if (this.visitor && this.$refs.card) {
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
	box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5), 0 0 0 10000px rgba(0, 0, 0, 0.5);
	z-index: 9999;
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
