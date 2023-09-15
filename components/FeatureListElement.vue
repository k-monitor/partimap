<template>
	<div
		class="mt-1 rounded"
		:class="{ highlight: selectedFeature }"
	>
		<b-list-group-item
			ref="feature"
			button
			:class="[
				{
					selected: selectedFeature,
					disabled: onEditMode,
					rated: !selectedFeature && !editable && rated,
				},
			]"
			class="px-2 rounded"
			:style="{ borderLeftColor: form.color }"
			@click="featureClicked()"
		>
			<span class="text-break">
				<i
					class="fas fa-fw mr-1"
					:class="icons[feature.getGeometry().getType()]"
				/>
				<i
					v-if="form.hidden"
					class="fas fa-eye-slash fa-fw mr-1"
				/>
				{{ form.name }}
			</span>
			<span v-if="selectedFeature">
				<i class="fas fa-fw fa-times" />
			</span>
			<span
				v-else-if="editable && !readonly"
				class="ml-auto text-danger"
				role="button"
				@click.stop="deleteFeature"
			>
				<i class="fas fa-fw fa-trash" />
			</span>
			<span v-else-if="rated">
				<i class="fas fa-fw fa-check" />
			</span>
			<span
				v-else-if="showResults"
				class="flex-shrink-0"
				>{{ ratingResult }}</span
			>
		</b-list-group-item>
		<b-collapse
			:id="`collapse-${feature.getId()}`"
			:visible="selectedFeature"
			accordion="my-accordion"
			@shown="expandFinished()"
		>
			<b-card
				v-if="selectedFeature"
				ref="card"
				body-class="pb-0"
				class="collapse-content py-0"
				:class="{
					'd-sm-none':
						!editable &&
						!form.category &&
						!form.description &&
						!visitorCanRate,
				}"
			>
				<b-form-group
					v-if="readonly && form.questionAnswer"
					:label="feature.get('partimapFeatureQuestion')"
				>
					{{ form.questionAnswer.join(', ') }}
				</b-form-group>

				<div v-if="editable">
					<b-row
						v-if="!visitor && !readonly"
						align-h="between"
						align-v="center"
					>
						<b-col>
							<b-form-group
								:label="$t('FeatureListElement.color')"
							>
								<b-form-input
									id="type-color"
									v-model="form.color"
									size="sm"
									type="color"
									list="presetColors"
								/>
								<datalist id="presetColors">
									<option>#F44336</option>
									<option>#E91E63</option>
									<option>#9C27B0</option>
									<option>#673AB7</option>
									<option>#3F51B5</option>
									<option>#2196F3</option>
									<option>#03A9F4</option>
									<option>#00BCD4</option>
									<option>#009688</option>
									<option>#4CAF50</option>
									<option>#8BC34A</option>
									<option>#CDDC39</option>
									<option>#FFEB3B</option>
									<option>#ffc107</option>
									<option>#FF9800</option>
									<option>#FF5722</option>
									<option>#795548</option>
									<option>#9E9E9E</option>
									<option>#000000</option>
									<option>#607D8B</option>
								</datalist>
							</b-form-group>
						</b-col>
						<b-col>
							<b-form-group
								:label="$t('FeatureListElement.size')"
							>
								<b-form-input
									v-model="form.width"
									size="sm"
									type="number"
								/>
							</b-form-group>
						</b-col>
					</b-row>
					<b-form-group
						v-if="
							!visitor &&
							!readonly &&
							feature.getGeometry().getType() !== 'Point'
						"
						:label="$t('FeatureListElement.dashType')"
					>
						<b-form-select
							v-model="form.dash"
							size="sm"
							:options="dashOptions"
						/>
					</b-form-group>
					<b-form-group
						v-if="!visitor || visitorCanName"
						:label="$t('FeatureListElement.name')"
					>
						<b-form-input
							v-model="form.name"
							:disabled="readonly"
							size="sm"
							type="text"
						/>
					</b-form-group>

					<b-form-group
						v-if="!visitor && !readonly"
						:label="$t('FeatureListElement.mapLabel')"
					>
						<b-form-input
							v-model.trim="form.partimapMapLabel"
							size="sm"
							type="text"
						/>
					</b-form-group>
					<b-form-group v-if="!!form.partimapMapLabel">
						<div class="d-flex align-items-center">
							<div>-90°</div>
							<b-form-input
								v-model.number="form.partimapMapLabelAngle"
								class="mx-2 mb-1"
								max="90"
								min="-90"
								step="5"
								type="range"
							/>
							<div>90°</div>
						</div>
					</b-form-group>

					<b-form-group
						v-if="!visitor && !readonly"
						:label="$t('FeatureListElement.category')"
					>
						<vue-typeahead-bootstrap
							v-model="form.category"
							:placeholder="$t('FeatureListElement.category')"
							size="sm"
							:data="categories"
							:min-matching-chars="0"
							show-all-results
							show-on-focus
						/>
					</b-form-group>

					<b-form-group
						v-if="visitor && question"
						:label="question.label"
					>
						<CheckboxGroup
							v-model="visitorAnswer"
							:q="question"
						/>
					</b-form-group>

					<b-form-group
						v-if="visitor"
						:label="
							descriptionLabel ||
							$t('sheetEditor.defaultDescriptionLabel')
						"
					>
						<b-textarea v-model="form.description" />
					</b-form-group>
					<b-form-group
						v-else-if="!readonly"
						class="rich"
						:label="$t('FeatureListElement.description')"
					>
						<client-only>
							<tiptap v-model="form.description" />
						</client-only>
					</b-form-group>
					<b-form-group
						v-else
						:label="$t('FeatureListElement.description')"
					>
						<TipTapDisplay
							v-if="readonly"
							:html="form.description"
						/>
					</b-form-group>
				</div>
				<div v-else>
					<b-badge
						v-if="form.category"
						class="border border-secondary mb-2"
						variant="light"
						v-text="form.category"
					/>
					<TipTapDisplay
						class="mb-3"
						:html="form.description"
					/>
				</div>

				<b-form-group
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
				</b-form-group>

				<b-form-group v-if="adminCanHide">
					<b-form-checkbox
						v-model="form.hidden"
						name="hidden"
					>
						{{ $t('FeatureListElement.hidden') }}
					</b-form-checkbox>
				</b-form-group>

				<b-form-group v-if="editable && !readonly">
					<div
						class="align-items-center d-flex justify-content-between"
					>
						<span
							class="mr-auto text-danger"
							role="button"
							@click.stop="deleteFeature"
						>
							<i class="fas fa-fw fa-trash mr-1" />
							{{ $t('FeatureListElement.deleteFeature') }}
						</span>
						<b-button
							variant="success"
							@click="featureClicked"
						>
							{{ $t('SaveButton.save') }}
						</b-button>
					</div>
				</b-form-group>

				<div
					v-else
					class="d-sm-none mb-3 text-center"
				>
					<b-button
						variant="primary"
						@click="setSidebarVisible(false)"
					>
						<i class="fas fa-map-marked-alt position-relative" />
						{{ $t('FeatureListElement.jumpToMap') }}
					</b-button>
				</div>
			</b-card>
		</b-collapse>
	</div>
</template>

<script>
import Feature from 'ol/Feature';
import { mapGetters, mapMutations } from 'vuex';
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';
import TipTapDisplay from './TipTapDisplay.vue';

// TODO visitor, editable & readonly - all mean slightly different things here, need a cleanup (separate components)

export default {
	components: {
		VueTypeaheadBootstrap,
		TipTapDisplay,
	},
	props: {
		categories: {
			type: Array,
			default: () => [],
		},
		descriptionLabel: {
			type: String,
			default: null,
		},
		feature: {
			type: Feature,
			default: new Feature(),
		},
		initFeatureRating: {
			type: Object,
			default: () => {}, // { average, count, ... }
		},
		question: {
			type: Object,
			default: null,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		showResults: {
			type: Boolean,
			default: false,
		},
		stars: {
			type: Number,
			default: 5,
		},
		visitor: {
			type: Boolean,
			default: false,
		},
		visitorCanRate: {
			type: Boolean,
			default: false,
		},
		visitorCanName: {
			type: Boolean,
			default: false,
		},
		adminCanHide: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			confirmedClose: false,
			form: {
				name: this.getFeatureName(),
				category: this.feature.get('category') || '', // empty string is important for typeahead comp
				color: this.feature.get('color'),
				dash: this.feature.get('dash'),
				description: this.feature.get('description'),
				hidden: this.feature.get('hidden') || false,
				partimapMapLabel: this.feature.get('partimapMapLabel') || '',
				partimapMapLabelAngle: Number(
					this.feature.get('partimapMapLabelAngle') || 0
				),
				questionAnswer: JSON.parse(
					this.feature.get('partimapFeatureQuestion_ans') || '[]'
				),
				width: this.feature.get('width'),
			},
			rating: Number(this.initFeatureRating.average || 0),
			dashOptions: [
				{
					text: this.$t('FeatureListElement.dashTypes.p0'),
					value: '0',
				},
				{
					text: this.$t('FeatureListElement.dashTypes.p11'),
					value: '1,1',
				},
				{
					text: this.$t('FeatureListElement.dashTypes.p21'),
					value: '2,1',
				},
				{
					text: this.$t('FeatureListElement.dashTypes.p41'),
					value: '4,1',
				},
				{
					text: this.$t('FeatureListElement.dashTypes.p1131'),
					value: '1,1,3,1',
				},
			],
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
		selectedFeature() {
			return this.getSelectedFeature === this.feature;
		},
		onEditMode() {
			return this.$store.getters.getEditState;
		},
		rated() {
			const r = this.rating;
			return Number.isInteger(r) && r !== 0 && !this.showResults;
		},
		ratingResult() {
			const r = this.initFeatureRating;
			if (!r.count) return;
			if (this.stars === -2) {
				return `👍 ${r.likeCount} 👎 ${Math.abs(r.dislikeCount)}`;
			} else {
				const avg = Math.round(r.average * 10) / 10;
				return `⭐ ${Number(avg).toFixed(1)}`;
			}
		},
		visitorAnswer: {
			get() {
				return this.form.questionAnswer;
			},
			set(answer) {
				this.form.questionAnswer = answer;
			},
		},
		visitorFilledEverything() {
			if (!this.form.description) return false;
			if (this.question && !this.visitorAnswer?.length) return false;
			return true;
		},
	},
	watch: {
		getSidebarVisible(v) {
			if (v && this.selectedFeature) {
				this.expandFinished();
			}
		},
		'form.category'() {
			this.feature.set('category', this.form.category);
			this.$emit('categoryEdited');
		},
		'form.hidden'(h) {
			if (h) {
				this.feature.set('hidden', true);
			} else {
				this.feature.unset('hidden');
			}
		},
		'form.name'() {
			this.feature.set('name', this.form.name);
		},
		'form.partimapMapLabel'() {
			this.feature.set('partimapMapLabel', this.form.partimapMapLabel);
		},
		'form.partimapMapLabelAngle'() {
			this.feature.set(
				'partimapMapLabelAngle',
				this.form.partimapMapLabelAngle
			);
		},
		'form.description'() {
			this.feature.set('description', this.form.description);
		},
		'form.questionAnswer'() {
			this.feature.set('partimapFeatureQuestion', this.question.label);
			this.feature.set(
				'partimapFeatureQuestion_ans',
				JSON.stringify(this.form.questionAnswer)
			);
		},
		form: {
			handler(val) {
				this.emitChangeStyle();
				this.$nuxt.$emit('contentModified');
			},
			deep: true,
		},
		showResults(v) {
			if (v) {
				// need reinitialization...
				this.rating = Number(this.initFeatureRating.average || 0);
			}
		},
		rating(rating) {
			if (this.showResults) {
				return;
			}
			this.feature.set('rating', rating);
			this.$nuxt.$emit(
				'featureRatedByVisitor',
				this.feature.getId(),
				rating
			);
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
		...mapMutations(['setSidebarVisible']),
		emitChangeStyle() {
			this.$nuxt.$emit(
				'changeStyle',
				this.feature,
				this.form.color,
				this.form.dash,
				this.form.width
			);
		},
		getFeatureName() {
			const anon = this.$t('FeatureListElement.defaultName')[
				this.feature.getGeometry().getType()
			];
			return this.feature.get('name') || anon;
		},
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
		async canDeselectFeature() {
			if (
				this.visitor &&
				this.editable &&
				!this.visitorFilledEverything &&
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
			const confirmed = await this.confirmDeletion(
				this.form.name || this.feature.id
			);
			if (confirmed) {
				this.$nuxt.$emit('clearFeature', this.feature);
			}
		},
		expandFinished() {
			// custom scrollIntoView as its more accurate:
			const t = this.$refs.feature?.offsetTop || 0;
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

.rated {
	opacity: 0.6;
}

.list-group-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem 1rem;
	border-left: 5px solid transparent;
}
.selected > span:first-child {
	font-weight: bold;
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
